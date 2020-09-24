import { Instance, InstanceCnt, InstanceState } from "./instance";

type loadImage = {
  texture: HTMLImageElement;
  status: boolean;
};

interface Options {
  width?: number;
  height?: number;
}
export class Skeleton<T extends string, U extends string> {
  private opts: Options;
  private ctx: CanvasRenderingContext2D;
  textureCache: Map<T, loadImage> = new Map();
  instanceSet: Map<string, Instance<T>> = new Map();
  constructor(ctx: CanvasRenderingContext2D, opts: Options = {}) {
    const defaultOpts = {
      width: 800,
      height: 600,
    };
    this.opts = {
      ...defaultOpts,
      ...opts,
    };
    this.ctx = ctx;
  }

  loadTexture(
    textureList: { label: T; url: string }[],
    callback?: (index: number, count: number) => void
  ) {
    return new Promise((resolve, reject) => {
      let count = 0;
      textureList.forEach(({ label, url }, index) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          this.textureCache.set(label, {
            texture: img,
            status: true,
          });
          typeof callback === "function" &&
            callback(++count, textureList.length);

          count === textureList.length && resolve();
        };
        img.onerror = () => {
          reject(`${url}资源获取失败`);
        };
      });
    });
  }

  setInstance(
    name: U,
    params: InstanceCnt,
    texture: ((ctx: CanvasRenderingContext2D, instance: Instance) => void) | T
  ): this {
    this.instanceSet.set(name, new Instance<T>(params, texture));
    return this;
  }

  setInstanceState(name: U, state: InstanceState, value: number) {
    const instance = this.instanceSet.get(name);
    if (!instance) throw new Error(`未找到 ${name} 实例`);

    instance[state] = value;
  }

  getInstance(name: U) {
    return this.instanceSet.get(name);
  }

  destoryInstance(name: U) {
    return this.instanceSet.delete(name);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.opts.width, this.opts.height);
  }

  draw(callback: (instanceSet: Map<string, Instance<T>>) => void) {
    this.clear();
    this.instanceSet.forEach((instance) => {
      typeof instance.texture === "function"
        ? instance.texture(this.ctx, instance)
        : this.ctx.drawImage(
            this.textureCache.get(instance.texture).texture,
            instance.x,
            instance.y
          );
      instance.movement(instance.vx, instance.vy);
    });
    callback(this.instanceSet);
  }
}

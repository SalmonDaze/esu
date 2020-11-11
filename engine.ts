import {
  Instance,
  InstanceCnt,
  InstanceState,
  InstanceBehavior,
} from "./instance";
import { logger } from "./Logger";
type loadImage = {
  texture: HTMLImageElement;
  status: boolean;
};

interface Options {
  width?: number;
  height?: number;
  debug: Boolean;
}
export class Skeleton<T extends string = string, U extends string = string> {
  private opts: Options;
  private defer: number = 0;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private fps: number = 60;
  private tickTime: number;
  private lastTickTime: number;
  private time: number = 0;
  private startTime: number = 0;
  private listeners = {};
  private layers: Instance[][] = [[]];
  gameState: Map<string, any> = new Map();
  textureCache: Map<T, loadImage> = new Map();
  instanceSet: Map<string, Instance<T>> = new Map();
  constructor(canvas: HTMLCanvasElement, opts: Options = { debug: false }) {
    const defaultOpts = {
      width: 800,
      height: 600,
    };
    this.opts = {
      ...defaultOpts,
      ...opts,
    };
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
  }

  loadTexture(
    textureList: { label: T; url: string }[],
    callback?: (index: number, count: number) => void
  ) {
    return new Promise((resolve, reject) => {
      let count = 0;
      textureList.forEach(({ label, url }) => {
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

  addLayer() {
    this.layers.push([]);
  }

  get LayerLength(): number {
    return this.layers.length;
  }

  setInstance({
    name,
    pos,
    behavior,
    initState = {},
    layerIndex = 0,
  }: {
    name: U;
    pos: InstanceCnt;
    behavior: InstanceBehavior;
    initState?;
    layerIndex?: number;
  }): this {
    const instance = new Instance(name, pos, behavior, initState || {}, { layerIndex })
    this.instanceSet.set(
      name,
      instance
    );
    if (!this.layers[layerIndex]) {
      logger.warn(`图层 ${layerIndex} 不存在`);
      return this;
    }
    this.layers[layerIndex || 0].push( instance );
    return this;
  }

  setVariable(type: string | Record<string, any>, value?: any): void {
    if (Object.prototype.toString.call(type) === "[object Object]") {
      for (const item of Object.entries(type)) {
        this.gameState[item[0]] = item[1];
      }
    } else {
      this.gameState[type as string] = value;
    }
  }

  getVariable(name: string, defaultValue?: any) {
    return this.gameState[name] || (this.gameState[name] = defaultValue);
  }

  getTexture(name: string) {
    return this.textureCache[name];
  }

  showFps() {
    this.ctx.fillStyle = "red";
    this.ctx.font = `16px Arial`;
    this.ctx.fillText(`FPS: ${Math.round(+this.fps.toFixed())}`, 5, 40);
    this.defer++;
    if (this.defer > 20) {
      this.defer = 0;
      this.fps = this.lastTickTime
        ? 1000 / (this.tickTime - this.lastTickTime)
        : 60;
    }
  }

  tick() {
    this.lastTickTime = this.tickTime;
    this.tickTime = +new Date();
  }

  setInstanceState(name: U, key: string, value: any) {
    const instance = this.instanceSet.get(name);
    if (!instance) throw new Error(`未找到 ${name} 实例`);
    instance.state[key] = value;
  }

  getInstance(name: U): Instance {
    return this.instanceSet.get(name);
  }

  destoryInstance(name: U) {
    const { layerIndex } = this.instanceSet.get(name).meta
    this.layers[ layerIndex ] = this.layers[ layerIndex ].filter( instance => instance.name !== name )
    this.instanceSet.delete(name);
    return this
  }

  clear() {
    this.ctx.clearRect(0, 0, this.opts.width, this.opts.height);
  }

  updateInstance() {
    this.instanceSet.forEach((instance) => {
      instance.update(this, this.time);
    });
  }

  paintInstance() {
    this.layers.forEach((layer) => {
      layer.forEach((instance) => {
        instance.draw(this);
      });
    });
  }

  addEvent(
    type: string,
    listener: (e: Event, engine: this, set: Map<string, Instance<T>>) => void
  ) {
    document.addEventListener(type, (e) => listener(e, this, this.instanceSet));
  }

  animate() {
    this.clear();
    this.tick();
    this.opts.debug && this.showFps();
    this.updateInstance();
    this.paintInstance();
    window.requestAnimationFrame(this.animate.bind(this));
  }

  startDraw() {
    this.startTime = +new Date();
    this.animate();
  }
}

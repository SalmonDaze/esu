export interface InstanceCnt {
  initVX: number;
  initVY: number;
  initX: number;
  initY: number;
}

export type InstanceState = "x" | "y" | "vx" | "vy";

export class Instance<T extends string = string>{
  private _vx: number;
  private _vy: number;
  private _x: number;
  private _y: number;
  texture: ((ctx: CanvasRenderingContext2D, instance: Instance) => void) | T;
  constructor(
    { initVX, initVY, initX, initY }: InstanceCnt,
    texture: ((ctx: CanvasRenderingContext2D, instance: Instance) => void) | T
  ) {
    this._vx = initVX;
    this._vy = initVY;
    this._x = initX;
    this._y = initY;
    this.texture = texture;
  }

  get vx() {
    return this._vx;
  }
  set vx(val) {
    this._vx = val;
  }

  get vy() {
    return this._vy;
  }
  set vy(val) {
    this._vy = val;
  }

  get x() {
    return this._x;
  }
  set x(val) {
    this._x = val;
  }

  get y() {
    return this._y;
  }
  set y(val) {
    this._y = val;
  }

  movement(vx, vy) {
    this.x += vx;
    this.y += vy;
  }
}

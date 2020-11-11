import { Skeleton } from './engine'

export interface InstanceCnt {
  initVX: number;
  initVY: number;
  initX: number;
  initY: number;
}

export interface InstanceBehavior {
  action: Function,
  paint: (instance: Instance, engine: Skeleton) => void;
}

export type InstanceState = "x" | "y" | "vx" | "vy";

export class Instance<T extends string = string> {
  private _vx: number;
  private _vy: number;
  private _x: number;
  private _y: number;
  state: Record<string, any> = {}
  action?: Function;
  paint?: (instance: this, engine: Skeleton) => void;
  name: string
  meta
  constructor(
    name: string,
    { initVX, initVY, initX, initY }: InstanceCnt,
    { action, paint }: InstanceBehavior,
    initState,
    meta: Record<string, any>
  ) {
    this.name = name
    this._vx = initVX;
    this._vy = initVY;
    this._x = initX;
    this._y = initY;
    this.action = action;
    this.paint = paint;
    this.state = initState
    this.meta = meta
  }

  update(engine: Skeleton) {
    this.action(this, engine);
  }

  draw(engine: Skeleton) {
    this.paint(this, engine)
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

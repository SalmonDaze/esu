import { Skeleton, InstanceSet } from "./engine";
import { Instance } from "./instance";

export interface CameraOpts {
  follower?: Instance;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
}

export class Camera {
  follower?: Instance;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  constructor({
    follower,
    offsetX,
    offsetY,
    width,
    height
  }: CameraOpts) {
    this.follower = follower;
    this.offsetX = offsetX
    this.offsetY = offsetY
    this.width = width
    this.height = height
  }

  getPos({ x, y }) {
      return {
          offsetX: x - this.offsetX,
          offsetY: y - this.offsetY
      }
  }

  getRender(instance: Instance, ctx: CanvasRenderingContext2D) {
    return function( draw ) {

    }
  }
//   offset() {
//     const computedInstance = this.engine.layers.map((layer) =>
//       layer.map((instance) => ({
//         ...instance,
//         x: instance.x - this.offsetX,
//         y: instance.y - this.offsetY,
//       }))
//     );
//     return computedInstance;
//   }

  render(ctx: CanvasRenderingContext2D, instanceSet: InstanceSet) {

  }
}

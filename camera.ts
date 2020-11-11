import { Skeleton } from './engine'
import { Instance } from './instance'
export class Camera {
    engine: Skeleton
    follower?: Instance
    offsetX: number
    offsetY: number
    cameraName: string
    constructor(engine: Skeleton, name: string, instance?: Instance) {
        this.engine = engine
        this.follower = instance
        this.cameraName = name
    }

    draw() {
        
    }
}
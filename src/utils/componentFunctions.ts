import { WritableSignal, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { Enemy, enemyTypes, ENEMY_ANIM, AnimationState} from "./enemyType";

export function getRandomEnemy(enemyTypes: Enemy[]) {
    const randomIndex = Math.floor(Math.random() * enemyTypes.length);
    return { ...enemyTypes[randomIndex] }; 
}



  export function setAnimationFrames
    (currentEnemy: Enemy,
    animationState: AnimationState,
    cdr: ChangeDetectorRef): void{
        const enemyType:string = currentEnemy.type;
        
        const animConfig = ENEMY_ANIM[enemyType] || ENEMY_ANIM['Bee'];
        
        animationState.frames = generateFramePaths(animConfig);
        animationState.frameIndex = 0
        animationState.currentFrame = animationState.frames[0]
        const animationSpeed = animConfig.speed;
        
        
        if (animationState.intervalId) {
            clearInterval(animationState.intervalId);
            startAnimation(animationState, animationSpeed, cdr);
        }
  }

  export function generateFramePaths(config: any): string[] {
      const frames: string[] = [];
      for (let i = 1; i <= config.frameCount; i++) {
          const framePath = `${config.folder}/${config.framePrefix}${i}${config.extension}`;
          frames.push(framePath);
      }
      return frames;
  }
  export function startAnimation(
    animationState: AnimationState, 
    animationSpeed: number, 
    cdr: ChangeDetectorRef):void {
      animationState.intervalId = setInterval(() => {
          animationState.frameIndex = (animationState.frameIndex + 1) % animationState.frames.length;
          animationState.currentFrame = animationState.frames[animationState.frameIndex];
          cdr.detectChanges();
      }, animationSpeed);
  }
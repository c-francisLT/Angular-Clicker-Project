import { Component, signal, Input, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { Enemy, enemyTypes } from "../utils/enemyType";
import { getRandomEnemy } from "../utils/componentFunctions";

const ENEMY_ANIM: { [key: string]: { folder: string; frameCount: number; framePrefix: string; extension: string; speed: number} }= {
  Bee: {
    folder: 'Bee',
    frameCount: 8,
    framePrefix: 'alien-enemy-flying',
    extension: '.png',
    speed: 50
  },

  Wolf: {
    folder: 'Wolf',
    frameCount: 6,
    framePrefix: 'werewolf-run',
    extension: '.png',
    speed: 90,
  },

  Machine: {
    folder: 'Machine',
    frameCount: 7,
    framePrefix: 'bipedal-unit',
    extension: '.png',
    speed: 200,
  },

  Ghost: {
    folder: "Ghost",
    frameCount: 4,
    framePrefix: "frame",
    extension: '.png',
    speed: 100
  }

}
@Component({
    selector: 'enemy',
    template: `
    <img [src]="currentFrame" alt="Enemy sprite">
    <p> Health: {{Health()}} </p>
    `
})

export class EnemyComponent implements OnInit, OnDestroy {
    @Input() set health(value: number) {
        this.Health.set(value);
      }
    
    @Input() set enemyType(value: string){
      if (value){
        this.setEnemyType(value)
      }
    }
    Health = signal(100);

  
    currentEnemy = getRandomEnemy(enemyTypes)
    frames: string[] = [];
    currentFrame: string = '';
    frameIndex = 0;
    intervalId: any;
    animationSpeed = 0

    constructor(private cdr: ChangeDetectorRef) {this.initializeEnemy();}

    private initializeEnemy() {
      this.Health.set(this.currentEnemy.health);
      this.setAnimationFrames();
  }

  private setEnemyType(type: string) {
      // Find the enemy type from enemyTypes array
      const enemyTemplate = enemyTypes.find(e => e.type.toLowerCase() === type.toLowerCase());
      if (enemyTemplate) {
          this.currentEnemy = { ...enemyTemplate };
          this.Health.set(this.currentEnemy.health);
          this.setAnimationFrames();
      }
  }

  private setAnimationFrames() {
      const enemyType:string = this.currentEnemy.type;
      
      const animConfig = ENEMY_ANIM[enemyType] || ENEMY_ANIM['Bee'];
      
      this.frames = this.generateFramePaths(animConfig);
      this.animationSpeed = animConfig.speed;
      
      this.frameIndex = 0;
      this.currentFrame = this.frames[0];
      
      if (this.intervalId) {
          clearInterval(this.intervalId);
          this.startAnimation();
      }
  }

  private generateFramePaths(config: any): string[] {
      const frames: string[] = [];
      for (let i = 1; i <= config.frameCount; i++) {
          // Generate path
          const framePath = `${config.folder}/${config.framePrefix}${i}${config.extension}`;
          frames.push(framePath);
      }
      return frames;
  }
  private startAnimation() {
      this.intervalId = setInterval(() => {
          this.frameIndex = (this.frameIndex + 1) % this.frames.length;
          this.currentFrame = this.frames[this.frameIndex];
          this.cdr.detectChanges();
      }, this.animationSpeed);
  }
  ngOnInit() {
    this.startAnimation();
}

  ngOnDestroy() {
    clearInterval(this.intervalId);
}
  }
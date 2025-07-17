import { Component, HostBinding ,EventEmitter, signal, Input, OnInit, OnDestroy, ChangeDetectorRef, effect } from "@angular/core";
import { ENEMY_ANIM, enemyTypes } from "../utils/enemyType";
import { getRandomEnemy } from "../utils/componentFunctions";


@Component({
    selector: 'enemy',
    styleUrl: './enemy.component.css',
    template: `
    <img [src]="currentFrame" alt="Enemy sprite">
    <p> Health: {{Health()}} </p>
    `,
    outputs: ['healthChange']
})

export class EnemyComponent implements OnInit, OnDestroy {
    @Input() set health(value: number) {
        this.Health.set(value)
      }
    
    @Input() set enemyType(value: string){
      if (value){
        this.setEnemyType(value)
      }
    }

    @HostBinding('class.low-health') get isLowHealth() {
      return this.Health() < 30;
    }
    
    @HostBinding('class.damaged') isDamaged = false;
    
    @HostBinding('class.defeated') get isDefeated() {
      return this.Health() <= 0;
    }
    
    takeDamage() {
      this.isDamaged = true;
      setTimeout(() => this.isDamaged = false, 500);
    }
    Health = signal(100);
    healthChange = new EventEmitter<number>()
  
    currentEnemy = getRandomEnemy(enemyTypes)
    frames: string[] = [];
    currentFrame: string = '';
    frameIndex = 0;
    intervalId: any;
    animationSpeed = 0

    constructor(private cdr: ChangeDetectorRef) {this.initializeEnemy()
      effect(()=>{
        if(this.Health() <= 0){
          setTimeout(()=>this.newEnemy(), 1000)
        }
      })
    }

    private initializeEnemy() {
      this.Health.set(this.currentEnemy.health);
      this.setAnimationFrames();
  }

  private setEnemyType(type: string) {
      const enemyTemplate = enemyTypes.find(e => e.type.toLowerCase() === type.toLowerCase());
      if (enemyTemplate) {
          this.currentEnemy = { ...enemyTemplate };
          this.Health.set(this.currentEnemy.health);
          this.setAnimationFrames();
          this.healthChange.emit(this.currentEnemy.health)
      }
  }

  private newEnemy() {
    if (this.Health() <= 0) {
        this.currentEnemy = getRandomEnemy(enemyTypes);
        this.Health.set(this.currentEnemy.health);
        this.setAnimationFrames();
        this.healthChange.emit(this.currentEnemy.health);
        this.isDamaged = false;
        this.cdr.detectChanges();
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
import { Component, HostBinding ,EventEmitter, signal, Input, OnInit, OnDestroy, ChangeDetectorRef, effect } from "@angular/core";
import { ENEMY_ANIM, AnimationState, enemyTypes } from "../utils/enemyType";
import { getRandomEnemy,  setAnimationFrames, startAnimation } from "../utils/componentFunctions";


@Component({
    selector: 'enemy',
    styleUrl: './enemy.component.css',
    template: `
    <img [src]="animationState.currentFrame" alt="Enemy sprite">
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
    //Fix IsDamaged to return boolean
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
    animationState: AnimationState = 
      {frames: [],
      currentFrame: '',
      frameIndex : 0,
      intervalId: 0,
      }
    

    constructor(private cdr: ChangeDetectorRef) {this.initializeEnemy()
      effect(()=>{
        if(this.Health() <= 0){
          setTimeout(()=>this.newEnemy(), 1000)
        }
      })
    }

    private initializeEnemy() {
      this.Health.set(this.currentEnemy.health);
      setAnimationFrames(this.currentEnemy, this.animationState, this.cdr);
  }
  private setEnemyType(type: string) {
      const enemyTemplate = enemyTypes.find(e => e.type.toLowerCase() === type.toLowerCase());
      if (enemyTemplate) {
          this.currentEnemy = { ...enemyTemplate };
          this.Health.set(this.currentEnemy.health);
          setAnimationFrames(this.currentEnemy, this.animationState, this.cdr);
          this.healthChange.emit(this.currentEnemy.health)
      }
  }

  private newEnemy() {
    if (this.Health() <= 0) {
        this.currentEnemy = getRandomEnemy(enemyTypes);
        this.Health.set(this.currentEnemy.health);
        setAnimationFrames(this.currentEnemy, this.animationState, this.cdr);
        this.healthChange.emit(this.currentEnemy.health);
        this.isDamaged = false;
        this.cdr.detectChanges();
    }
}



  ngOnInit() {
    startAnimation(this.animationState, ENEMY_ANIM[this.currentEnemy.type].speed, this.cdr);
}

  ngOnDestroy() {
    clearInterval(this.animationState.intervalId);
}
  }
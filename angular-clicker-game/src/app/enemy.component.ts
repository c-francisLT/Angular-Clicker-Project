import { Component, signal, Input, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";

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
    
      Health = signal(100);
    frames: string[] = [
      'alien-enemy-flying1.png',
      'alien-enemy-flying2.png',
      'alien-enemy-flying3.png',
      'alien-enemy-flying4.png'
    ];
    currentFrame: string = this.frames[0];
    frameIndex = 0;
    intervalId: any;
    constructor(private cdr: ChangeDetectorRef) {}

    ngOnInit() {
      this.intervalId = setInterval(() => {
        this.frameIndex = (this.frameIndex + 1) % this.frames.length;
        this.currentFrame = this.frames[this.frameIndex];
        this.cdr.detectChanges();
      }, 200);
    }
  
    ngOnDestroy() {
      clearInterval(this.intervalId);
    }
  }
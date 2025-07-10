import { Component, signal, Input, input } from "@angular/core";

@Component({
    selector: 'enemy',
    template: `
    <img src="enemy-sprite.png" alt="Enemy sprite">
    <p> Health: {{Health()}} </p>
    `
})

export class Enemy{
    @Input() set health(value: number){
        this.Health.set(value)
    }
    Health = signal(100)
}
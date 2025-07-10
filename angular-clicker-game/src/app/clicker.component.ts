import { Component, signal } from "@angular/core";
import { Enemy } from "./enemy.component";

@Component({
    imports: [Enemy],
    selector: 'clicker-check',
    template: `
    <enemy [health]="enemyHealth"></enemy>
    <button (click)= "damageEnemy()">Damage Enemy</button> `
})

export class Clicker{
    enemyHealth = 100

    damageEnemy(){
        this.enemyHealth -= 10
        if (this.enemyHealth < 0){
            this.enemyHealth = 0
        }
    }
}
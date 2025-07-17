import { Component} from "@angular/core";
import { EnemyComponent } from "./enemy.component";

@Component({
    imports: [EnemyComponent],
    selector: 'clicker-check',
    styleUrls: ['./clicker.component.css'],
    template: `
    <enemy 
        #enemy
        (healthChange)="onHealthChange($event)">
    </enemy>
    <button (click)="damageEnemy(enemy)">Damage Enemy</button>
    `
})
export class Clicker {
    enemyHealth = 0

    onHealthChange(newHealth: number) {
        this.enemyHealth = newHealth
    }

    damageEnemy(enemyComponent: EnemyComponent) {
        const currentHealth = enemyComponent.Health();
        const newHealth = Math.max(0, currentHealth - 10);
        enemyComponent.Health.set(newHealth);
        enemyComponent.healthChange.emit(newHealth);
        
        this.enemyHealth = newHealth;
    }
}
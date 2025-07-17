import { Enemy } from "./enemyType";
export function getRandomEnemy(enemyTypes: Enemy[]) {
    const randomIndex = Math.floor(Math.random() * enemyTypes.length);
    return { ...enemyTypes[randomIndex] }; 
}
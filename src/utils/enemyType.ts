
export type Enemy = {
    health: number;
    type: string;
  }
export type AnimationState = {
  frames: string[],
  frameIndex: number,
  currentFrame: string,
  intervalId: number |  ReturnType<typeof setInterval>
}
export const enemyTypes: Enemy[] = [
        {type: "Bee", health: 60},
        {type: "Ghost", health: 100},
        {type: "Machine", health: 150},
        {type: "Wolf", health: 80},
      ]
export const ENEMY_ANIM: { [key: string]: { folder: string; frameCount: number; framePrefix: string; extension: string; speed: number} }= {
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

export type Enemy = {
    health: number;
    type: string;
  }

export const enemyTypes: Enemy[] = [
        {type: "Bee", health: 60},
        {type: "Ghost", health: 100},
        {type: "Machine", health: 150},
        {type: "Wolf", health: 80},
      ]
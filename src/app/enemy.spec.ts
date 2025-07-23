import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EnemyComponent } from './enemy.component';
import { ChangeDetectorRef } from '@angular/core';
import { enemyTypes, ENEMY_ANIM, Enemy, AnimationState } from '../utils/enemyType';

describe('EnemyComponent', () => {
  let component: EnemyComponent;
  let fixture: ComponentFixture<EnemyComponent>;
  let cdr: ChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnemyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EnemyComponent);
    component = fixture.componentInstance;
    cdr = fixture.debugElement.injector.get(ChangeDetectorRef);
    fixture.detectChanges();
  });

  afterEach(() => {
    if (component && component.animationState && component.animationState.intervalId) {
      clearInterval(component.animationState.intervalId);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have health', () => {
    expect(component.Health()).toBeGreaterThan(0);
  });

  it('should set health through input', () => {
    component.health = 50;
    expect(component.Health()).toBe(50);
  });

  it('should have low health class when health is low', () => {
    component.Health.set(20);
    fixture.detectChanges();
    
    expect(component.isLowHealth).toBe(true);
  });

  it('should not have low health class when health is above 30', () => {
    component.Health.set(50);
    fixture.detectChanges();
    
    expect(component.isLowHealth).toBe(false);
  });

  it('should change enemy type', () => {
    component.enemyType = 'Ghost';
    expect(component.currentEnemy.type).toBe('Ghost');
    expect(component.Health()).toBe(100);
  });

  it('should change to each enemy type correctly', () => {
    const testCases = [
      { type: 'Bee', health: 60 },
      { type: 'Ghost', health: 100 },
      { type: 'Machine', health: 150 },
      { type: 'Wolf', health: 80 }
    ];

    testCases.forEach(({ type, health }) => {
      component.enemyType = type;
      expect(component.currentEnemy.type).toBe(type);
      expect(component.Health()).toBe(health);
    });
  });

  it('should emit health change when enemy type changes', () => {
    spyOn(component.healthChange, 'emit');
    
    component.enemyType = 'Ghost';
    
    expect(component.healthChange.emit).toHaveBeenCalledWith(100);
  });

  it('should not change enemy type if invalid type provided', () => {
    const initialEnemy = { ...component.currentEnemy };
    
    component.enemyType = 'InvalidEnemyType';
    
    expect(component.currentEnemy.type).toBe(initialEnemy.type);
    expect(component.Health()).toBe(initialEnemy.health);
  });

  it('should handle case-insensitive enemy type', () => {
    component.enemyType = 'GHOST';
    expect(component.currentEnemy.type).toBe('Ghost');
  });

  describe('takeDamage', () => {
    it('should set isDamaged to true when taking damage', () => {
      expect(component.isDamaged).toBe(false);
      
      component.takeDamage();
      
      expect(component.isDamaged).toBe(true);
    });

    it('should reset isDamaged after 500ms', fakeAsync(() => {
      component.takeDamage();
      expect(component.isDamaged).toBe(true);
      
      tick(500);
      
      expect(component.isDamaged).toBe(false);
    }));
  });

  describe('isDefeated', () => {
    it('should return true when health is 0', () => {
      component.Health.set(0);
      expect(component.isDefeated).toBe(true);
    });

    it('should return true when health is below 0', () => {
      component.Health.set(-10);
      expect(component.isDefeated).toBe(true);
    });

    it('should return false when health is above 0', () => {
      component.Health.set(1);
      expect(component.isDefeated).toBe(false);
    });
  });

  describe('newEnemy', () => {

  describe('initialization', () => {
    it('should initialize with random enemy', () => {
      expect(component.currentEnemy).toBeDefined();
      expect(component.currentEnemy.type).toBeDefined();
      expect(component.currentEnemy.health).toBeDefined();
    });

    it('should set health from current enemy on initialization', () => {
      expect(component.Health()).toBe(component.currentEnemy.health);
    });

    it('should initialize animation state', () => {
      expect(component.animationState).toBeDefined();
      expect(component.animationState.frames).toBeDefined();
      expect(component.animationState.currentFrame).toBeDefined();
      expect(component.animationState.frameIndex).toBe(0);
    });

    it('should have valid enemy type from available types', () => {
      const validTypes = enemyTypes.map(e => e.type);
      expect(validTypes).toContain(component.currentEnemy.type);
    });
  });

  describe('ngOnInit', () => {
    it('should start animation interval on init', () => {
      if (component.animationState.intervalId) {
        clearInterval(component.animationState.intervalId);
        component.animationState.intervalId = 0;
      }
      
      component.ngOnInit();
      
      expect(component.animationState.intervalId).toBeTruthy();
      expect(component.animationState.intervalId).not.toBe(0);
    });

    it('should use correct animation speed based on enemy type', () => {
      enemyTypes.forEach(enemy => {
        component.enemyType = enemy.type;
        if (component.animationState.intervalId) {
          clearInterval(component.animationState.intervalId);
        }
        
        component.ngOnInit();

        expect(component.animationState.intervalId).toBeTruthy();
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should clear animation interval on destroy', () => {
      component.animationState.intervalId = setInterval(() => {}, 100);
      spyOn(window, 'clearInterval');
      
      component.ngOnDestroy();
      
      expect(clearInterval).toHaveBeenCalledWith(component.animationState.intervalId);
    });

    it('should handle destroy when no interval is set', () => {
      component.animationState.intervalId = 0;
      
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe('template rendering', () => {
    it('should display current health', () => {
      component.Health.set(75);
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Health: 75');
    });

    it('should display enemy sprite image', () => {
      component.animationState.currentFrame = 'enemy-sprite.png';
      fixture.detectChanges();
      
      const img = fixture.nativeElement.querySelector('img');
      expect(img).toBeTruthy();
      expect(img.src).toContain('enemy-sprite.png');
      expect(img.alt).toBe('Enemy sprite');
    });
  });

  describe('CSS classes', () => {
    it('should apply multiple classes when conditions are met', () => {
      component.Health.set(25);
      component.takeDamage();
      fixture.detectChanges();
      
      const element = fixture.nativeElement;
      expect(element.classList.contains('low-health')).toBe(true);
      expect(element.classList.contains('damaged')).toBe(true);
    });

    it('should apply defeated class when health is 0', () => {
      component.Health.set(0);
      fixture.detectChanges();
      
      const element = fixture.nativeElement;
      expect(element.classList.contains('defeated')).toBe(true);
    });
  });

  describe('animation configuration', () => {
    it('should have animation configuration for all enemy types', () => {
      enemyTypes.forEach(enemy => {
        expect(ENEMY_ANIM[enemy.type]).toBeDefined();
        expect(ENEMY_ANIM[enemy.type].folder).toBe(enemy.type);
        expect(ENEMY_ANIM[enemy.type].frameCount).toBeGreaterThan(0);
        expect(ENEMY_ANIM[enemy.type].speed).toBeGreaterThan(0);
      });
    });

    it('should have valid frame prefixes for all enemy types', () => {
      const expectedPrefixes = {
        'Bee': 'alien-enemy-flying',
        'Wolf': 'werewolf-run',
        'Machine': 'bipedal-unit',
        'Ghost': 'frame'
      };

      Object.entries(expectedPrefixes).forEach(([type, prefix]) => {
        expect(ENEMY_ANIM[type].framePrefix).toBe(prefix);
      });
    });

    it('should generate correct frame paths', () => {
      component.enemyType = 'Bee';
      
      expect(component.animationState.frames.length).toBe(8);
      expect(component.animationState.frames[0]).toContain('Bee/alien-enemy-flying1.png');
      expect(component.animationState.frames[7]).toContain('Bee/alien-enemy-flying8.png');
    });
  });

  describe('health boundaries for each enemy type', () => {
    it('should correctly identify low health for each enemy type', () => {
      const testCases = [
        { type: 'Bee', health: 60, lowHealthThreshold: 30 },
        { type: 'Ghost', health: 100, lowHealthThreshold: 30 },
        { type: 'Machine', health: 150, lowHealthThreshold: 30 },
        { type: 'Wolf', health: 80, lowHealthThreshold: 30 }
      ];

      testCases.forEach(({ type, health, lowHealthThreshold }) => {
        component.enemyType = type;
        
        component.Health.set(lowHealthThreshold - 1);
        expect(component.isLowHealth).toBe(true);
        
    
        component.Health.set(lowHealthThreshold);
        expect(component.isLowHealth).toBe(false);
        
        component.Health.set(health);
        expect(component.isLowHealth).toBe(false);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty enemy type input', () => {
      const initialEnemy = { ...component.currentEnemy };
      
      component.enemyType = '';
      
      expect(component.currentEnemy.type).toBe(initialEnemy.type);
      expect(component.currentEnemy.health).toBe(initialEnemy.health);
    });

    it('should handle null enemy type input', () => {
      const initialEnemy = { ...component.currentEnemy };
      
      component.enemyType = null as any;
      
      expect(component.currentEnemy.type).toBe(initialEnemy.type);
      expect(component.currentEnemy.health).toBe(initialEnemy.health);
    });

    it('should handle negative health values', () => {
      component.health = -50;
      expect(component.Health()).toBe(-50);
      expect(component.isDefeated).toBe(true);
    });

    it('should handle very large health values', () => {
      component.health = 999999;
      expect(component.Health()).toBe(999999);
      expect(component.isLowHealth).toBe(false);
    });

    it('should handle rapid health changes', fakeAsync(() => {
      for (let i = 100; i >= 0; i -= 10) {
        component.Health.set(i);
        fixture.detectChanges();
      }
      
      expect(component.Health()).toBe(0);
      expect(component.isDefeated).toBe(true);
      
      tick(1000);
      expect(component.Health()).toBeGreaterThan(0);
    }));
  });
})
})
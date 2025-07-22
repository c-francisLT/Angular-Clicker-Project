import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnemyComponent } from './enemy.component';

describe('EnemyComponent', () => {
  let component: EnemyComponent;
  let fixture: ComponentFixture<EnemyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnemyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EnemyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  it('should change enemy type', () => {
    component.enemyType = 'Ghost';
    expect(component.currentEnemy.type).toBe('Ghost');
    expect(component.Health()).toBe(100);
  });
});
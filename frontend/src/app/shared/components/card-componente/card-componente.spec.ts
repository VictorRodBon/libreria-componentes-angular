import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponente } from './card-componente';

describe('CardComponente', () => {
  let component: CardComponente;
  let fixture: ComponentFixture<CardComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponente],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

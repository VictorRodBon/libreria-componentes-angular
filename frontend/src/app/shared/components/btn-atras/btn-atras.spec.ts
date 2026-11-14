import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BtnAtras } from './btn-atras';

describe('BtnAtras', () => {
  let component: BtnAtras;
  let fixture: ComponentFixture<BtnAtras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnAtras],
    }).compileComponents();

    fixture = TestBed.createComponent(BtnAtras);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

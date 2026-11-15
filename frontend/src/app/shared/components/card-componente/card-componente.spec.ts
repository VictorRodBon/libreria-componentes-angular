import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CardComponente } from './card-componente';

describe('CardComponente', () => {
  let component: CardComponente;
  let fixture: ComponentFixture<CardComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
      imports: [CardComponente],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponente);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('componente', {
      id: 1,
      nombre: 'Button',
      selector: 'app-button',
      descripcion: 'Botón reutilizable',
    });
    fixture.componentRef.setInput('categoriaSlug', 'buttons');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

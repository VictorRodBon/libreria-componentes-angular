import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ComoUsar } from './como-usar';

describe('ComoUsar', () => {
  let fixture: ComponentFixture<ComoUsar>;
  let html: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComoUsar],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(ComoUsar);
    await fixture.whenStable();
    html = fixture.nativeElement;
  });

  it('muestra los cuatro pasos como tarjetas', () => {
    expect(html.querySelectorAll('app-card').length).toBe(4);
  });

  it('empieza con todas las preguntas cerradas', () => {
    expect(html.querySelectorAll('.pregunta p').length).toBe(0);
  });

  it('al pulsar una pregunta se abre y al pulsarla otra vez se cierra', async () => {
    const boton = html.querySelector('.pregunta button') as HTMLButtonElement;

    boton.click();
    await fixture.whenStable();
    expect(html.querySelectorAll('.pregunta p').length).toBe(1);
    expect(boton.getAttribute('aria-expanded')).toBe('true');

    boton.click();
    await fixture.whenStable();
    expect(html.querySelectorAll('.pregunta p').length).toBe(0);
  });

  it('solo deja abierta una pregunta a la vez', async () => {
    const botones = html.querySelectorAll<HTMLButtonElement>('.pregunta button');

    botones[0].click();
    botones[1].click();
    await fixture.whenStable();

    expect(fixture.componentInstance.abierta()).toBe(1);
    expect(html.querySelectorAll('.pregunta p').length).toBe(1);
  });
});

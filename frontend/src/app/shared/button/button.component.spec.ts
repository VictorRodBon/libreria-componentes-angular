import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;
  let boton: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ButtonComponent] }).compileComponents();
    fixture = TestBed.createComponent(ButtonComponent);
    await fixture.whenStable();
    boton = fixture.nativeElement.querySelector('button');
  });

  it('por defecto es primary y no está deshabilitado', () => {
    expect(boton.classList).toContain('btn-primary');
    expect(boton.disabled).toBe(false);
  });

  it('cambia de clase al recibir color="secondary"', async () => {
    fixture.componentRef.setInput('color', 'secondary');
    await fixture.whenStable();
    expect(boton.classList).toContain('btn-secondary');
    expect(boton.classList).not.toContain('btn-primary');
  });

  it('se deshabilita al recibir disabled=true', async () => {
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    expect(boton.disabled).toBe(true);
  });
});

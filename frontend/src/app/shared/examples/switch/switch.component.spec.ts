import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwitchComponent } from './switch.component';

describe('SwitchComponent', () => {
  let fixture: ComponentFixture<SwitchComponent>;
  let html: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SwitchComponent] }).compileComponents();
    fixture = TestBed.createComponent(SwitchComponent);
    await fixture.whenStable();
    html = fixture.nativeElement;
  });

  const boton = () => html.querySelector('[role="switch"]') as HTMLButtonElement;

  it('por defecto está apagado y es de tamaño md', () => {
    expect(boton().getAttribute('aria-checked')).toBe('false');
    expect(boton().classList).toContain('switch-md');
    expect(boton().classList).not.toContain('on');
  });

  it('cambia de tamaño al recibir size="sm"', async () => {
    fixture.componentRef.setInput('size', 'sm');
    await fixture.whenStable();
    expect(boton().classList).toContain('switch-sm');
  });

  it('al pulsarlo se enciende y emite changed con true', async () => {
    const espia = vi.fn();
    fixture.componentInstance.changed.subscribe(espia);

    boton().click();
    await fixture.whenStable();

    expect(boton().getAttribute('aria-checked')).toBe('true');
    expect(boton().classList).toContain('on');
    expect(espia).toHaveBeenCalledWith(true);
  });

  it('toggle() no hace nada si está desactivado', async () => {
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();

    fixture.componentInstance.toggle();

    expect(fixture.componentInstance.checked()).toBe(false);
  });
});

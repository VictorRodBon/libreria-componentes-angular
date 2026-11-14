import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let fixture: ComponentFixture<AlertComponent>;
  let html: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AlertComponent] }).compileComponents();
    fixture = TestBed.createComponent(AlertComponent);
    await fixture.whenStable();
    html = fixture.nativeElement;
  });

  it('por defecto es de tipo info, visible y sin botón de cerrar', () => {
    const alerta = html.querySelector('[role="alert"]');
    expect(alerta).not.toBeNull();
    expect(alerta?.classList).toContain('alert-info');
    expect(html.querySelector('.alert-close')).toBeNull();
    expect(html.querySelector('.alert-title')).toBeNull();
  });

  it('cambia de clase al recibir type="danger"', async () => {
    fixture.componentRef.setInput('type', 'danger');
    await fixture.whenStable();
    expect(html.querySelector('.alert')?.classList).toContain('alert-danger');
  });

  it('muestra el título cuando se le pasa', async () => {
    fixture.componentRef.setInput('titulo', 'Aviso');
    await fixture.whenStable();
    expect(html.querySelector('.alert-title')?.textContent).toContain('Aviso');
  });

  it('al pulsar el botón de cerrar desaparece y emite dismissed', async () => {
    const espia = vi.fn();
    fixture.componentInstance.dismissed.subscribe(espia);
    fixture.componentRef.setInput('cerrable', true);
    await fixture.whenStable();

    (html.querySelector('.alert-close') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(espia).toHaveBeenCalledTimes(1);
    expect(html.querySelector('[role="alert"]')).toBeNull();
  });

  it('close() oculta la alerta y solo emite una vez aunque se llame dos veces', async () => {
    const espia = vi.fn();
    fixture.componentInstance.dismissed.subscribe(espia);

    fixture.componentInstance.close();
    fixture.componentInstance.close();
    await fixture.whenStable();

    expect(espia).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.visible()).toBe(false);
  });
});

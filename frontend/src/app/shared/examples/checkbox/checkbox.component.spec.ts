import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let fixture: ComponentFixture<CheckboxComponent>;
  let html: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CheckboxComponent] }).compileComponents();
    fixture = TestBed.createComponent(CheckboxComponent);
    await fixture.whenStable();
    html = fixture.nativeElement;
  });

  const casilla = () => html.querySelector('input') as HTMLInputElement;

  it('por defecto está desmarcada y activa', () => {
    expect(casilla().checked).toBe(false);
    expect(casilla().disabled).toBe(false);
  });

  it('muestra la etiqueta que recibe', async () => {
    fixture.componentRef.setInput('label', 'Acepto');
    await fixture.whenStable();
    expect(html.textContent).toContain('Acepto');
  });

  it('al hacer clic se marca y emite changed con true', async () => {
    const espia = vi.fn();
    fixture.componentInstance.changed.subscribe(espia);

    casilla().click();
    await fixture.whenStable();

    expect(fixture.componentInstance.checked()).toBe(true);
    expect(espia).toHaveBeenCalledWith(true);
  });

  it('toggle() no hace nada si está desactivada', async () => {
    const espia = vi.fn();
    fixture.componentInstance.changed.subscribe(espia);
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();

    fixture.componentInstance.toggle();

    expect(fixture.componentInstance.checked()).toBe(false);
    expect(espia).not.toHaveBeenCalled();
  });
});

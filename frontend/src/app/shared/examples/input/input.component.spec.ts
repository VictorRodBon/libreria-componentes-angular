import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let fixture: ComponentFixture<InputComponent>;
  let html: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [InputComponent] }).compileComponents();
    fixture = TestBed.createComponent(InputComponent);
    await fixture.whenStable();
    html = fixture.nativeElement;
  });

  const campo = () => html.querySelector('input') as HTMLInputElement;

  it('por defecto es de tipo text, vacío y sin etiqueta', () => {
    expect(campo().type).toBe('text');
    expect(campo().value).toBe('');
    expect(html.querySelector('label')).toBeNull();
  });

  it('muestra la etiqueta y el asterisco si es obligatorio', async () => {
    fixture.componentRef.setInput('label', 'Nombre');
    fixture.componentRef.setInput('required', true);
    await fixture.whenStable();
    expect(html.querySelector('label')?.textContent).toContain('Nombre');
    expect(html.querySelector('.required')).not.toBeNull();
    expect(campo().required).toBe(true);
  });

  it('al escribir actualiza value y emite valueChange', async () => {
    const espia = vi.fn();
    fixture.componentInstance.value.subscribe(espia);

    campo().value = 'Ana';
    campo().dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(fixture.componentInstance.value()).toBe('Ana');
    expect(espia).toHaveBeenCalledWith('Ana');
  });

  it('al pulsar Enter emite submitted con el texto', async () => {
    const espia = vi.fn();
    fixture.componentInstance.submitted.subscribe(espia);
    fixture.componentRef.setInput('value', 'hola');
    await fixture.whenStable();

    campo().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(espia).toHaveBeenCalledWith('hola');
  });

  it('clear() vacía el campo', async () => {
    fixture.componentRef.setInput('value', 'texto');
    await fixture.whenStable();

    fixture.componentInstance.clear();
    await fixture.whenStable();

    expect(campo().value).toBe('');
  });
});

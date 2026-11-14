import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpinnerComponent } from './spinner.component';

describe('SpinnerComponent', () => {
  let fixture: ComponentFixture<SpinnerComponent>;
  let spinner: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SpinnerComponent] }).compileComponents();
    fixture = TestBed.createComponent(SpinnerComponent);
    await fixture.whenStable();
    spinner = fixture.nativeElement.querySelector('.spinner');
  });

  it('por defecto es md, primary y accesible', () => {
    expect(spinner.classList).toContain('spinner-md');
    expect(spinner.classList).toContain('spinner-primary');
    expect(spinner.getAttribute('role')).toBe('status');
    expect(spinner.getAttribute('aria-label')).toBe('Cargando');
  });

  it('cambia de tamaño y de color', async () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.componentRef.setInput('color', 'danger');
    await fixture.whenStable();
    expect(spinner.classList).toContain('spinner-lg');
    expect(spinner.classList).toContain('spinner-danger');
  });

  it('usa el label recibido como texto accesible', async () => {
    fixture.componentRef.setInput('label', 'Guardando');
    await fixture.whenStable();
    expect(spinner.getAttribute('aria-label')).toBe('Guardando');
  });
});

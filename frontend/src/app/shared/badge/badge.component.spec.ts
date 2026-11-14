import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  let fixture: ComponentFixture<BadgeComponent>;
  let etiqueta: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BadgeComponent] }).compileComponents();
    fixture = TestBed.createComponent(BadgeComponent);
    await fixture.whenStable();
    etiqueta = fixture.nativeElement.querySelector('.badge');
  });

  it('por defecto es neutral y subtle', () => {
    expect(etiqueta.classList).toContain('badge-neutral');
    expect(etiqueta.classList).toContain('badge-subtle');
  });

  it('cambia de color al recibir color="danger"', async () => {
    fixture.componentRef.setInput('color', 'danger');
    await fixture.whenStable();
    expect(etiqueta.classList).toContain('badge-danger');
    expect(etiqueta.classList).not.toContain('badge-neutral');
  });

  it('cambia de variante al recibir variant="solid"', async () => {
    fixture.componentRef.setInput('variant', 'solid');
    await fixture.whenStable();
    expect(etiqueta.classList).toContain('badge-solid');
  });
});

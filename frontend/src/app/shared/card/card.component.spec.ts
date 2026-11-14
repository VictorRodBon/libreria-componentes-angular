import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let fixture: ComponentFixture<CardComponent>;
  let html: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CardComponent] }).compileComponents();
    fixture = TestBed.createComponent(CardComponent);
    await fixture.whenStable();
    html = fixture.nativeElement;
  });

  it('sin título ni subtítulo no pinta la cabecera', () => {
    expect(html.querySelector('.card')).not.toBeNull();
    expect(html.querySelector('.card-header')).toBeNull();
  });

  it('pinta el título cuando se le pasa', async () => {
    fixture.componentRef.setInput('titulo', 'Resumen');
    await fixture.whenStable();
    expect(html.querySelector('.card-title')?.textContent).toContain('Resumen');
    expect(html.querySelector('.card-subtitle')).toBeNull();
  });

  it('pinta el subtítulo cuando se le pasa', async () => {
    fixture.componentRef.setInput('subtitulo', 'Cierre Q3');
    await fixture.whenStable();
    expect(html.querySelector('.card-subtitle')?.textContent).toContain('Cierre Q3');
  });
});

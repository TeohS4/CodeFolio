import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfAnalyzer } from './pdf-analyzer';

describe('PdfAnalyzer', () => {
  let component: PdfAnalyzer;
  let fixture: ComponentFixture<PdfAnalyzer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfAnalyzer],
    }).compileComponents();

    fixture = TestBed.createComponent(PdfAnalyzer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

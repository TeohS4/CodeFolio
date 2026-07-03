import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocScanner } from './doc-scanner';

describe('DocScanner', () => {
  let component: DocScanner;
  let fixture: ComponentFixture<DocScanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocScanner],
    }).compileComponents();

    fixture = TestBed.createComponent(DocScanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

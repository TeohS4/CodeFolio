import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceAnalyzer } from './face-analyzer';

describe('FaceAnalyzer', () => {
  let component: FaceAnalyzer;
  let fixture: ComponentFixture<FaceAnalyzer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaceAnalyzer],
    }).compileComponents();

    fixture = TestBed.createComponent(FaceAnalyzer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

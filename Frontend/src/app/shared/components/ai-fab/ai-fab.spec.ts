import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiFab } from './ai-fab';

describe('AiFab', () => {
  let component: AiFab;
  let fixture: ComponentFixture<AiFab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiFab],
    }).compileComponents();

    fixture = TestBed.createComponent(AiFab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

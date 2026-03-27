import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchList } from './watch-list';

describe('WatchList', () => {
  let component: WatchList;
  let fixture: ComponentFixture<WatchList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchList],
    }).compileComponents();

    fixture = TestBed.createComponent(WatchList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

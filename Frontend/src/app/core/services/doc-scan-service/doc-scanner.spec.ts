import { TestBed } from '@angular/core/testing';

import { DocScanner } from './doc-scanner';

describe('DocScanner', () => {
  let service: DocScanner;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocScanner);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

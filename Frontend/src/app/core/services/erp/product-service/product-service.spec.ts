import { TestBed } from '@angular/core/testing';

import { ErpService } from './product-service';

describe('ErpService', () => {
  let service: ErpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { GoiDichVuService } from './goi-dich-vu.service';

describe('GoiDichVuService', () => {
  let service: GoiDichVuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoiDichVuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

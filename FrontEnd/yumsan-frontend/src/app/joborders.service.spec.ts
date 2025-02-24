import { TestBed } from '@angular/core/testing';

import { JobordersService } from './joborders.service';

describe('JobordersService', () => {
  let service: JobordersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobordersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

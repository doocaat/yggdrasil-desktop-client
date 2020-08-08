import { TestBed } from '@angular/core/testing';

import { DappsService } from './dapps.service';

describe('DappsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DappsService = TestBed.get(DappsService);
    expect(service).toBeTruthy();
  });
});

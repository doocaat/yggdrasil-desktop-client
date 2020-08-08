import { TestBed } from '@angular/core/testing';

import { DappsStoreService } from './dapps-store.service';

describe('DappsStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DappsStoreService = TestBed.get(DappsStoreService);
    expect(service).toBeTruthy();
  });
});

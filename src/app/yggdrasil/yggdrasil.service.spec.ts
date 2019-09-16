import { TestBed } from '@angular/core/testing';

import { YggdrasilService } from './yggdrasil.service';

describe('YggdrasilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YggdrasilService = TestBed.get(YggdrasilService);
    expect(service).toBeTruthy();
  });
});

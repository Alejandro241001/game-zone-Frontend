import { TestBed } from '@angular/core/testing';

import { VideogameDetailService } from './videogame-detail.service';

describe('VideogameDetailService', () => {
  let service: VideogameDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideogameDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

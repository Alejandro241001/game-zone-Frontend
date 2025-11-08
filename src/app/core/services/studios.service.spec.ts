import { TestBed } from '@angular/core/testing';

import { StudiosService } from './studios.service';

describe('StudiosService', () => {
  let service: StudiosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudiosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

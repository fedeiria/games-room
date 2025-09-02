import { TestBed } from '@angular/core/testing';

import { Validations } from './validations';

describe('Validations', () => {
  let service: Validations;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Validations);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

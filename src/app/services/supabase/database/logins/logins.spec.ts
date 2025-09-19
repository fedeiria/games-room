import { TestBed } from '@angular/core/testing';

import { Logins } from './logins';

describe('Logins', () => {
  let service: Logins;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Logins);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

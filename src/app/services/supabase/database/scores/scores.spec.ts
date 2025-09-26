import { TestBed } from '@angular/core/testing';

import { Scores } from './scores';

describe('Scores', () => {
  let service: Scores;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Scores);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

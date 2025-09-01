import { TestBed } from '@angular/core/testing';

import { Dialogs } from './dialogs';

describe('Dialogs', () => {
  let service: Dialogs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dialogs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

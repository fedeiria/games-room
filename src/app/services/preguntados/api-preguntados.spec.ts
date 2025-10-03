import { TestBed } from '@angular/core/testing';

import { ApiPreguntados } from './api-preguntados';

describe('ApiPreguntados', () => {
  let service: ApiPreguntados;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiPreguntados);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

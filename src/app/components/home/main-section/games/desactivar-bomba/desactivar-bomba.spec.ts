import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesactivarBomba } from './desactivar-bomba';

describe('DesactivarBomba', () => {
  let component: DesactivarBomba;
  let fixture: ComponentFixture<DesactivarBomba>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesactivarBomba]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesactivarBomba);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

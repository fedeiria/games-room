import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesSection } from './games-section';

describe('GamesSection', () => {
  let component: GamesSection;
  let fixture: ComponentFixture<GamesSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamesSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

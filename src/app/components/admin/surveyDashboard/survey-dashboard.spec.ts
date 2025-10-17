import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyDashboard } from './survey-dashboard';

describe('SurveyDashboard', () => {
  let component: SurveyDashboard;
  let fixture: ComponentFixture<SurveyDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

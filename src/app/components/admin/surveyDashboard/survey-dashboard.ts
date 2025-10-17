import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { Navbar } from '../../shared/layout/navbar/navbar';
import { SearchTextPipe } from '../../../pipes/search-text-pipe';
import { Surveys } from '../../../services/supabase/database/surveys/surveys';
import { Dialogs } from '../../../services/messages/dialogs';
import { Spinner } from "../../shared/spinner/spinner";

@Component({
  selector: 'app-survey-dashboard',
  imports: [CommonModule, DatePipe, FormsModule, NgxPaginationModule, Navbar, SearchTextPipe, Spinner],
  templateUrl: './survey-dashboard.html',
  styleUrl: './survey-dashboard.scss'
})
export class SurveyDashboard implements OnInit {

  public loading: boolean = false;
  public searchText: string = '';
  public surveyData: any[] = [];

  // PAGINATION
  public data = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));
  public page: number = 1;

  constructor(private dialogs: Dialogs, private surveyService: Surveys) { }

  ngOnInit(): void {
    this.loadSurveyData();
  }

  async loadSurveyData(): Promise<void> {
    this.loading = true;

    try {
      const data = await this.surveyService.getAllSurveys();
      this.surveyData = data;
    }
    catch (error) {
      console.log('[survey-dashboard]: ', error);

      this.dialogs.showDialogMessage({
        title: 'Games Room',
        content: 'Ocurrio un error al obtener los datos de las encuestas.'
      });
    }
    finally {
      this.loading = false; 
    }
  }
}

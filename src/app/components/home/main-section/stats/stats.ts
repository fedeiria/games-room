import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { Subscription } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';

import { Navbar } from "../../../shared/layout/navbar/navbar";
import { Scores } from '../../../../services/supabase/database/scores/scores';
import { Auth } from '../../../../services/supabase/auth/auth';
import { Dialogs } from '../../../../services/messages/dialogs';
import { SearchTextPipe } from '../../../../pipes/search-text-pipe';

@Component({
  selector: 'app-stats',
  imports: [CommonModule, DatePipe, FormsModule, NgxPaginationModule, Navbar, SearchTextPipe],
  templateUrl: './stats.html',
  styleUrl: './stats.scss'
})
export class Stats implements OnDestroy, OnInit {

  public searchText: string = '';
  public scoreData: any[] = [];

  private userSubscription: Subscription | undefined;

  // PAGINATION
  data = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));
  page = 1;

  constructor(private auth: Auth, private dialogs: Dialogs, private router: Router, private scores: Scores) { }

  ngOnInit(): void {
    this.userSubscription = this.auth.observableUserDetails$.subscribe(UserResponse => {
      const userId = UserResponse?.data.user?.id;

      if (userId) {
        this.loadScores(userId);
      }
      else {
        this.scoreData = [];
      }
    });
  }

  async loadScores(userId: string): Promise<void> {
    try {
      const data = await this.scores.getScoresPerUser(userId);
      this.scoreData = data;
      console.log('data: ', data);
    }
    catch (error) {
      this.dialogs.showDialogMessage({
        title: 'Games Room',
        content: 'Ocurrio un error al obtener los estadisticas de usuario.'
      });
    }
  }

  onFabClick(){
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}

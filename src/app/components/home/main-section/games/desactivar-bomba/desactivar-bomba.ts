import { Component, ɵsetAllowDuplicateNgModuleIdsForTest } from '@angular/core';
import { Router } from '@angular/router';

import { Dialogs } from '../../../../../services/messages/dialogs';
import { Scores } from '../../../../../services/supabase/database/scores/scores';

@Component({
  selector: 'app-desactivar-bomba',
  standalone: false,
  templateUrl: './desactivar-bomba.html',
  styleUrl: './desactivar-bomba.scss'
})
export class DesactivarBomba {

  private interval: any;

  public hyphenatedWord: string[] = []

  public attempts: number = 0;
  public inputValue: number = 0;
  public totalTime: number = 60;
  public timeRemaining: number = 0;
  public codeDeactivateBomb: number = 0;

  private victory: boolean = false;
  public gameOver: boolean = true;
  public activeGame: boolean = false;

  public resultColor: string = '';
  public gameResultMessage: string = 'Listo para comenzar la desactivacion';
  private initialColorCode: string = 'white';
  private colorCodeIncorrect: string = 'red';
  public startButtonText: string = 'Comenzar Juego';
  private resultMessageWin: string = '¡BOMBA DESACTIVADA!';
  private resultMessageLost: string = '¡LA BOMBA HA EXPLOTADO!';
  public gameCover: string = '../../../../../assets/images/game-cover/bomba.png';

  constructor(private dialogs: Dialogs, private router: Router, private scores: Scores) { }

  private startTimer(): void {
    if (this.interval) {
      this.resultColor = this.initialColorCode;
    }

    this.interval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      }
      else {
        this.handleGameOver(false);
      }
    }, 1000);
  }

  public startGame(): void {
    this.loadInitialValues();
    this.startTimer();
  }

  public deactivateBomb(): void {
    console.log("Codigo de desactivacion: ", this.codeDeactivateBomb);
    if (!this.activeGame) return;

    const inputAsNumber = parseInt(this.inputValue.toString(), 10);

    if (inputAsNumber === this.codeDeactivateBomb) {
      this.attempts++;
      this.handleGameOver(true);
    }
    else {
      setTimeout(() => {
        this.resultColor = this.initialColorCode;
      }, 2000);
      this.attempts++;
      this.inputValue = 0;
      this.resultColor = this.colorCodeIncorrect;
    }
  }

  handleGameOver(isVictory: boolean) {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.victory = isVictory;
    this.gameOver = true;
    this.activeGame = false;

    this.gameResultMessage = isVictory ? this.resultMessageWin : this.resultMessageLost;

    if(!this.victory) {
      this.gameCover = '../../../../../assets/images/games/desactivar-bomba/bomb-exploted.png';
    }

    this.saveResultData();
  }

  // guardo los datos de la partida
  private async saveResultData(): Promise<void> {
    try {
      await this.scores.setScore({
        gameId: 3,
        score: this.attempts,
        victory: this.victory
      });
    }
    catch (error) {
      this.dialogs.showDialogMessage({
        title: 'Games Room',
        content: 'Ocurrio un error al guardar los datos de la partida.'
      });

      console.error('[desactivar-bomba.ts] saveResultData error:', error);
    }
  }

  private loadInitialValues(): void {
    this.attempts = 0;
    this.inputValue = 0;
    this.activeGame = true;
    this.timeRemaining = 60;
    this.codeDeactivateBomb = Math.floor(Math.random() * 900) + 100;
    this.hyphenatedWord = Array(3).fill('_');
    this.startButtonText = 'Reiniciar Juego';
    this.resultColor = this.initialColorCode;
    this.gameCover = '../../../../../assets/images/game-cover/bomba.png';
  }

  public backToHome(): void {
    this.router.navigate(['/home']);
  }
}

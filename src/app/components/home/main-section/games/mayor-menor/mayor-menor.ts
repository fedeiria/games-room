import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserResponse } from '@supabase/supabase-js';

import { Dialogs } from '../../../../../services/messages/dialogs';
import { Scores } from '../../../../../services/supabase/database/scores/scores';
import { IMayorMenorCards } from '../../../../../interfaces/games/mayor-menor/imayor-menor-cards';

@Component({
  selector: 'app-mayor-menor',
  standalone: false,
  templateUrl: './mayor-menor.html',
  styleUrl: './mayor-menor.scss'
})
export class MayorMenor {

  userDetails!: UserResponse;

  private cardsToGuess: IMayorMenorCards[] = [];
  
  public score: number = 0;
  public attempts: number = 3;
  public maxAttempts: number = 3;

  private currentCard: IMayorMenorCards | null = null;
  private currentIndex: number = 0;
  private currentNumber: number = 0;
  public gameOver: boolean = false;
  public activeGame: boolean = false;
  
  public resultState: 'win' | 'tie' | 'lost' | null = null;
  public gameResultMessage: string = '';
  private resultMessageWin: string = '¡ADIVINASTE!';
  private resultMessageTie: string = '¡EMPATE!';
  private resultMessageLost: string = '¡PERDISTE!';
  public startButtonText: string = 'Comenzar Juego';
  
  public gameCover: string = '../../../../../assets/images/game-cover/mayor-menor.png';
  public cardImage: string = '../../../../../assets/images/games/mayor-menor/back-side-poker-card.png';
  public rightCardImage: string = '../../../../../assets/images/games/mayor-menor/back-side-poker-card.png';

  private cardList: IMayorMenorCards[] = [
    { type: 'spades', number: 1 },
    { type: 'spades', number: 2 },
    { type: 'spades', number: 3 },
    { type: 'spades', number: 4 },
    { type: 'spades', number: 5 },
    { type: 'spades', number: 6 },
    { type: 'spades', number: 7 },
    { type: 'spades', number: 8 },
    { type: 'spades', number: 9 },
    { type: 'spades', number: 10 },
    { type: 'spades', number: 11 },
    { type: 'spades', number: 12 },
    { type: 'spades', number: 13 },
    { type: 'clover', number: 1 },
    { type: 'clover', number: 2 },
    { type: 'clover', number: 3 },
    { type: 'clover', number: 4 },
    { type: 'clover', number: 5 },
    { type: 'clover', number: 6 },
    { type: 'clover', number: 7 },
    { type: 'clover', number: 8 },
    { type: 'clover', number: 9 },
    { type: 'clover', number: 10 },
    { type: 'clover', number: 11 },
    { type: 'clover', number: 12 },
    { type: 'clover', number: 13 },
    { type: 'hearths', number: 1 },
    { type: 'hearths', number: 2 },
    { type: 'hearths', number: 3 },
    { type: 'hearths', number: 4 },
    { type: 'hearths', number: 5 },
    { type: 'hearths', number: 6 },
    { type: 'hearths', number: 7 },
    { type: 'hearths', number: 8 },
    { type: 'hearths', number: 9 },
    { type: 'hearths', number: 10 },
    { type: 'hearths', number: 11 },
    { type: 'hearths', number: 12 },
    { type: 'hearths', number: 13 },
    { type: 'diamonds', number: 1 },
    { type: 'diamonds', number: 2 },
    { type: 'diamonds', number: 3 },
    { type: 'diamonds', number: 4 },
    { type: 'diamonds', number: 5 },
    { type: 'diamonds', number: 6 },
    { type: 'diamonds', number: 7 },
    { type: 'diamonds', number: 8 },
    { type: 'diamonds', number: 9 },
    { type: 'diamonds', number: 10 },
    { type: 'diamonds', number: 11 },
    { type: 'diamonds', number: 12 },
    { type: 'diamonds', number: 13 }
  ];

  constructor(private dialogs: Dialogs, private router: Router, private scores: Scores) { }

  // inicializa el juego
  public startGame(): void {
    this.score = 0;
    this.attempts = this.maxAttempts;
    this.activeGame = true;
    this.gameOver = false;
    this.startButtonText = 'Reiniciar Juego';
    this.cardList.sort(() => Math.random() - 0.5);
    this.cardsToGuess = [...this.cardList];
    this.currentIndex = 0;
    this.currentCard = this.cardsToGuess[this.currentIndex];
    this.currentNumber = this.currentCard.number;
    this.cardImage = `../../../../../assets/images/games/mayor-menor/${this.currentCard.type}-${this.currentCard.number}.png`;
    this.rightCardImage = '../../../../../assets/images/games/mayor-menor/back-side-poker-card.png';
  }

  // corroboro la opcion seleccionada por el jugador 
  public playMayorMenor(mayorMenor: string): void {
    const cardPlayed: number = this.currentNumber;

    // si no quedan mas cartas para adivinar finalizo el juego
    if (this.currentIndex + 1 >= this.cardsToGuess.length) {
      this.attempts = 0;
      this.chechEndGame();

      return;
    }

    this.currentIndex++;
    this.currentCard = this.cardsToGuess[this.currentIndex];
    this.currentNumber = this.currentCard.number;
    this.rightCardImage = `../../../../../assets/images/games/mayor-menor/${this.currentCard.type}-${this.currentCard.number}.png`;

    setTimeout(() => {
      this.cardImage = `../../../../../assets/images/games/mayor-menor/${this.currentCard?.type}-${this.currentCard?.number}.png`;
      this.rightCardImage = '../../../../../assets/images/games/mayor-menor/back-side-poker-card.png';
    }, 2000);

    switch (mayorMenor) {
      case 'menor':
        if (cardPlayed > this.currentNumber) {
          this.score++;
          this.gameResultMessage = this.resultMessageWin;
          this.resultState = 'win';
          this.resetMessagesValues();
        }
        else if (cardPlayed === this.currentNumber) {
          this.gameResultMessage = this.resultMessageTie;
          this.resultState = 'tie';
          this.resetMessagesValues();
        }
        else {
          this.attempts--;
          this.gameResultMessage = this.resultMessageLost;
          this.resultState = 'lost';
          this.resetMessagesValues();
        }
        break;
      case 'mayor':
        if (cardPlayed < this.currentNumber) {
          this.score++;
          this.gameResultMessage = this.resultMessageWin;
          this.resultState = 'win';
          this.resetMessagesValues();
        }
        else if (cardPlayed === this.currentNumber) {
          this.gameResultMessage = this.resultMessageTie;
          this.resultState = 'tie';
          this.resetMessagesValues();
        }
        else {
          this.attempts--;
          this.gameResultMessage = this.resultMessageLost;
          this.resultState = 'lost';
          this.resetMessagesValues();
        }
        break;
    }

    this.chechEndGame();
  }

  // corroboro si el juego ha finalizado por intentos agotados o total de cartas jugadas 
  private chechEndGame(): void {
    if (this.attempts == 0 || this.currentIndex >= this.cardsToGuess.length - 1) {
      setTimeout(() => {
        this.activeGame = false;
        this.gameOver = true;
        this.saveResultData();
        this.cardImage = '../../../../../assets/images/games/mayor-menor/back-side-poker-card.png';
        this.rightCardImage = '../../../../../assets/images/games/mayor-menor/back-side-poker-card.png';
      }, 2000);
    }
  }

  // reinicio mensajes
  private resetMessagesValues(): void {
    setTimeout(() => {
      this.gameResultMessage = '';
      this.resultState = null;
    }, 2000);
  }

  private async saveResultData(): Promise<void> {
    try {
      await this.scores.setScore({
        gameId: 2,
        score: this.score
      });
    }
    catch (error) {
      this.dialogs.showDialogMessage({
        title: 'Games Room',
        content: 'Ocurrio un error al guardar los datos de la partida.'
      });

      console.error('[mayor-menor.ts] saveResultData error:', error);
    }
  }

  public backToHome(): void {
    this.router.navigate(['/home']);
  }
}

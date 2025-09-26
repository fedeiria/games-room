import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserResponse } from '@supabase/supabase-js';
import { Scores } from '../../../../../services/supabase/database/scores/scores';
import { Dialogs } from '../../../../../services/messages/dialogs';

@Component({
  selector: 'app-mayor-menor',
  standalone: false,
  templateUrl: './mayor-menor.html',
  styleUrl: './mayor-menor.scss'
})
export class MayorMenor {

  userDetails!: UserResponse;

  cardsToGuess: any = [];
  currentCard: any = null;

  score: number = 0;
  attempts: number = 3;
  maxAttempts: number = 3;
  currentIndex: number = 0;
  currentNumber: number = 0;
  gameOver: boolean = false;
  activeGame: boolean = false;
  resultColor: string = '';
  resultColorWin: string = '';
  resultColorTie: string = '';
  resultColorLost: string = '';
  gameResultMessage: string = '';
  resultMessageWin: string = '¡ADIVINASTE!';
  resultMessageTie: string = '¡EMPATE!';
  resultMessageLost: string = '¡PERDISTE!';
  startButtonText: string = 'Comenzar Juego';
  gameCover: string = '../../../../../assets/images/game-cover/mayor-menor.png';
  cardImage: string = '../../../../../assets/images/games/mayor-menor/back-side-poker-card.png';
  rightCardImage: string = '../../../../../assets/images/games/mayor-menor/back-side-poker-card.png';

  cardList: any = [
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

  startGame() {
    this.score = 0;
    this.attempts = this.maxAttempts;
    this.activeGame = true;
    this.resultColorWin = 'green';
    this.resultColorTie = 'violet';
    this.resultColorLost = 'red';
    this.startButtonText = 'Reiniciar Juego';
    this.cardList.sort(() => Math.random() - 0.5);
    this.cardsToGuess = this.cardList.slice(0, 51);
    this.currentCard = this.cardsToGuess[this.currentIndex];
    this.currentNumber = this.currentCard.number;
    this.cardImage = `../../../../../assets/images/games/mayor-menor/${this.currentCard.type}-${this.currentCard.number}.png`;
  }

  playMayorMenor(mayorMenor: string) {
    const cardPlayed: number = this.currentNumber;
    this.currentIndex++;
    this.currentCard = this.cardsToGuess[this.currentIndex];
    this.currentNumber = this.currentCard.number;
    this.rightCardImage = `../../../../../assets/images/games/mayor-menor/${this.currentCard.type}-${this.currentCard.number}.png`;

    setTimeout(() => {
      this.cardImage = `../../../../../assets/images/games/mayor-menor/${this.currentCard.type}-${this.currentCard.number}.png`;
      this.rightCardImage = '../../../../../assets/images/games/mayor-menor/back-side-poker-card.png';
    }, 2000);

    switch (mayorMenor) {
      case 'menor':
        if (cardPlayed > this.currentNumber) {
          this.score++;
          this.gameResultMessage = this.resultMessageWin;
          this.resultColor = this.resultColorWin;
          setTimeout(() => {
            this.gameResultMessage = '';
            this.resultColor = '';
          }, 2000);
        }
        else if (cardPlayed === this.currentNumber) {
          this.gameResultMessage = this.resultMessageTie;
          this.resultColor = this.resultColorTie;
          setTimeout(() => {
            this.gameResultMessage = '';
            this.resultColor = '';
          }, 2000);
        }
        else {
          this.attempts--;
          this.gameResultMessage = this.resultMessageLost;
          this.resultColor = this.resultColorLost;
          setTimeout(() => {
            this.gameResultMessage = '';
            this.resultColor = '';
          }, 2000);
        }
        break;
      case 'mayor':
        if (cardPlayed < this.currentNumber) {
          this.score++;
          this.gameResultMessage = this.resultMessageWin;
          this.resultColor = this.resultColorWin;
          setTimeout(() => {
            this.gameResultMessage = '';
            this.resultColor = '';
          }, 2000);
        }
        else if (cardPlayed === this.currentNumber) {
          this.gameResultMessage = this.resultMessageTie;
          this.resultColor = this.resultColorTie;
          setTimeout(() => {
            this.gameResultMessage = '';
            this.resultColor = '';
          }, 2000);
        }
        else {
          this.attempts--;
          this.gameResultMessage = this.resultMessageLost;
          this.resultColor = this.resultColorLost;
          setTimeout(() => {
            this.gameResultMessage = '';
            this.resultColor = '';
          }, 2000);
        }
        break;
    }

    if (this.attempts == 0 || this.currentIndex == 51) {
      this.activeGame = false;
      this.gameOver = true;
      this.saveResultData();
    }
  }

  async saveResultData() {
    try {
      await this.scores.setScore({
        gameId: 2,
        score: this.score
      });
    }
    catch (error) {
      this.dialogs.showDialogMessage({
        title: 'Games Room',
        content: 'Ocurrio un error al guardar el puntaje.'
      });

      console.error('[mayor-menor.ts] saveResultData error:', error);
    }
  }

  backToHome() {
    this.router.navigate(['/home']);
  }
}

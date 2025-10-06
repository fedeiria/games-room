import { Component } from '@angular/core';
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
  public inputValue: number | null = null;
  public firstDigit: number = 0;
  public totalTime: number = 120;
  public timeRemaining: number = 0;
  public codeDeactivateBomb: number = 0;

  public cableColors: string[] = ['red', 'green', 'blue'];
  public correctCable: string = '';
  public selectedCable: string | null = null;
  public cutCable: string = '';
  public isCableCut: boolean = false;

  public hintMessage: string = '';
  public hintUsed: boolean = false;
  public lastGuess: number | null = null;

  private victory: boolean = false;
  public gameOver: boolean = true;
  public activeGame: boolean = false;

  public resultColor: string = '';
  public gameResultMessage: string = '';
  private initialColorCode: string = 'white';
  private colorCodeIncorrect: string = 'red';
  public startButtonText: string = 'Comenzar Juego';
  private resultMessageWin: string = '¡BOMBA DESACTIVADA!';
  private resultMessageLost: string = '¡LA BOMBA HA EXPLOTADO!';
  public gameCover: string = '../../../../../assets/images/game-cover/bomba.png';

  constructor(private dialogs: Dialogs, private router: Router, private scores: Scores) { }

  // contador de tiempo
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

  // llama a inicializar los valores y el contador del tiempo
  public startGame(): void {
    this.loadInitialValues();
    this.startTimer();
  }

  // al intentar desactivar la bomba
  public deactivateBomb(): void {
    console.log("Codigo de desactivacion: ", this.codeDeactivateBomb);

    // si se adivina el cable se cortan los intentos
    if (!this.activeGame || this.isCableCut) return;

    if (!this.inputValue) return;

    const inputAsNumber = parseInt(this.inputValue.toString(), 10);
    this.lastGuess = inputAsNumber;
    this.attempts++;

    if (inputAsNumber === this.codeDeactivateBomb) {
      this.resultColor = 'green';
    }
    else {
      if (inputAsNumber < this.codeDeactivateBomb) { 
        this.gameResultMessage = 'El código es MAYOR al número ingresado.';
      }
      else {
        this.gameResultMessage = 'El código es MENOR al número ingresado.';
      }

      setTimeout(() => {
        this.resultColor = this.initialColorCode;
      }, 2000);

      this.inputValue = 0;
      this.resultColor = this.colorCodeIncorrect;
    }
  }

  // verifica si el juego ha finalizado
  private handleGameOver(isVictory: boolean): void {
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

  // inicializa valores
  private loadInitialValues(): void {
    this.attempts = 0;
    this.inputValue = null;
    this.activeGame = true;
    this.gameOver = false;
    this.isCableCut = false;
    this.selectedCable = null;
    this.lastGuess = null;
    this.timeRemaining = 120;
    this.gameResultMessage = '';

    // genero el codigo para desactivar la bomba
    this.codeDeactivateBomb = Math.floor(Math.random() * 900) + 100;

    // obtengo el primer digito
    this.firstDigit = Math.floor(this.codeDeactivateBomb / 100);

    this.hintUsed = false;

    // selecciono el cable correcto para desactivar la bomba
    this.correctCable = this.cableColors[Math.floor(Math.random() * this.cableColors.length)];

    // asigno las pistas
    this.hintMessage = this.generateCableHint();

    this.hyphenatedWord = Array(3).fill('_');
    this.startButtonText = 'Reiniciar Juego';
    this.resultColor = this.initialColorCode;
    this.gameCover = '../../../../../assets/images/game-cover/bomba.png';
  }

  // genero las pistas del cable
  private generateCableHint(): string {
    const code = this.codeDeactivateBomb;

    if (code % 2 === 0) {
      this.correctCable = 'red';
      return `PISTA CABLE: El cable correcto está asociado a un código PAR.`;
    }
    else if (code < 400) {
      this.correctCable = 'blue';
      return `PISTA CABLE: El codigo es menor a 400.`;
    }
    else {
      this.correctCable = 'green'
      return `PISTA CABLE: El codigo correcto es IMPAR y MAYOR a 400.`;
    }
  }

  public cutCableAttempt(): void {
    // solo permito un intento de corte de cable por partida
    if (!this.activeGame || this.isCableCut || this.selectedCable === null) return;

    const colorToCut = this.selectedCable;

    this.cutCable = colorToCut;
    this.isCableCut = true; // cable cortado

    const isCodeCorrect = (this.lastGuess === this.codeDeactivateBomb);
    const isCableCorrect = (colorToCut === this.correctCable);

    // verifico condicion de victoria
    if (isCableCorrect && isCodeCorrect) {
      this.handleGameOver(true);
    }
    // falla el codigo
    else if (!isCodeCorrect) {
      this.gameResultMessage = `¡BOMBA! Código INCORRECTO: ${this.lastGuess}. Cable cortado: ${this.cutCable}`;
      this.handleGameOver(false);
    }
    // codigo correcto pero cable incorrecto
    else {
      this.gameResultMessage = 'Codigo correcto pero ¡CABLE INCORRECTO!';
      this.handleGameOver(false);
    }
  }

  // llamo al pasar por encima del cable
  public hoverCable(color: string): void {
    if (!this.activeGame || this.isCableCut) return;
    this.selectedCable = color;
  }

  // llamo al sacar el mouse del cable
  public unhoverCable(): void {
    this.selectedCable = null;
  }

  // si el usuario usa la pista numerica
  public useHint(): void {
    if (!this.activeGame || this.hintUsed) return;

    this.hintUsed = true;
    this.inputValue = this.firstDigit;
    this.gameResultMessage = `PISTA USADA: El código empieza con ${this.firstDigit}.`;
    this.resultColor = 'yellow';
  }

  // convierto el contador a mm:ss
  public get digitalTime(): string {
    const totalSeconds = this.timeRemaining;

    if (totalSeconds < 0) return '00:00';

    // calculo minutos y segundos
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // uso padStart para formatear el numero si es menor a 10
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
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

  public backToHome(): void {
    this.router.navigate(['/home']);
  }
}

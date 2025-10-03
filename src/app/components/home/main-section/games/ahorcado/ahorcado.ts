import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Scores } from '../../../../../services/supabase/database/scores/scores';
import { Dialogs } from '../../../../../services/messages/dialogs';

@Component({
  selector: 'app-ahorcado',
  standalone: false,
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.scss'
})
export class Ahorcado implements OnInit {

  public word: string = '';
  public attempts: number = 6;
  public maxAttempts: number = 6;
  public failedAttemps: number = 0;
  private victory: boolean = false;
  public activeGame: boolean = true;
  public hyphenatedWord: string[] = [];
  private disabledLetters: string[] = [];
  public restartButtonText: string = 'REINICIAR JUEGO';
  public gameCover: string = '../../../../../assets/images/game-cover/ahorcado.png';
  
  public buttonLetters: string[] = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'Ñ',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  
  private wordList: string[] = [
    'PATRIA',
    'ESPESOR',
    'MANTRA',
    'REPUBLICA',
    'CAPITAN',
    'HALCON',
    'HEROE',
    'MINISTERIO',
    'PLANETA',
    'BIENESTAR',
    'OPTIMISMO',
    'IMPOSITIVO',
    'ESPECIALISTA',
    'MISTICA',
    'GLORIA',
    'BICICLETA',
    'CAPARAZON',
    'RECTANGULO',
    'CRIPTOMONEDA',
    'ELECTRONICA'
  ];
  
  constructor(private cdr: ChangeDetectorRef, private dialogs: Dialogs, private router: Router, private scores: Scores) {}
  
  ngOnInit(): void {
    this.word = this.wordList[Math.round(Math.random() * (this.wordList.length - 1))];
    this.hyphenatedWord = Array(this.word.length).fill('_');
  }

  public restartGame(): void {
    this.attempts = 6;
    this.failedAttemps = 0;
    this.victory = false;
    this.activeGame = true;
    this.disabledLetters = [];
    this.word = this.wordList[Math.round(Math.random() * (this.wordList.length - 1))];
    this.hyphenatedWord = Array(this.word.length).fill('_');
  }

  // Verifica si la letra seleccionada está en el array de letras deshabilitadas
  public isDisabledLetter(letter: string): boolean {
    return this.disabledLetters.includes(letter);
  }

  public sendLetter(letter: string): void {
    let winGame: boolean = false;
    let letterFlag: boolean = false;

    // agrega la letra seleccionada si no esta en el array de letras deshabilitadas
    if (!this.isDisabledLetter(letter)) {
      this.disabledLetters.push(letter);
      this.cdr.detectChanges();
    }

    if (this.activeGame) {
      const alreadyGuessedLetterFlag: boolean = this.hyphenatedWord.some((c) => c === letter);
      
      for (let i = 0; i < this.word.length; i++) {
        const wordLetter = this.word[i];
        
        // agrega la letra seleccionada al array hyphenatedWord si la misma se encuentra en la palabra a adivinar 
        if (wordLetter === letter && !alreadyGuessedLetterFlag) {
          this.hyphenatedWord[i] = letter;
          letterFlag = true;
          winGame = this.hyphenatedWord.some((hyphen) => hyphen == '_');

          // adivina la palabra y se termina la partida
          if (!winGame) {
            this.activeGame = false;
            this.victory = true;

            this.dialogs.showDialogMessage({
              title: 'Games Room',
              content: '¡FELICITACIONES! ¡GANASTE!'
            });

            this.saveResultData();
            break;
          }
        }
      }

      // se resta uno de los 6 intentos si no adivina la letra
      if (!letterFlag && !alreadyGuessedLetterFlag) {
        if (this.attempts > 0) {
          this.attempts--;
          this.failedAttemps = this.maxAttempts - this.attempts;
          
          // si llega al maximo de intentos se termina la partida con derrota
          if (this.attempts === 0) {
            this.activeGame = false;

            this.dialogs.showDialogMessage({
              title: 'Games Room',
              content: '¡PERDISTE!'
            });

            this.failedAttemps = this.maxAttempts - this.attempts;
            this.saveResultData();
          }
        }
      }
    }
  }

  // guardo los datos de la partida
  private async saveResultData(): Promise<void> {
    try {
      await this.scores.setScore({
        gameId: 1,
        victory: this.victory
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

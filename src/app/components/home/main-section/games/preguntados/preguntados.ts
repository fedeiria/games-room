import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ApiPreguntados } from '../../../../../services/preguntados/api-preguntados';
import { Scores } from '../../../../../services/supabase/database/scores/scores';
import { Dialogs } from '../../../../../services/messages/dialogs';
import { Survey } from '../../../../../services/modals/survey/survey';
import { GameId } from '../../../../../enums/game-id';

interface ICountryData {
  name: string;
  flag: string;
}

interface IQuestion {
  options: string[];
  flag: string;
  answer: string;
  isAnswered: boolean;
  selectedOption: string | null;
}

@Component({
  selector: 'app-preguntados',
  standalone: false,
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.scss'
})
export class Preguntados implements OnDestroy, OnInit {

  private gameId: GameId = GameId.TriviaPaises;

  private arrayApi: ICountryData[] = [];
  private questionList: IQuestion[] = [];

  public score: number = 0;
  public attempts: number = 0;
  public maxAttempts: number = 5;

  private currentIndex: number = 0;
  public currentQuestion: IQuestion | null = null;

  public gameOver: boolean = false;
  public restartButtonText: string = 'Reiniciar Juego';
  public gameCover: string = '../../../../../assets/images/game-cover/preguntados.png';

  private apiSubscription: Subscription | undefined;

  constructor(private dialogs: Dialogs, private apiPreguntados: ApiPreguntados, private router: Router, private scores: Scores, private surveyService: Survey) { }

  ngOnInit(): void {
    this.getApiData();
  }

  // carga en un array la data del API
  private getApiData(): void {
    this.apiSubscription = this.apiPreguntados.getApiRequest().subscribe(data => {
      this.arrayApi = data.map((country: any) => {
        return {
          flag: country.flags.png,
          name: country.name.official
        }
      });

      this.initializeValues();
    });
  }

  // inicializa las opciones para las preguntas y los intentos restantes
  private initializeValues(): void {
    this.generateQuestions();
    this.attempts = this.maxAttempts;
    this.currentQuestion = this.questionList[this.currentIndex];
  }

  // genera de forma aleatoria tres opciones para la partida
  private generateQuestions(): void {
    const countriesForQuestions = this.arrayApi.sort(() => Math.random() - 0.5).slice(0, 20);
    
    // filtro para obtener las opciones incorrectas
    this.questionList = countriesForQuestions.map(country => {
      const incorrectCountries = this.arrayApi.filter(c => c.name !== country.name);
      
      const randomIncorrectOptions = incorrectCountries
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
        .map(c => c.name);

      const options = [country.name, ...randomIncorrectOptions].sort(() => Math.random() - 0.5);

      return {
        options: options,
        flag: country.flag,
        answer: country.name,
        isAnswered: false,
        selectedOption: null
      } as IQuestion;
    });
  }

  // inicializa el juego
  public playGame(option: string): void {
    if (!this.currentQuestion || this.currentQuestion.isAnswered) {
      return;
    }

    // marco como respondida la pregunta y guardo la opcion seleccionada
    this.currentQuestion.isAnswered = true;
    this.currentQuestion.selectedOption = option;

    const isCorrectAnswer = option === this.currentQuestion?.answer;
  
    // suma un punto si adivina o resta un intento si erra
    if (isCorrectAnswer) {
      this.score++;
    }
    else {
      this.attempts--;
    }

    setTimeout(() => {
      this.moveToNextQuestion();
    }, 3000);
  }

  // reinicia los valores a su estado inicial
  public resetValues(): void {
    this.score = 0;
    this.currentIndex = 0;
    this.gameOver = false;
    this.initializeValues();
  }

  // corrobora si la partida llego a su final
  private moveToNextQuestion(): void {
    if (this.attempts <= 0) {
      this.endGame();
      return;
    }

    if (this.currentIndex < this.questionList.length - 1) {
      this.currentIndex++;

      this.currentQuestion = {
        ...this.questionList[this.currentIndex]
      };
    }
    else {
      this.endGame();
    }
  }

  // finalizo el juego, llamo al metodo saveResultData y muestro la encuesta
  private endGame(): void {
    this.gameOver = true;
    this.saveResultData();
    this.surveyService.showSurveyModal(this.gameId);
  }

  // guarda el resultado de la partida
  private async saveResultData(): Promise<void> {
    try {
      await this.scores.setScore({
        gameId: 4,
        score: this.score
      });
    }
    catch (error) {
      this.dialogs.showDialogMessage({
        title: 'Games Room',
        content: 'Ocurrio un error al guardar los datos de la partida.'
      });

      console.error('[preguntados.ts] saveResultData error:', error);
    }
  }

  // vuelve al menu de juegos
  public backToHome(): void {
    this.router.navigate(['/home']);
  }

  // seek and destroy!
  ngOnDestroy(): void {
    this.apiSubscription?.unsubscribe();
  }
}

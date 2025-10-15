import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { IsurveyData } from '../../../interfaces/survey/isurvey-data';
import { createSupabaseClientConnection } from '../../../core/supabase/client-connection';

export interface IModalState {
  show: boolean;
  gameId: number;
}

@Injectable({
  providedIn: 'root'
})
export class Survey {

  private readonly supabaseClient = createSupabaseClientConnection();

  // subject para emitir eventos de apertura/cierre
  private modalState = new Subject<IModalState>();

  // Observable para que otros componentes se suscriban y escuchen
  public observableModalState$: Observable<IModalState> = this.modalState.asObservable();

  constructor() { }

  // emite la apertura del modal
  public showSurveyModal(gameId: number): void {
    this.modalState.next({ show: true, gameId });
  }

  // emite el cierre del modal si fue cerrado/cancelado
  public closeSurveyModal(): void {
    this.modalState.next({ show: false, gameId: 0 });
  }

  // guarda los datos de la encuesta
  async saveSurvey(surveyData: IsurveyData): Promise<void> {
    const { error } = await this.supabaseClient
      .from('surveys')
      .insert(surveyData);

      if (error) {
        console.error('[survey service] error al guardar la encuesta: ', error);
        throw new Error(error.message || 'Error desconocido al guardar en Supabase');
      }

      this.modalState.next({ show: false, gameId: 0 });
  }
}

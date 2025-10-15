import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GamesRoutingModule } from './games-routing-module';
import { Ahorcado } from '../../components/home/main-section/games/ahorcado/ahorcado';
import { MayorMenor } from '../../components/home/main-section/games/mayor-menor/mayor-menor';
import { Preguntados } from '../../components/home/main-section/games/preguntados/preguntados';
import { DesactivarBomba } from '../../components/home/main-section/games/desactivar-bomba/desactivar-bomba';
import { Survey } from "../../components/home/main-section/survey/survey";

@NgModule({
  declarations: [Ahorcado, MayorMenor, Preguntados, DesactivarBomba],
  imports: [
    CommonModule,
    FormsModule,
    GamesRoutingModule,
    Survey
]
})
export class GamesModule { }

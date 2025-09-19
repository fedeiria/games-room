import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GamesRoutingModule } from './games-routing-module';
import { Ahorcado } from '../../components/home/main-section/games/ahorcado/ahorcado';
import { MayorMenor } from '../../components/home/main-section/games/mayor-menor/mayor-menor';
import { Preguntados } from '../../components/home/main-section/games/preguntados/preguntados';


@NgModule({
  declarations: [Ahorcado, MayorMenor, Preguntados],
  imports: [
    CommonModule,
    GamesRoutingModule
  ]
})
export class GamesModule { }

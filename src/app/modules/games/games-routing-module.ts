import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Games } from '../../components/home/main-section/games/games';
import { Ahorcado } from '../../components/home/main-section/games/ahorcado/ahorcado';
import { MayorMenor } from '../../components/home/main-section/games/mayor-menor/mayor-menor';
import { Preguntados } from '../../components/home/main-section/games/preguntados/preguntados';
import { DesactivarBomba } from '../../components/home/main-section/games/desactivar-bomba/desactivar-bomba';

const routes: Routes = [
  {
    path: '',
    title: 'Juegos',
    component: Games
  },
  {
    path: 'ahorcado',
    title: 'Ahorcado',
    component: Ahorcado
  },
  {
    path: 'mayor-menor',
    title: 'Mayor o Menor',
    component: MayorMenor
  },
  {
    path: 'preguntados',
    title: 'Preguntados',
    component: Preguntados
  },
  {
    path: 'desactivar-bomba',
    title: 'Desactivar la Bomba',
    component: DesactivarBomba
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule { }

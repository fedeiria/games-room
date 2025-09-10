import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IGameList } from '../../../../interfaces/game-list/igame-list';

@Component({
  selector: 'app-games-section',
  imports: [RouterLink],
  templateUrl: './games-section.html',
  styleUrl: './games-section.scss'
})
export class GamesSection {

  protected readonly games: IGameList[] = [
    {
      name: 'Preguntados',
      description: 'Adivina las banderas de los paises. Mientras mas adivines mas puntos sumas!',
      image: '../../../../assets/images/game-cover/preguntados.png',
      link: '/preguntados'
    },
    {
      name: 'Ahorcado',
      description: 'Adivina la palabra oculta antes de que se completen las partes del cuerpo!',
      image: '../../../../assets/images/game-cover/ahorcado.png',
      link: '/ahorcado'
    },
    {
      name: 'Mayor o Menor',
      description: 'Adivina si la carta siguiente es mayor o menor a la carta mostrada!',
      image: '../../../../assets/images/game-cover/mayor-menor.png',
      link: '/mayor-menor'
    },
    {
      name: 'Desactiva la bomba',
      description: 'Adivina la contrasena antes de que explote la bomba!',
      image: '../../../../assets/images/game-cover/bomba.png',
      link: '/desactivar-bomba'
    }
  ]
}

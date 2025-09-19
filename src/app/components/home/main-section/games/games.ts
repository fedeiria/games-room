import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IGameList } from '../../../../interfaces/game-list/igame-list';

@Component({
  selector: 'app-games',
  imports: [RouterLink],
  templateUrl: './games.html',
  styleUrl: './games.scss'
})
export class Games {

  protected readonly games: IGameList[] = [
    {
      name: 'Ahorcado',
      description: 'Adivina la palabra oculta antes de que tu personaje termine ahorcado!',
      image: '../../../../assets/images/game-cover/ahorcado.png',
      link: '/games/ahorcado'
    },
    {
      name: 'Desactiva la bomba',
      description: 'Adivina la clave secreta antes de que explote la bomba!',
      image: '../../../../assets/images/game-cover/bomba.png',
      link: '/games/desactivar-bomba'
    },
    {
      name: 'Mayor o Menor',
      description: 'Adivina si la carta siguiente es mayor o menor que la carta actual!',
      image: '../../../../assets/images/game-cover/mayor-menor.png',
      link: '/games/mayor-menor'
    },
    {
      name: 'Preguntados',
      description: 'Adivina las banderas de los paises. Mientras mas adivines mas puntos sumas!',
      image: '../../../../assets/images/game-cover/preguntados.png',
      link: '/games/preguntados'
    }
  ]
}

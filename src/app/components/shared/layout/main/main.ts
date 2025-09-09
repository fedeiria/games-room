import { Component } from '@angular/core';

import { IGameList } from '../../../../interfaces/game-list/igame-list';
import { GameList } from './game-list/game-list';

@Component({
  selector: 'app-main',
  imports: [GameList],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {

  gameList: IGameList[] = [
    {
      name: 'Preguntados',
      description: 'Preguntados',
      image: '../../../../assets/images/game-cover/preguntados.png',
      link: '/login'
    },
    {
      name: 'Ahorcado',
      description: 'Ahorcado',
      image: '../../../../assets/images/game-cover/ahorcado.png',
      link: '/login'
    },
    {
      name: 'Mayor o Menor',
      description: 'Mayor o Menor',
      image: '../../../../assets/images/game-cover/mayor-menor.png',
      link: '/login'
    },
    {
      name: 'Desactiva la bomba',
      description: 'Desactiva la bomba',
      image: '../../../../assets/images/game-cover/bomba.png',
      link: '/login'
    }
  ];
}

import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IGameList } from '../../../../../interfaces/game-list/igame-list';

@Component({
  selector: 'app-game-list',
  imports: [RouterLink],
  templateUrl: './game-list.html',
  styleUrl: './game-list.scss'
})
export class GameList {

  @Input() gameList!: IGameList;
}

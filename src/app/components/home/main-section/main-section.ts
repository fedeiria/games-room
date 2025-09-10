import { Component } from '@angular/core';

import { GamesSection } from "./games-section/games-section";

@Component({
  selector: 'app-main-section',
  imports: [GamesSection],
  templateUrl: './main-section.html',
  styleUrl: './main-section.scss'
})
export class MainSection {

}

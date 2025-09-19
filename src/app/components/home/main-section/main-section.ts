import { Component } from '@angular/core';

import { Games } from "./games/games";
import { Chat } from "./chat/chat";

@Component({
  selector: 'app-main-section',
  imports: [Games, Chat],
  templateUrl: './main-section.html',
  styleUrl: './main-section.scss'
})
export class MainSection {

}

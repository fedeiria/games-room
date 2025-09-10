import { Component } from '@angular/core';

import { Navbar } from "../shared/layout/navbar/navbar";
import { Footer } from "../shared/layout/footer/footer";
import { MainSection } from "./main-section/main-section";

@Component({
  selector: 'app-home',
  imports: [Navbar, Footer, MainSection],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}

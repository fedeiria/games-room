import { Component } from '@angular/core';

import { Footer } from "../shared/layout/footer/footer";
import { Navbar } from "../shared/layout/navbar/navbar";
import { Main } from "../shared/layout/main/main";

@Component({
  selector: 'app-welcome',
  imports: [Footer, Navbar, Main],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss'
})
export class Welcome {

}

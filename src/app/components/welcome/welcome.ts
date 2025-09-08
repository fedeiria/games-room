import { Component } from '@angular/core';
import { Navbar } from "../shared/navbar/navbar";
import { Footer } from "../shared/footer/footer";

@Component({
  selector: 'app-welcome',
  imports: [Navbar, Footer],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss'
})
export class Welcome {

}

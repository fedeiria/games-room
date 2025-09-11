import { Component } from '@angular/core';

import { Footer } from "../shared/layout/footer/footer";
import { Navbar } from "../shared/layout/navbar/navbar";
import { Section } from '../shared/layout/section/section';

@Component({
  selector: 'app-welcome',
  imports: [Footer, Navbar, Section],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss'
})
export class Welcome {

}

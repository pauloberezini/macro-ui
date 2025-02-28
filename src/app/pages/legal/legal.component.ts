import { Component } from '@angular/core';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'legal',
  imports: [
    DatePipe
  ],
  templateUrl: './legal.component.html',
  standalone: true,
  styleUrl: './legal.component.css'
})
export class LegalComponent {
  currentDate: Date = new Date();
  email: string = 'paulo.berezini@gmail.com';
  telegram: string = 'https://t.me/bereziniPartners';

  constructor() { }
}

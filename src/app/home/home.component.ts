import { Component } from '@angular/core';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    MatGridListModule,
    MatIconModule,
    MatCardModule
  ],
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
}

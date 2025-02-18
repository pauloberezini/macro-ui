import { Component } from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {SeasonalityPro} from "../yahoo-monthly-data/seasonality-pro.component";

@Component({
  selector: 'seasonality',
  templateUrl: './macro-container.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    MatTabsModule,
    SeasonalityPro
  ],
  styleUrls: ['./macro-container.component.css']
})
export class MacroContainerComponent {

}

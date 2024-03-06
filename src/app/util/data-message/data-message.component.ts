import {Component, Input} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-data-message',
  standalone: true,
  imports: [
    MatIconModule
  ],
  templateUrl: './data-message.component.html',
  styleUrl: './data-message.component.css'
})
export class DataMessageComponent {
  @Input() messageText: string = '';
}

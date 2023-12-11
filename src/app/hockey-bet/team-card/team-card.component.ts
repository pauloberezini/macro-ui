import {Component, Input} from '@angular/core';
import {HockeyTeamStats} from "../../model/hockey-teams-stats";

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.css']
})
export class TeamCardComponent {
  @Input() team: HockeyTeamStats; // Replace 'any' with your team type
}

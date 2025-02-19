import {Component} from '@angular/core';
import {HockeyTeamStats} from "../model/hockey-teams-stats";
import {SelectionModel} from "@angular/cdk/collections";
import {StockDataService} from "../services/stock-data.service";
import {Observable} from "rxjs";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";
import {TeamCardComponent} from "./team-card/team-card.component";
import {FormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'hockey-bet',
  templateUrl: './hockey-bet.component.html',
  standalone: true,
  imports: [
    MatCheckboxModule,
    MatRadioModule,
    TeamCardComponent,
    FormsModule,
    MatTableModule,
    NgForOf
  ],
  styleUrls: ['./hockey-bet.component.css']
})
export class HockeyBetComponent {
  displayedColumns: string[] = ['select', 'teamName', 'gamesPlayed', 'goalsFor', 'goalsAgainst', 'goalsAverageAll', 'lossesAverage', 'goalsAverageAllH', 'lossesAverageH', 'goalsAverageAllG', 'lossesAverageG'];
  dataSource: HockeyTeamStats[];
  isPreviousStandings: boolean = false; // Добавляем флаг для определения таблицы
  selection = new SelectionModel<HockeyTeamStats>(true, []);

  constructor(public service: StockDataService) {}

  ngOnInit(): void {
    this.loadCurrentStandings();
  }

  loadCurrentStandings(): void {
    this.service.getNhlData().subscribe((response: any) => {
      this.dataSource = response;
    });
  }

  loadPreviousStandings(): void {
    this.service.getPreviousNhlData().subscribe((response: any) => {
      this.dataSource = response;
    });
  }

  switchTable(): void {
    if (this.isPreviousStandings) {
      this.loadPreviousStandings();
    } else {
      this.loadCurrentStandings();
    }
  }


  onRowClicked(row: HockeyTeamStats) {
    if (this.selection.isSelected(row) || this.canSelectMore()) {
      this.selection.toggle(row);
    }
  }

  private canSelectMore(): boolean {
    return this.selection.selected.length < 2;
  }

  isAllSelected() {
    if (!this.dataSource) {
      return false;
    }
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }


  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.clear(); // Clear existing selection
      this.dataSource.slice(0, 2).forEach(row => this.selection.select(row));
    }
  }

  checkboxLabel(row?: HockeyTeamStats): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.teamName}`;
  }
}

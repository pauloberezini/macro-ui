import {Component} from '@angular/core';
import {HockeyTeamStats} from "../model/hockey-teams-stats";
import {SelectionModel} from "@angular/cdk/collections";
import {StockDataService} from "../services/stock-data.service";
import {Observable} from "rxjs";
import {finalize} from "rxjs/operators";
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
  dataSource: HockeyTeamStats[] = [];
  isPreviousStandings: boolean = false;
  selection = new SelectionModel<HockeyTeamStats>(true, []);
  readonly selectionLimit = 2;
  isLoading = false;
  loadError = '';

  constructor(public service: StockDataService) {}

  ngOnInit(): void {
    this.loadStandings('current');
  }

  loadCurrentStandings(): void {
    this.loadStandings('current');
  }

  loadPreviousStandings(): void {
    this.loadStandings('previous');
  }

  switchTable(): void {
    this.loadStandings(this.isPreviousStandings ? 'previous' : 'current');
  }


  onRowClicked(row: HockeyTeamStats) {
    if (this.selection.isSelected(row) || this.canSelectMore()) {
      this.selection.toggle(row);
    }
  }

  private canSelectMore(): boolean {
    return this.selection.selected.length < this.selectionLimit;
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

  trackByTeam = (_: number, team: HockeyTeamStats) => team.teamName;

  clearSelection(): void {
    this.selection.clear();
  }

  private loadStandings(type: 'current' | 'previous'): void {
    const source$ = type === 'previous' ? this.service.getPreviousNhlData() : this.service.getNhlData();
    this.isLoading = true;
    this.loadError = '';
    source$
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: HockeyTeamStats[]) => {
          this.dataSource = response || [];
          if (this.selection.selected.length > this.selectionLimit) {
            this.selection.clear();
          }
        },
        error: () => {
          this.dataSource = [];
          this.selection.clear();
          this.loadError = 'Unable to load standings. Please try again.';
        }
      });
  }
}

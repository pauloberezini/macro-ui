import {Component} from '@angular/core';
import {HockeyTeamStats} from "../model/hockey-teams-stats";
import {SelectionModel} from "@angular/cdk/collections";
import {StockDataService} from "../services/stock-data.service";
import {Observable} from "rxjs";

@Component({
  selector: 'hockey-bet',
  templateUrl: './hockey-bet.component.html',
  styleUrls: ['./hockey-bet.component.css']
})
export class HockeyBetComponent {
  displayedColumns: string[] = ['select', 'teamName', 'gamesPlayed', 'goalsFor', 'goalsAgainst', 'goalsAverageAll', 'lossesAverage', 'goalsAverageAllH', 'lossesAverageH', 'goalsAverageAllG', 'lossesAverageG'];
  dataSource: HockeyTeamStats[];

  selection = new SelectionModel<HockeyTeamStats>(true, []);


  constructor(public service: StockDataService) {
  }

  ngOnInit(): void {


    this.service.getNhlData().subscribe((response: any) => {
      this.dataSource = response;
    })
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
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.clear(); // Clear existing selection
      // Select the first two rows
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

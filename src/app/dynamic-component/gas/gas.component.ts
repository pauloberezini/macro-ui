import {Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {StockDataService} from "../../services/stock-data.service";
import {StorageResponseDTO} from "../../model/gas-storage";
import {Observable} from "rxjs";
import {Chart, ChartOptions, ChartType} from 'chart.js';
import {MatToolbarModule} from "@angular/material/toolbar";

@Component({
  selector: 'app-gas',
  standalone: true,
  imports: [
    MatToolbarModule
  ],
  templateUrl: './gas.component.html',
  styleUrls: ['./gas.component.css']  // Ensure the CSS file name is correct
})
export class GasComponent implements AfterViewInit {
  @ViewChild('gasChart') gasChart: ElementRef<HTMLCanvasElement>;

  public chart: Chart;
  public chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,  // Set the maximum value for the y-axis
        ticks: {
          // Optionally, you can adjust the step size as needed
          stepSize: 1
        }
      }
    }
  };
  public chartType: ChartType = 'bar';

  private gasStorageData$: Observable<StorageResponseDTO>;

  constructor(private stockDataService: StockDataService) {
    this.gasStorageData$ = this.stockDataService.getGasStorageData();
  }

  ngAfterViewInit(): void {
    this.gasStorageData$.subscribe(data => {
      this.updateChartData(data);
    });
  }

  private updateChartData(response: StorageResponseDTO): void {
    const labels = response.data.map(item => item.name);
    const storageVolumes = response.data.map(item => item.full);  // Assuming there is a 'gasInStorage' data field
    const backgroundColors = response.data.map(item =>
      this.getColorForPercentage(item.full)
    );

    this.chart = new Chart(this.gasChart.nativeElement, {
      type: this.chartType,
      data: {
        labels: labels,
        datasets: [{
          label: 'Gas Storage Inventory',
          backgroundColor: backgroundColors,
          data: storageVolumes,
          barThickness: 30, // Set thickness of each bar
        }]
      },
      options: this.chartOptions
    });
  }

  resizeCanvas(): void {
    if (this.chart) {
      this.chart.resize();
    }
  }

  private getColorForPercentage(percentage: number): string {
    if (percentage <= 40) return '#cc0000'; // Red for 1-40%
    if (percentage <= 50) return '#f90000'; // Orange for 41-50%
    if (percentage <= 60) return '#ff6600'; // Yellow for 51-60%
    if (percentage <= 70) return '#ffa500'; // Green for 61-70%
    if (percentage <= 80) return '#00ff00'; // Dark Green for 71-80%
    if (percentage <= 90) return '#00b200'; // Turquoise for 81-90%
    return '#004700'; // Green for 91-100%
  }
}

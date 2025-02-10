import { Component, signal, WritableSignal } from '@angular/core';
import { StockAnalysisModel, StockAnalysisService } from '../services/stock-analysis.service';
import { NgIf } from '@angular/common';
import { PlotlyModule } from 'angular-plotly.js';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stock-anomaly',
  standalone: true,
  templateUrl: './stock-anomaly.component.html',
  imports: [PlotlyModule, NgIf, FormsModule]
})
export class StockAnomalyComponent {
  ticker: WritableSignal<string> = signal('OPEN');
  stockData: WritableSignal<StockAnalysisModel | null> = signal(null);
  graphData: any = null;

  constructor(private stockService: StockAnalysisService) {}

  analyzeStock() {
    this.stockService.analyzeStock(this.ticker()).subscribe({
      next: (data: StockAnalysisModel) => {
        console.log('Received stock data:', data);

        try {
          // Validate the structure of graph_data
          if (data.graph_data && Array.isArray(data.graph_data.data) && data.graph_data.data.length > 0) {
            data.graph_data.data.forEach((trace: any) => {
              if (!trace.x || !Array.isArray(trace.x) || trace.x.length === 0) {
                console.error("Invalid X values in Plotly trace:", trace);
                trace.x = [];
              }
              if (!trace.y || !Array.isArray(trace.y) || trace.y.length === 0) {
                console.error("Invalid Y values in Plotly trace:", trace);
                trace.y = [];
              }
            });

            // Ensure layout exists
            if (!data.graph_data.layout) {
              data.graph_data.layout = { title: "Stock Data Plot" };
            }

            // Assign the validated graph data
            this.graphData = {
              data: [...data.graph_data.data],  // Ensure it's an array
              layout: { ...data.graph_data.layout }
            };

            console.log("Processed graph data:", this.graphData);
          } else {
            console.error('Invalid or missing graph_data:', data.graph_data);
            this.graphData = null;
          }

        } catch (error) {
          console.error('Error processing graph data:', error);
          this.graphData = null;
        }
      },
      error: (err: any) => {
        console.error('Error fetching stock data:', err);
        this.graphData = null;
      }
    });
  }


}

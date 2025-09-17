export interface ChartHelpSection {
  title: string;
  content: string;
  icon?: string;
}

export interface ChartHelpContent {
  sections: ChartHelpSection[];
  lastUpdated: Date;
}

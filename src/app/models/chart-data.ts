export interface LineChartData {
  name: string;
  series: { name: string; value: number }[];
}

export interface ChartData {
  name: string;
  value: number;
  extra?: { id: string };
}

export interface BubbleChartData {
  name: string;
  series: Array<{
    name: string;
    x: number;
    y: number;
    r: number;
  }>;
}

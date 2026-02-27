import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChartData {
  name: string;
  value: number;
}

interface LineChartData {
  name: string;
  series: { name: string; value: number }[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NgxChartsModule, CommonModule, FormsModule]
})
export class AppComponent implements OnInit, OnDestroy {
  // Продажи по месяцам
  public liveDataEnabled = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  public allSalesData: LineChartData[] = [
    {
      name: '2025',
      series: [
        { name: 'Янв', value: 15600 },
        { name: 'Фев', value: 18900 },
        { name: 'Мар', value: 21000 },
        { name: 'Апр', value: 17000 },
        { name: 'Май', value: 24000 },
        { name: 'Июн', value: 20000 }
      ]
    }
  ];
  public salesData: LineChartData[] = structuredClone(this.allSalesData);
  public monthRange = 6;
  public months: string[] = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];

  // Доля продуктов
  private originalProductShare: ChartData[] = [
    { name: 'Смартфоны', value: 45 },
    { name: 'Ноутбуки', value: 30 },
    { name: 'Планшеты', value: 25 }
  ];
  public productShare: ChartData[] = structuredClone(this.originalProductShare);
  public selectedProduct: string | 'Все' = 'Все';

  // Продажи по регионам
  private baseRegionData: ChartData[] = [
    { name: 'Москва', value: 52000 },
    { name: 'СПб', value: 38000 },
    { name: 'Казань', value: 21000 }
  ];
  public regionData: ChartData[] = structuredClone(this.baseRegionData);
  public regionFilters: Record<string, boolean> = {
    Москва: true,
    СПб: true,
    Казань: true
  };
  public selectedRegionDetails: ChartData | null = null;

  // ТОП продуктов
  public topProducts: ChartData[] = [
    { name: 'iPhone 15', value: 120000 },
    { name: 'MacBook Pro', value: 95000 },
    { name: 'iPad Air', value: 72000 },
    { name: 'Galaxy S24', value: 88000 }
  ];

  // Активность по дням и времени
  public heatmapData: LineChartData[] = [
    {
      name: 'Понедельник',
      series: [
        { name: 'Утро', value: 120 },
        { name: 'День', value: 300 },
        { name: 'Вечер', value: 180 }
      ]
    },
    {
      name: 'Вторник',
      series: [
        { name: 'Утро', value: 150 },
        { name: 'День', value: 280 },
        { name: 'Вечер', value: 200 }
      ]
    },
    {
      name: 'Среда',
      series: [
        { name: 'Утро', value: 90 },
        { name: 'День', value: 250 },
        { name: 'Вечер', value: 220 }
      ]
    }
  ];

  // Эффективность рекламы
  public bubbleData: any[] = [
    {
      name: 'Google Ads',
      series: [
        { name: 'Янв', x: 120000, y: 2.5, r: 80 },
        { name: 'Фев', x: 150000, y: 3.1, r: 120 }
      ]
    },
    {
      name: 'Facebook',
      series: [
        { name: 'Янв', x: 90000, y: 1.9, r: 60 },
        { name: 'Фев', x: 110000, y: 2.4, r: 75 }
      ]
    }
  ];

  // Динамика по направлениям
  public areaData: LineChartData[] = [
    {
      name: 'Маркетинг',
      series: [
        { name: 'Янв', value: 5000 },
        { name: 'Фев', value: 7200 },
        { name: 'Мар', value: 8500 }
      ]
    },
    {
      name: 'Продажи',
      series: [
        { name: 'Янв', value: 8000 },
        { name: 'Фев', value: 9500 },
        { name: 'Мар', value: 11000 }
      ]
    }
  ];
  public areaMode: 'absolute' | 'percent' = 'absolute';
  public areaChartData: LineChartData[] = this.areaData;

  // Активность по времени (по дням)
  public activityData: LineChartData[] = [
    {
      name: '8:00',
      series: [
        { name: 'Понедельник', value: 10 },
        { name: 'Вторник', value: 20 },
        { name: 'Среда', value: 15 }
      ]
    },
    {
      name: '12:00',
      series: [
        { name: 'Понедельник', value: 50 },
        { name: 'Вторник', value: 40 },
        { name: 'Среда', value: 60 }
      ]
    },
    {
      name: '18:00',
      series: [
        { name: 'Понедельник', value: 80 },
        { name: 'Вторник', value: 70 },
        { name: 'Среда', value: 90 }
      ]
    }
  ];

  // KPI Выполнение
  public gaugeData: ChartData[] = [{ name: 'Выполнение плана', value: 68 }];

  public ngOnInit(): void {
    this.applyFilters();
    this.startLiveData();
  }

  public ngOnDestroy(): void {
    this.stopLiveData();
  }

  public toggleAreaMode(): void {
    this.areaMode = this.areaMode === 'absolute' ? 'percent' : 'absolute';
    this.areaChartData =
      this.areaMode === 'absolute'
        ? this.areaData
        : this.convertToPercent(this.areaData);
  }

  public randomizeGauge(): void {
    this.gaugeData = [
      { name: 'Выполнение плана', value: Math.round(Math.random() * 100) }
    ];
  }

  public toggleLiveData(): void {
    this.liveDataEnabled ? this.stopLiveData() : this.startLiveData();
  }

  public randomizePieData(): void {
    this.originalProductShare = [
      { name: 'Смартфоны', value: Math.round(Math.random() * 50 + 10) },
      { name: 'Ноутбуки', value: Math.round(Math.random() * 50 + 10) },
      { name: 'Планшеты', value: Math.round(Math.random() * 50 + 10) }
    ];
    this.applyFilters();
  }

  public onRegionSelect(event: ChartData): void {
    this.selectedRegionDetails = event;
  }

  public applyFilters(): void {
    this.salesData = this.allSalesData.map(item => ({
      ...item,
      series: item.series.slice(-this.monthRange)
    }));

    this.productShare =
      this.selectedProduct === 'Все'
        ? structuredClone(this.originalProductShare)
        : this.originalProductShare.filter(p => p.name === this.selectedProduct);

    this.regionData = this.baseRegionData.filter(r => this.regionFilters[r.name]);
  }

  public formatMoney(val: number): string {
    return new Intl.NumberFormat('ru-RU').format(val) + ' ₽';
  }

  public formatPercent(val: number): string {
    return val + ' %';
  }

  public formatCurrency(val: number): string {
    return new Intl.NumberFormat('ru-RU').format(val);
  }

  public formatMonth(val: string): string {
    return val;
  }

  private startLiveData(): void {
    this.liveDataEnabled = true;

    this.intervalId = setInterval(() => {
      this.allSalesData = this.allSalesData.map(item => {
        const nextIndex = item.series.length;
        const monthName = this.months[nextIndex % 12];

        return {
          ...item,
          series: [
            ...item.series,
            { name: monthName, value: Math.round(15000 + Math.random() * 8000) }
          ]
        };
      });

      this.applyFilters();
    }, 3000);
  }

  private stopLiveData(): void {
    this.liveDataEnabled = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private convertToPercent(data: LineChartData[]): LineChartData[] {
    const result: LineChartData[] = data.map(c => ({
      name: c.name,
      series: c.series.map(s => ({ ...s }))
    }));

    for (let i = 0; i < result[0].series.length; i++) {
      const total = result.reduce((sum, c) => sum + c.series[i].value, 0);
      result.forEach(c => {
        c.series[i].value = total ? Math.round((c.series[i].value / total) * 100) : 0;
      });
    }

    return result;
  }
}

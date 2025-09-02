import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BubbleChartData, ChartData, LineChartData } from './models/chart-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NgxChartsModule, CommonModule, FormsModule]
})
export class AppComponent implements OnInit, OnDestroy {
  liveDataEnabled = false;
  intervalId: any;

  allSalesData: LineChartData[] = [
    {
      name: '2024',
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
  salesData: LineChartData[] = structuredClone(this.allSalesData);

  originalProductShare: ChartData[] = [
    { name: 'Смартфоны', value: 45 },
    { name: 'Ноутбуки', value: 30 },
    { name: 'Планшеты', value: 25 }
  ];
  productShare: ChartData[] = structuredClone(this.originalProductShare);
  selectedProduct: string | 'Все' = 'Все';

  baseRegionData: ChartData[] = [
    { name: 'Москва', value: 52000 },
    { name: 'СПб', value: 38000 },
    { name: 'Казань', value: 21000 }
  ];
  regionData: ChartData[] = structuredClone(this.baseRegionData);
  regionFilters: Record<string, boolean> = {
    Москва: true,
    СПб: true,
    Казань: true
  };

  bubbleData: BubbleChartData[] = [
    {
      name: 'Facebook',
      series: [
        { x: 10000, y: 0.7, r: 20, name: 'Янв' },
        { x: 15000, y: 0.8, r: 30, name: 'Фев' }
      ]
    }
  ];

  areaData = [
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

  gaugeData = [
    { name: 'Выполнение плана', value: 68 }
  ];

  activityData = [
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

  monthRange = 6;

  ngOnInit() {
    this.applyFilters();
    this.startLiveData();
  }

  ngOnDestroy() {
    this.stopLiveData();
  }

  toggleLiveData() {
    this.liveDataEnabled ? this.stopLiveData() : this.startLiveData();
  }

  startLiveData() {
    this.liveDataEnabled = true;
    this.intervalId = setInterval(() => {
      this.allSalesData = this.allSalesData.map(item => ({
        ...item,
        series: [
          ...item.series,
          {
            name: `М${item.series.length + 1}`,
            value: Math.round(15000 + Math.random() * 8000)
          }
        ]
      }));
      this.applyFilters();
    }, 3000);
  }

  stopLiveData() {
    this.liveDataEnabled = false;
    clearInterval(this.intervalId);
  }

  randomizePieData() {
    this.originalProductShare = [
      { name: 'Смартфоны', value: Math.round(Math.random() * 50 + 10) },
      { name: 'Ноутбуки', value: Math.round(Math.random() * 50 + 10) },
      { name: 'Планшеты', value: Math.round(Math.random() * 50 + 10) }
    ];
    this.applyFilters();
  }

  applyFilters() {
    this.salesData = this.allSalesData.map(item => ({
      ...item,
      series: item.series.slice(-this.monthRange)
    }));

    if (this.selectedProduct === 'Все') {
      this.productShare = structuredClone(this.originalProductShare);
    } else {
      this.productShare = this.originalProductShare.filter(p => p.name === this.selectedProduct);
    }

    this.regionData = this.baseRegionData.filter(r => this.regionFilters[r.name]);
  }
}

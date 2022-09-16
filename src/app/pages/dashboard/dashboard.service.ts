import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChartData } from 'chart.js';
import { environment } from '../../../environments/environment';

/**
 * @class DashboardService
 * This is just a pages service for populating the charts on the dashboard.
 * You will have to implement a similiar service for the data to be populated.
 * Examples are provided below :)
 */

@Injectable()
export class DashboardService {

  url = environment.api;

  constructor(private http: HttpClient) {
  }


  /**
   * Converting Data from Server to Chart compatible format
   * @returns {Chart.ChartData}
   */
  toSalesChartData(chartData: { labels: string[], data: number[] }) {
    return {
      labels: chartData.labels,
      datasets: [
        {
          label: '# of Sales',
          data: chartData.data,
          backgroundColor: '#FFFFFF',
          barPercentage: 0.5
        }
      ]
    } as ChartData;
  }

  toVisitsChartData(chartData: { labels: string[], data: number[] }) {
    return {
      labels: chartData.labels,
      datasets: [
        {
          label: '# of Visits',
          data: chartData.data,
          backgroundColor: '#FFFFFF',
          fill: false,
          borderColor: '#FFFFFF',
          borderWidth: 2,
          lineTension: 0
        }
      ]
    } as ChartData;
  }


  toAudienceOverviewSessionsChartData(chartData: { labels: string[], data: { [set: string]: number[] } }) {
    return {
      labels: chartData.labels,
      datasets: [
        {
          label: 'Sessions',
          data: chartData.data.thisWeek,
          lineTension: 0,
          fill: false,
          backgroundColor: '#4285f4',
          borderColor: '#4285f4',
        },
        {
          label: 'Sessions - Last Week',
          data: chartData.data.lastWeek,
          lineTension: 0,
          fill: false,
          borderColor: 'rgba(66, 133, 244, 0.3)',
          borderDash: [3, 5],
          pointRadius: 0
        }
      ]
    } as ChartData;
  }

  toAudienceOverviewBounceRateChartData(chartData: { labels: string[], data: { [set: string]: number[] } }) {
    return {
      labels: chartData.labels,
      datasets: [
        {
          label: 'Bounce Rate',
          data: chartData.data.thisWeek,
          lineTension: 0,
          fill: false,
          backgroundColor: '#4285f4',
          borderColor: '#4285f4',
        },
        {
          label: 'Bounce Rate - Last Week',
          data: chartData.data.lastWeek,
          lineTension: 0,
          fill: false,
          borderColor: 'rgba(66, 133, 244, 0.3)',
          borderDash: [3, 5],
          pointRadius: 0
        }
      ]
    } as ChartData;
  }


  toAudienceOverviewSessionDurationChartData(chartData: { labels: string[], data: { [set: string]: number[] } }) {
    return {
      labels: chartData.labels,
      datasets: [
        {
          label: 'Session Duration',
          data: chartData.data.thisWeek,
          lineTension: 0,
          fill: false,
          backgroundColor: '#4285f4',
          borderColor: '#4285f4',
        },
        {
          label: 'Session Duration - Last Week',
          data: chartData.data.lastWeek,
          lineTension: 0,
          fill: false,
          borderColor: 'rgba(66, 133, 244, 0.3)',
          borderDash: [3, 5],
          pointRadius: 0
        }
      ]
    } as ChartData;
  }

  toRecentSalesChartData(chartData: { labels: string[], data: number[] }) {
    return {
      labels: chartData.labels,
      datasets: [{
        label: 'Sales',
        backgroundColor: '#DBF6F9',
        borderColor: '#DBF6F9',
        data: chartData.data,
        lineTension: 0
      }]
    };
  }


  toAdvancedPieChartData(chartData: { labels: string[], data: number[] }) {
    return {
      labels: chartData.labels,
      datasets: [{
        label: 'Sales',
        backgroundColor: ['#009688', '#2196F3', '#9C27B0', '#00BCD4', '#F44336', '#FF9800'],
        borderColor: 'transparent',
        data: chartData.data,
      }]
    };
  }
}

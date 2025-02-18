import { HttpClient } from "@angular/common/http";
import type { ElementRef } from "@angular/core";
import { Component, ViewChild } from "@angular/core";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";

import { AgGridAngular } from "ag-grid-angular";
import type { ChartRef, ColDef, GridReadyEvent } from "ag-grid-community";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  IntegratedChartsModule,
  RowGroupingModule,
} from "ag-grid-enterprise";

import "./styles.css";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div id="container">
    <ag-grid-angular
      style="width: 100%; height: 300px;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [cellSelection]="true"
      [enableCharts]="true"
      [popupParent]="popupParent"
      [createChartContainer]="createChartContainer"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
    <div #chartParent class="chart-wrapper">
      @if (chartRef) {
        <div class="chart-wrapper-top">
          <h2 class="chart-wrapper-title">
            Chart created at {{ createdTime }}
          </h2>
          <button (click)="updateChart()">Destroy Chart</button>
        </div>
      } @else {
        <div class="chart-placeholder">Chart will be displayed here.</div>
      }
    </div>
  </div> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "athlete", width: 150, chartDataType: "category" },
    { field: "gold", chartDataType: "series" },
    { field: "silver", chartDataType: "series" },
    { field: "bronze", chartDataType: "series" },
    { field: "total", chartDataType: "series" },
  ];
  defaultColDef: ColDef = { flex: 1 };
  popupParent: HTMLElement | null = document.body;
  rowData!: any[];
  chartRef?: ChartRef;
  createdTime?: string;

  @ViewChild("chartParent") chartParent?: ElementRef;

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent) {
    this.http
      .get<
        any[]
      >("https://www.ag-grid.com/example-assets/wide-spread-of-sports.json")
      .subscribe((data: any[]) => {
        this.rowData = data;
      });
    /** DARK INTEGRATED START **/
        const isInitialModeDark = document.documentElement.dataset.agThemeMode?.includes("dark");
                  
        // update chart themes based on dark mode status
        const updateChartThemes = (isDark: boolean): void => {
            const themes: string[] = ['ag-default', 'ag-material', 'ag-sheets', 'ag-polychroma', 'ag-vivid'];            
            const currentThemes = params.api.getGridOption('chartThemes');    
            const customTheme = currentThemes && currentThemes.some(theme => theme.startsWith('my-custom-theme'));
            
            let modifiedThemes: string[] = customTheme
                ? (isDark ? ['my-custom-theme-dark', 'my-custom-theme-light'] : ['my-custom-theme-light', 'my-custom-theme-dark'])
                : Array.from(new Set(themes.map((theme) => theme + (isDark ? '-dark' : ''))));                      

            // updating the 'chartThemes' grid option will cause the chart to reactively update!
            params.api.setGridOption('chartThemes', modifiedThemes);
        };
        
        // update chart themes when example first loads
        let initialSet = false;
        const maxTries = 5;
        let tries = 0;
        const trySetInitial = (delay) => {
            if(params.api){
                initialSet = true;
                updateChartThemes(isInitialModeDark);
            }else{
                if(tries < maxTries){
                    setTimeout(() => trySetInitial(), 250);
                    tries++;
                }   
            }
        }
        trySetInitial(0);
                      
        interface ColorSchemeChangeEventDetail {
            darkMode: boolean;
        }
        
        // event handler for color scheme changes
        const handleColorSchemeChange = (event: CustomEvent<ColorSchemeChangeEventDetail>): void => {
            const { darkMode } = event.detail;
            updateChartThemes(darkMode);
        }
        
        // listen for user-triggered dark mode changes (not removing listener is fine here!)
        document.addEventListener('color-scheme-change', handleColorSchemeChange as EventListener);                
    /** DARK INTEGRATED END **/
  }

  updateChart(chartRef: ChartRef | undefined) {
    if (this.chartRef !== chartRef) {
      // Destroy previous chart if it exists
      this.chartRef?.destroyChart();
    }
    this.chartRef = chartRef;
    this.createdTime = new Date().toLocaleString();
  }

  // Arrow function used to correctly bind this to the component
  createChartContainer = (chartRef: ChartRef) => {
    this.updateChart(chartRef);
    this.chartParent?.nativeElement.appendChild(chartRef.chartElement);
  };
}

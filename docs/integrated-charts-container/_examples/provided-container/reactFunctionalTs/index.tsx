'use client';
import "ag-grid-enterprise";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import React, {
  StrictMode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";

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
import { AgGridReact } from "ag-grid-react";

import "./styles.css";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "300px", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", width: 150, chartDataType: "category" },
    { field: "gold", chartDataType: "series" },
    { field: "silver", chartDataType: "series" },
    { field: "bronze", chartDataType: "series" },
    { field: "total", chartDataType: "series" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return { flex: 1 };
  }, []);
  const popupParent = useMemo<HTMLElement | null>(() => {
    return document.body;
  }, []);

  const chartPlaceholderRef = useRef<HTMLDivElement | null>(null);
  const [chartRef, setChartRef] = useState<ChartRef | undefined>();

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/wide-spread-of-sports.json")
      .then((resp) => resp.json())
      .then((data: any[]) => {
        setRowData(data);
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
  }, []);

  const updateChartParams = (chartRef: ChartRef | undefined) => {
    setChartRef((prev) => {
      if (prev != chartRef) {
        // destroy the prev chart if it exists
        prev?.destroyChart();
      }
      return chartRef;
    });
  };

  useEffect(() => {
    if (chartRef) {
      // Append the chart element to the placeholder div
      chartPlaceholderRef.current?.appendChild(chartRef.chartElement);
    }
  }, [chartRef]);

  return (
    <div style={containerStyle}>
      <div id="container">
        <div style={gridStyle}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            cellSelection={true}
            enableCharts={true}
            popupParent={popupParent}
            createChartContainer={updateChartParams}
            onGridReady={onGridReady}
          />
          <div ref={chartPlaceholderRef} className="chart-wrapper">
            {chartRef ? (
              <div key={chartRef.chartId}>
                <div className="chart-wrapper-top">
                  <h2 className="chart-wrapper-title">
                    Chart created at {new Date().toLocaleString()}
                  </h2>
                  <button onClick={() => updateChartParams(undefined)}>
                    Destroy Chart
                  </button>
                </div>
              </div>
            ) : (
              <div className="chart-placeholder">
                Chart will be displayed here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);

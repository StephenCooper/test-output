import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";

import type {
  ChartRef,
  ColDef,
  GridApi,
  GridReadyEvent,
} from "ag-grid-community";
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
import { AgGridVue } from "ag-grid-vue3";

import "./styles.css";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
    <div style="height: 100%">
        <div id="container">
            <ag-grid-vue
                style="width: 100%; height: 300px"
                :columnDefs="columnDefs"
                :rowData="rowData"
                :defaultColDef="defaultColDef"
                :cellSelection="true"
                :enableCharts="true"
                :popupParent="popupParent"
                :createChartContainer="createChartContainer"
                @grid-ready="onGridReady"
            ></ag-grid-vue>
            <div id="chartParent" class="chart-wrapper">
                <div class="chart-placeholder">Chart will be displayed here.</div>
            </div>
        </div>
    </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", width: 150, chartDataType: "category" },
      { field: "gold", chartDataType: "series" },
      { field: "silver", chartDataType: "series" },
      { field: "bronze", chartDataType: "series" },
      { field: "total", chartDataType: "series" },
    ]);
    const gridApi = shallowRef<GridApi | null>(null);
    const defaultColDef = ref<ColDef>({ flex: 1 });
    const popupParent = ref(null);
    const rowData = ref<any[]>(null);

    onBeforeMount(() => {
      popupParent.value = document.body;
    });

    const updateChart = (chartRef: ChartRef) => {
      const eParent = document.querySelector("#chartParent");
      eParent.innerHTML = ""; // Clear existing content
      const placeHolder = `<div class="chart-placeholder">Chart will be displayed here.</div>`;
      if (chartRef) {
        const chartWrapperHTML = `
                    <div class="chart-wrapper">
                      <div class="chart-wrapper-top">
                        <h2 class="chart-wrapper-title">Chart created ${new Date().toLocaleString()}</h2>
                        <button class="chart-wrapper-close">Destroy Chart</button>
                      </div>
                      <div class="chart-wrapper-body"></div>
                    </div>
                  `;
        eParent.insertAdjacentHTML("beforeend", chartWrapperHTML);
        const eChartWrapper = eParent.lastElementChild;
        eChartWrapper
          .querySelector(".chart-wrapper-body")
          .appendChild(chartRef.chartElement);
        eChartWrapper
          .querySelector(".chart-wrapper-close")
          .addEventListener("click", () => {
            chartRef.destroyChart();
            eParent.innerHTML = placeHolder;
          });
      } else {
        eParent.innerHTML = placeHolder;
      }
    };

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
      const updateData = (data) => {
        rowData.value = data;
      };

      fetch("https://www.ag-grid.com/example-assets/wide-spread-of-sports.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
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
    };
    // Function for creating the chart container
    const createChartContainer = (chartRef: ChartRef) => {
      updateChart(chartRef);
    };

    return {
      columnDefs,
      gridApi,
      defaultColDef,
      popupParent,
      rowData,
      createChartContainer,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

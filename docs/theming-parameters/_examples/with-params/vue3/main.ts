import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule]);

const myTheme = themeQuartz.withParams({
  spacing: 12,
  accentColor: "red",
});

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :theme="theme"
      :defaultColDef="defaultColDef"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "make" },
      { field: "model" },
      { field: "price" },
    ]);
    const rowData = ref<IOlympicData[] | null>(
      (() => {
        const rowData: any[] = [];
        for (let i = 0; i < 10; i++) {
          rowData.push({
            make: "Toyota",
            model: "Celica",
            price: 35000 + i * 1000,
          });
          rowData.push({
            make: "Ford",
            model: "Mondeo",
            price: 32000 + i * 1000,
          });
          rowData.push({
            make: "Porsche",
            model: "Boxster",
            price: 72000 + i * 1000,
          });
        }
        return rowData;
      })(),
    );
    const theme = ref<Theme | "legacy">(myTheme);
    const defaultColDef = ref<ColDef>({
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    });

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      rowData,
      theme,
      defaultColDef,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

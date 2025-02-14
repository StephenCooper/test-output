import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./styles.css";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColTypeDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

interface SalesRecord {
  productName: string;
  boughtPrice: number;
  soldPrice: number;
}

function currencyFormatter(params: ValueFormatterParams) {
  const value = Math.floor(params.value);
  if (isNaN(value)) {
    return "";
  }
  return "£" + value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div style="height: 100%; box-sizing: border-box">
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnTypes="columnTypes"
        :columnDefs="columnDefs"
        :rowData="rowData"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<SalesRecord> | null>(null);
    const columnTypes = ref<{
      [key: string]: ColTypeDef;
    }>({
      currency: {
        width: 150,
        valueFormatter: currencyFormatter,
      },
      shaded: {
        cellClass: "shaded-class",
      },
    });
    const columnDefs = ref<ColDef[]>([
      { field: "productName" },
      // uses properties from currency type
      { field: "boughtPrice", type: "currency" },
      // uses properties from currency AND shaded types
      { field: "soldPrice", type: ["currency", "shaded"] },
    ]);
    const rowData = ref<SalesRecord[] | null>([
      { productName: "Lamp", boughtPrice: 100, soldPrice: 200 },
      { productName: "Chair", boughtPrice: 150, soldPrice: 300 },
      { productName: "Desk", boughtPrice: 200, soldPrice: 400 },
    ]);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnTypes,
      columnDefs,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

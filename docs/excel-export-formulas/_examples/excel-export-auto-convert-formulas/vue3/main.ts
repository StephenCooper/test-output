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
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ExcelExportParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="container">
      <div>
        <button v-on:click="onBtExport()" style="margin-bottom: 5px; font-weight: bold">Export to Excel</button>
      </div>
      <div class="grid-wrapper">
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :defaultExcelExportParams="defaultExcelExportParams"
          :rowData="rowData"></ag-grid-vue>
        </div>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "firstName" },
      { field: "lastName" },
      {
        headerName: "Full Name",
        valueGetter: (params) => {
          return `${params.data.firstName} ${params.data.lastName}`;
        },
      },
      { field: "age" },
      { field: "company" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
    });
    const defaultExcelExportParams = ref<ExcelExportParams>({
      autoConvertFormulas: true,
      processCellCallback: (params) => {
        const rowIndex = params.accumulatedRowIndex;
        const valueGetter = params.column.getColDef().valueGetter;
        return valueGetter
          ? `=CONCATENATE(A${rowIndex}, " ", B${rowIndex})`
          : params.value;
      },
    });
    const rowData = ref<any[] | null>([
      { firstName: "Mair", lastName: "Inworth", age: 23, company: "Rhyzio" },
      { firstName: "Clair", lastName: "Cockland", age: 38, company: "Vitz" },
      { firstName: "Sonni", lastName: "Jellings", age: 24, company: "Kimia" },
      { firstName: "Kit", lastName: "Clarage", age: 27, company: "Skynoodle" },
      { firstName: "Tod", lastName: "de Mendoza", age: 29, company: "Teklist" },
      { firstName: "Herold", lastName: "Pelman", age: 23, company: "Divavu" },
      { firstName: "Paula", lastName: "Gleave", age: 37, company: "Demimbu" },
      {
        firstName: "Kendrick",
        lastName: "Clayill",
        age: 26,
        company: "Brainlounge",
      },
      {
        firstName: "Korrie",
        lastName: "Blowing",
        age: 32,
        company: "Twitternation",
      },
      { firstName: "Ferrell", lastName: "Towhey", age: 40, company: "Nlounge" },
      { firstName: "Anders", lastName: "Negri", age: 30, company: "Flipstorm" },
      { firstName: "Douglas", lastName: "Dalmon", age: 25, company: "Feedbug" },
      {
        firstName: "Roxanna",
        lastName: "Schukraft",
        age: 26,
        company: "Skinte",
      },
      { firstName: "Seumas", lastName: "Pouck", age: 34, company: "Aimbu" },
      {
        firstName: "Launce",
        lastName: "Welldrake",
        age: 25,
        company: "Twinte",
      },
      { firstName: "Siegfried", lastName: "Grady", age: 34, company: "Vimbo" },
      { firstName: "Vinson", lastName: "Hyams", age: 20, company: "Tanoodle" },
      {
        firstName: "Cayla",
        lastName: "Duckerin",
        age: 21,
        company: "Livepath",
      },
      { firstName: "Luigi", lastName: "Rive", age: 25, company: "Quatz" },
      { firstName: "Carolyn", lastName: "Blouet", age: 29, company: "Eamia" },
    ]);

    function onBtExport() {
      gridApi.value!.exportDataAsExcel();
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      defaultExcelExportParams,
      rowData,
      onGridReady,
      onBtExport,
    };
  },
});

createApp(VueExample).mount("#app");

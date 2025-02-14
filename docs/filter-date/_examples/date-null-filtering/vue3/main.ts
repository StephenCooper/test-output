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
  CellApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DateFilterModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDateFilterParams,
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
  ValueGetterParams,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  CellApiModule,
  TextFilterModule,
  ClientSideRowModelModule,
  DateFilterModule,
  ValidationModule /* Development Only */,
]);

const originalColumnDefs: ColDef[] = [
  { field: "athlete" },
  {
    field: "date",
    cellDataType: "date",
    filter: "agDateColumnFilter",
    filterParams: {
      includeBlanksInEquals: false,
      includeBlanksInNotEqual: false,
      includeBlanksInLessThan: false,
      includeBlanksInGreaterThan: false,
      includeBlanksInRange: false,
    } as IDateFilterParams,
  },
  {
    headerName: "Description",
    valueGetter: (params: ValueGetterParams) => {
      let date = params.data.date;
      if (date != null) {
        date = params.api.getCellValue({
          rowNode: params.node!,
          colKey: "date",
          useFormatter: true,
        });
      }
      return `Date is ${date}`;
    },
    minWidth: 340,
  },
];

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">
        <div class="test-label">Include NULL<br />in date:</div>
        <label><input type="checkbox" id="checkboxEquals" v-on:change="updateParams('Equals')">&nbsp;equals</label>
        <label><input type="checkbox" id="checkboxNotEqual" v-on:change="updateParams('NotEqual')">&nbsp;notEqual</label>
        <label><input type="checkbox" id="checkboxLessThan" v-on:change="updateParams('LessThan')">&nbsp;lessThan</label>
        <label><input type="checkbox" id="checkboxGreaterThan" v-on:change="updateParams('GreaterThan')">&nbsp;greaterThan</label>
        <label><input type="checkbox" id="checkboxRange" v-on:change="updateParams('Range')">&nbsp;inRange</label>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="rowData"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>(originalColumnDefs);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
    });
    const rowData = ref<any[] | null>([
      {
        athlete: "Alberto Gutierrez",
        date: null,
      },
      {
        athlete: "Niall Crosby",
        date: undefined,
      },
      {
        athlete: "Sean Landsman",
        date: new Date(2016, 9, 25),
      },
      {
        athlete: "Robert Clarke",
        date: new Date(2016, 9, 25),
      },
    ]);

    function updateParams(toChange: string) {
      const value: boolean = (
        document.getElementById(`checkbox${toChange}`) as HTMLInputElement
      ).checked;
      originalColumnDefs[1].filterParams[`includeBlanksIn${toChange}`] = value;
      gridApi.value!.setGridOption("columnDefs", originalColumnDefs);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      onGridReady,
      updateParams,
    };
  },
});

createApp(VueExample).mount("#app");

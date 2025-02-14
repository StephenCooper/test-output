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
  GridApi,
  GridOptions,
  GridReadyEvent,
  INumberFilterParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  ValueGetterParams,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextFilterModule,
  ClientSideRowModelModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

const originalColumnDefs: ColDef[] = [
  { field: "athlete" },
  {
    field: "age",
    maxWidth: 120,
    filter: "agNumberColumnFilter",
    filterParams: {
      includeBlanksInEquals: false,
      includeBlanksInNotEqual: false,
      includeBlanksInLessThan: false,
      includeBlanksInGreaterThan: false,
      includeBlanksInRange: false,
    } as INumberFilterParams,
  },
  {
    headerName: "Description",
    valueGetter: (params: ValueGetterParams) => `Age is ${params.data.age}`,
    minWidth: 340,
  },
];

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">
        <div class="test-label">Include NULL<br />in age:</div>
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
        age: 36,
      },
      {
        athlete: "Niall Crosby",
        age: 40,
      },
      {
        athlete: "Sean Landsman",
        age: null,
      },
      {
        athlete: "Robert Clarke",
        age: undefined,
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

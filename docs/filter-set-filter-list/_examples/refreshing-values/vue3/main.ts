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
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ISetFilter,
  ISetFilterParams,
  ModuleRegistry,
  SetFilterValuesFuncParams,
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const list1 = ["Elephant", "Lion", "Monkey"];

const list2 = ["Elephant", "Giraffe", "Tiger"];

const valuesArray = list1.slice();

let valuesCallbackList = list1;

function valuesCallback(params: SetFilterValuesFuncParams) {
  setTimeout(() => {
    params.success(valuesCallbackList);
  }, 1000);
}

const arrayFilterParams: ISetFilterParams = {
  values: valuesArray,
};

const callbackFilterParams: ISetFilterParams = {
  values: valuesCallback,
  refreshValuesOnOpen: true,
};

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div id="container">
      <div id="header">
        <button v-on:click="useList1()">Use <code>['Elephant', 'Lion', 'Monkey']</code></button>
        <button v-on:click="useList2()">Use <code>['Elephant', 'Giraffe', 'Tiger']</code></button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :sideBar="sideBar"
        :rowData="rowData"
        @first-data-rendered="onFirstDataRendered"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        colId: "array",
        headerName: "Values Array",
        field: "animal",
        filter: "agSetColumnFilter",
        filterParams: arrayFilterParams,
      },
      {
        colId: "callback",
        headerName: "Values Callback",
        field: "animal",
        filter: "agSetColumnFilter",
        filterParams: callbackFilterParams,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      filter: true,
    });
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>(
      "filters",
    );
    const rowData = ref<any[] | null>(getData());

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      params.api.getToolPanelInstance("filters")!.expandFilters();
    }
    function useList1() {
      console.log("Updating values to " + list1);
      valuesArray.length = 0;
      list1.forEach((value) => {
        valuesArray.push(value);
      });
      gridApi
        .value!.getColumnFilterInstance<ISetFilter>("array")
        .then((filter) => {
          filter!.refreshFilterValues();
          valuesCallbackList = list1;
        });
    }
    function useList2() {
      console.log("Updating values to " + list2);
      valuesArray.length = 0;
      list2.forEach((value) => {
        valuesArray.push(value);
      });
      gridApi
        .value!.getColumnFilterInstance<ISetFilter>("array")
        .then((filter) => {
          filter!.refreshFilterValues();
          valuesCallbackList = list2;
        })!;
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      sideBar,
      rowData,
      onGridReady,
      onFirstDataRendered,
      useList1,
      useList2,
    };
  },
});

createApp(VueExample).mount("#app");

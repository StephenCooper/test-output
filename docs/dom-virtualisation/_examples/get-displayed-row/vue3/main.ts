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
  ModuleRegistry,
  NumberFilterModule,
  PaginationModule,
  RowApiModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  PaginationModule,
  RowApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button v-on:click="getDisplayedRowAtIndex()">Get Displayed Row 0</button>
        <button v-on:click="getDisplayedRowCount()">Get Displayed Row Count</button>
        <button v-on:click="printAllDisplayedRows()">Print All Displayed Rows</button>
        <button v-on:click="printPageDisplayedRows()">Print Page Displayed Rows</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :pagination="true"
        :paginationAutoPageSize="true"
        :rowData="rowData"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", minWidth: 180 },
      { field: "age" },
      { field: "country", minWidth: 150 },
      { headerName: "Group", valueGetter: "data.country.charAt(0)" },
      { field: "year" },
      { field: "date", minWidth: 150 },
      { field: "sport", minWidth: 180 },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
      filter: true,
    });
    const rowData = ref<IOlympicData[]>(null);

    function getDisplayedRowAtIndex() {
      const rowNode = gridApi.value!.getDisplayedRowAtIndex(0)!;
      console.log(
        "getDisplayedRowAtIndex(0) => " +
          rowNode.data!.athlete +
          " " +
          rowNode.data!.year,
      );
    }
    function getDisplayedRowCount() {
      const count = gridApi.value!.getDisplayedRowCount();
      console.log("getDisplayedRowCount() => " + count);
    }
    function printAllDisplayedRows() {
      const count = gridApi.value!.getDisplayedRowCount();
      console.log("## printAllDisplayedRows");
      for (let i = 0; i < count; i++) {
        const rowNode = gridApi.value!.getDisplayedRowAtIndex(i)!;
        console.log("row " + i + " is " + rowNode.data!.athlete);
      }
    }
    function printPageDisplayedRows() {
      const rowCount = gridApi.value!.getDisplayedRowCount();
      const lastGridIndex = rowCount - 1;
      const currentPage = gridApi.value!.paginationGetCurrentPage();
      const pageSize = gridApi.value!.paginationGetPageSize();
      const startPageIndex = currentPage * pageSize;
      let endPageIndex = (currentPage + 1) * pageSize - 1;
      if (endPageIndex > lastGridIndex) {
        endPageIndex = lastGridIndex;
      }
      console.log("## printPageDisplayedRows");
      for (let i = startPageIndex; i <= endPageIndex; i++) {
        const rowNode = gridApi.value!.getDisplayedRowAtIndex(i)!;
        console.log("row " + i + " is " + rowNode.data!.athlete);
      }
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        rowData.value = data.slice(0, 100);
      };

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      onGridReady,
      getDisplayedRowAtIndex,
      getDisplayedRowCount,
      printAllDisplayedRows,
      printPageDisplayedRows,
    };
  },
});

createApp(VueExample).mount("#app");

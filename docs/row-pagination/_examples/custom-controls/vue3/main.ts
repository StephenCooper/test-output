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
  RowSelectionModule,
  RowSelectionOptions,
  TextFilterModule,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  RowSelectionModule,
  PaginationModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

function setText(selector: string, text: any) {
  (document.querySelector(selector) as any).innerHTML = text;
}

function setLastButtonDisabled(disabled: boolean) {
  (document.querySelector("#btLast") as any).disabled = disabled;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header">
        <div>
          <button v-on:click="onBtFirst()">To First</button>
          <button v-on:click="onBtLast()" id="btLast">To Last</button>
          <button v-on:click="onBtPrevious()">To Previous</button>
          <button v-on:click="onBtNext()">To Next</button>
          <button v-on:click="onBtPageFive()">To Page 5</button>
          <button v-on:click="onBtPageFifty()">To Page 50</button>
        </div>
        <div style="margin-top: 6px">
          <span class="label">Last Page Found:</span>
          <span class="value" id="lbLastPageFound">-</span>
          <span class="label">Page Size:</span>
          <span class="value" id="lbPageSize">-</span>
          <span class="label">Total Pages:</span>
          <span class="value" id="lbTotalPages">-</span>
          <span class="label">Current Page:</span>
          <span class="value" id="lbCurrentPage">-</span>
        </div>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowSelection="rowSelection"
        :paginationPageSize="paginationPageSize"
        :paginationPageSizeSelector="paginationPageSizeSelector"
        :pagination="true"
        :suppressPaginationPanel="true"
        :suppressScrollOnNewData="true"
        :rowData="rowData"
        @pagination-changed="onPaginationChanged"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      // this row just shows the row index, doesn't use any data from the row
      {
        headerName: "#",
        width: 70,
        valueFormatter: (params: ValueFormatterParams) => {
          return `${parseInt(params.node!.id!) + 1}`;
        },
      },
      { headerName: "Athlete", field: "athlete", width: 150 },
      { headerName: "Age", field: "age", width: 90 },
      { headerName: "Country", field: "country", width: 120 },
      { headerName: "Year", field: "year", width: 90 },
      { headerName: "Date", field: "date", width: 110 },
      { headerName: "Sport", field: "sport", width: 110 },
      { headerName: "Gold", field: "gold", width: 100 },
      { headerName: "Silver", field: "silver", width: 100 },
      { headerName: "Bronze", field: "bronze", width: 100 },
      { headerName: "Total", field: "total", width: 100 },
    ]);
    const defaultColDef = ref<ColDef>({
      filter: true,
    });
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
      checkboxes: true,
      headerCheckbox: true,
    });
    const paginationPageSize = ref(500);
    const paginationPageSizeSelector = ref<number[] | boolean>([
      100, 500, 1000,
    ]);
    const rowData = ref<IOlympicData[]>(null);

    function onPaginationChanged() {
      console.log("onPaginationPageLoaded");
      // Workaround for bug in events order
      if (gridApi.value!) {
        setText("#lbLastPageFound", gridApi.value!.paginationIsLastPageFound());
        setText("#lbPageSize", gridApi.value!.paginationGetPageSize());
        // we +1 to current page, as pages are zero based
        setText(
          "#lbCurrentPage",
          gridApi.value!.paginationGetCurrentPage() + 1,
        );
        setText("#lbTotalPages", gridApi.value!.paginationGetTotalPages());
        setLastButtonDisabled(!gridApi.value!.paginationIsLastPageFound());
      }
    }
    function onBtFirst() {
      gridApi.value!.paginationGoToFirstPage();
    }
    function onBtLast() {
      gridApi.value!.paginationGoToLastPage();
    }
    function onBtNext() {
      gridApi.value!.paginationGoToNextPage();
    }
    function onBtPrevious() {
      gridApi.value!.paginationGoToPreviousPage();
    }
    function onBtPageFive() {
      // we say page 4, as the first page is zero
      gridApi.value!.paginationGoToPage(4);
    }
    function onBtPageFifty() {
      // we say page 49, as the first page is zero
      gridApi.value!.paginationGoToPage(49);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowSelection,
      paginationPageSize,
      paginationPageSizeSelector,
      rowData,
      onGridReady,
      onPaginationChanged,
      onBtFirst,
      onBtLast,
      onBtNext,
      onBtPrevious,
      onBtPageFive,
      onBtPageFifty,
    };
  },
});

createApp(VueExample).mount("#app");

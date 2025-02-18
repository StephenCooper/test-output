import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColSpanParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const colSpan = function (params: ColSpanParams) {
  return params.data === 2 ? 3 : 1;
};

function fillAllCellsWithWidthMeasurement() {
  Array.prototype.slice
    .call(document.querySelectorAll(".ag-cell"))
    .forEach((cell) => {
      const width = cell.offsetWidth;
      const isFullWidthRow = cell.parentElement.childNodes.length === 1;
      cell.textContent = (isFullWidthRow ? "Total width: " : "") + width + "px";
    });
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<(ColDef | ColGroupDef)[]>([
      {
        headerName: "A",
        field: "author",
        width: 300,
        colSpan: colSpan,
      },
      {
        headerName: "Flexed Columns",
        children: [
          {
            headerName: "B",
            minWidth: 200,
            maxWidth: 350,
            flex: 2,
          },
          {
            headerName: "C",
            flex: 1,
          },
        ],
      },
    ]);
    const rowData = ref<any[] | null>([1, 2]);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      setInterval(fillAllCellsWithWidthMeasurement, 50);
    };

    return {
      gridApi,
      columnDefs,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

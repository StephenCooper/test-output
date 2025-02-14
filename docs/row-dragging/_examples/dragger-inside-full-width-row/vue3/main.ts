import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  IsFullWidthRowParams,
  ModuleRegistry,
  RowDragModule,
  RowHeightParams,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import FullWidthCellRenderer from "./fullWidthCellRendererVue";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextFilterModule,
  RowDragModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

function countryCellRenderer(params: ICellRendererParams) {
  if (!params.fullWidth) {
    return params.value;
  }
  const flag =
    '<img border="0" width="15" height="10" src="https://www.ag-grid.com/example-assets/flags/' +
    params.data.code +
    '.png">';
  return (
    '<span style="cursor: default;">' + flag + " " + params.value + "</span>"
  );
}

function isFullWidth(data: any) {
  // return true when country is Peru, France or Italy
  return ["Peru", "France", "Italy"].indexOf(data.name) >= 0;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rowData"
      :rowDragManaged="true"
      :getRowHeight="getRowHeight"
      :isFullWidthRow="isFullWidthRow"
      :fullWidthCellRenderer="fullWidthCellRenderer"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    FullWidthCellRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "name", cellRenderer: countryCellRenderer },
      { field: "continent" },
      { field: "language" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      filter: true,
    });
    const rowData = ref<any[] | null>(getData());
    const getRowHeight = ref<
      (params: RowHeightParams) => number | undefined | null
    >((params: RowHeightParams) => {
      // return 100px height for full width rows
      if (isFullWidth(params.data)) {
        return 100;
      }
    });
    const isFullWidthRow = ref<(params: IsFullWidthRowParams) => boolean>(
      (params: IsFullWidthRowParams) => {
        return isFullWidth(params.rowNode.data);
      },
    );
    const fullWidthCellRenderer = ref<any>("FullWidthCellRenderer");

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      getRowHeight,
      isFullWidthRow,
      fullWidthCellRenderer,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

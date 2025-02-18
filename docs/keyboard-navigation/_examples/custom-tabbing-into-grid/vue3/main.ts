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
  CellFocusedParams,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  Column,
  ColumnGroup,
  FocusGridInnerElementParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HeaderFocusedParams,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let lastFocused:
  | {
      column: string | Column | ColumnGroup | null;
      rowIndex?: number | null;
    }
  | undefined;

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div>
        <div class="form-container">
          <label>
            Input Above
            <input>
            </label>
          </div>
        </div>
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :focusGridInnerElement="focusGridInnerElement"
          :defaultColDef="defaultColDef"
          :rowData="rowData"
          @cell-focused="onCellFocused"
          @header-focused="onHeaderFocused"></ag-grid-vue>
          <div class="form-container">
            <label>
              Input Below
              <input>
              </label>
            </div>
          </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { headerName: "#", colId: "rowNum", valueGetter: "node.id" },
      { field: "athlete", minWidth: 170 },
      { field: "age" },
      { field: "country" },
      { field: "year" },
      { field: "date" },
      { field: "sport" },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ]);
    const focusGridInnerElement = ref<
      (params: FocusGridInnerElementParams) => boolean
    >((params: FocusGridInnerElementParams) => {
      if (!lastFocused || !lastFocused.column) {
        return false;
      }
      if (lastFocused.rowIndex != null) {
        params.api.setFocusedCell(
          lastFocused.rowIndex,
          lastFocused.column as Column | string,
        );
      } else {
        params.api.setFocusedHeader(lastFocused.column);
      }
      return true;
    });
    const defaultColDef = ref<ColDef>({
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    });
    const rowData = ref<IOlympicData[]>(null);

    function onCellFocused(params: CellFocusedParams) {
      lastFocused = { column: params.column, rowIndex: params.rowIndex };
    }
    function onHeaderFocused(params: HeaderFocusedParams) {
      lastFocused = { column: params.column, rowIndex: null };
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
      focusGridInnerElement,
      defaultColDef,
      rowData,
      onGridReady,
      onCellFocused,
      onHeaderFocused,
    };
  },
});

createApp(VueExample).mount("#app");

import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  CellEditRequestEvent,
  CellSelectionOptions,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { CellSelectionModule } from "ag-grid-enterprise";
import { IOlympicDataWithId } from "./interfaces";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);

let rowImmutableStore: any[];

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :cellSelection="cellSelection"
      :readOnlyEdit="true"
      :getRowId="getRowId"
      :rowData="rowData"
      @cell-edit-request="onCellEditRequest"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicDataWithId> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", minWidth: 160 },
      { field: "age" },
      { field: "country", minWidth: 140 },
      { field: "year" },
      { field: "date", minWidth: 140 },
      { field: "sport", minWidth: 160 },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
      editable: true,
      cellDataType: false,
    });
    const cellSelection = ref<boolean | CellSelectionOptions>({
      handle: {
        mode: "fill",
      },
    });
    const getRowId = ref<GetRowIdFunc>((params) => String(params.data.id));
    const rowData = ref<IOlympicDataWithId[]>(null);

    function onCellEditRequest(event: CellEditRequestEvent) {
      const data = event.data;
      const field = event.colDef.field;
      const newValue = event.newValue;
      const oldItem = rowImmutableStore.find((row) => row.id === data.id);
      if (!oldItem || !field) {
        return;
      }
      const newItem = { ...oldItem };
      newItem[field] = newValue;
      console.log("onCellEditRequest, updating " + field + " to " + newValue);
      rowImmutableStore = rowImmutableStore.map((oldItem) =>
        oldItem.id == newItem.id ? newItem : oldItem,
      );
      gridApi.value.setGridOption("rowData", rowImmutableStore);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        data.forEach((item, index) => (item.id = index));
        rowImmutableStore = data;
        params.api.setGridOption("rowData", rowImmutableStore);
      };

      fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      cellSelection,
      getRowId,
      rowData,
      onGridReady,
      onCellEditRequest,
    };
  },
});

createApp(VueExample).mount("#app");

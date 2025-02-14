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
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicDataWithId } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :getRowId="getRowId"
      :readOnlyEdit="true"
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
    });
    const getRowId = ref<GetRowIdFunc>(
      (params: GetRowIdParams) => params.data.id,
    );
    const rowData = ref<IOlympicDataWithId[]>(null);

    function onCellEditRequest(event: CellEditRequestEvent) {
      const oldData = event.data;
      const field = event.colDef.field;
      const newValue = event.newValue;
      const newData = { ...oldData };
      newData[field!] = event.newValue;
      console.log("onCellEditRequest, updating " + field + " to " + newValue);
      const tx = {
        update: [newData],
      };
      event.api.applyTransaction(tx);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        data.forEach((item, index) => (item.id = String(index)));
        rowData.value = data;
      };

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      getRowId,
      rowData,
      onGridReady,
      onCellEditRequest,
    };
  },
});

createApp(VueExample).mount("#app");

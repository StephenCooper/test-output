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
  CsvExportModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { ColumnMenuModule, ContextMenuModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CsvExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule /* Development Only */,
]);

function getBoolean(id: string) {
  const field = document.querySelector("#" + id) as HTMLInputElement;
  return !!field.checked;
}

function getParams() {
  return {
    skipColumnGroupHeaders: getBoolean("columnGroups"),
    skipColumnHeaders: getBoolean("skipHeader"),
  };
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div style="display: flex; flex-direction: column; height: 100%">
      <div style="display: flex">
        <div class="row">
          <label for="columnGroups"><input id="columnGroups" type="checkbox">Skip Column Group Headers</label>
          <label for="skipHeader"><input id="skipHeader" type="checkbox">Skip Column Headers</label>
        </div>
      </div>
      <div style="margin: 10px 0">
        <button v-on:click="onBtnUpdate()">Show CSV export content text</button>
        <button v-on:click="onBtnExport()">Download CSV export file</button>
      </div>
      <div style="flex: 1 1 0; position: relative; display: flex; flex-direction: row; gap: 20px">
        <div id="gridContainer" style="flex: 1">
          <ag-grid-vue
            style="width: 100%; height: 100%;"
            @grid-ready="onGridReady"
            :defaultColDef="defaultColDef"
            :suppressExcelExport="true"
            :popupParent="popupParent"
            :columnDefs="columnDefs"
            :rowData="rowData"></ag-grid-vue>
          </div>
          <textarea id="csvResult" style="flex: 1" placeholder="Click the Show CSV export content button to view exported CSV here"></textarea>
        </div>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const defaultColDef = ref<ColDef>({
      editable: true,
      minWidth: 100,
      flex: 1,
    });
    const popupParent = ref<HTMLElement | null>(document.body);
    const columnDefs = ref<(ColDef | ColGroupDef)[]>([
      {
        headerName: "Brand",
        children: [{ field: "make" }, { field: "model" }],
      },
      {
        headerName: "Value",
        children: [{ field: "price" }],
      },
    ]);
    const rowData = ref<any[] | null>([
      { make: "Toyota", model: "Celica", price: 35000 },
      { make: "Ford", model: "Mondeo", price: 32000 },
      { make: "Porsche", model: "Boxster", price: 72000 },
    ]);

    function onBtnExport() {
      gridApi.value!.exportDataAsCsv(getParams());
    }
    function onBtnUpdate() {
      (document.querySelector("#csvResult") as any).value =
        gridApi.value!.getDataAsCsv(getParams());
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      (document.getElementById("columnGroups") as HTMLInputElement).checked =
        true;
    };

    return {
      gridApi,
      defaultColDef,
      popupParent,
      columnDefs,
      rowData,
      onGridReady,
      onBtnExport,
      onBtnUpdate,
    };
  },
});

createApp(VueExample).mount("#app");

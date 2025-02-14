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
  CsvExportModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  PinnedRowModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  PinnedRowModule,
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

function getBoolean(id: string) {
  return !!(document.querySelector("#" + id) as HTMLInputElement).checked;
}

function getParams() {
  return {
    skipPinnedTop: getBoolean("skipPinnedTop"),
    skipPinnedBottom: getBoolean("skipPinnedBottom"),
  };
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="container">
      <div class="columns">
        <div class="column">
          <label for="skipPinnedTop"><input id="skipPinnedTop" type="checkbox">Skip Pinned Top Rows</label>
        </div>
        <div class="column">
          <label for="skipPinnedBottom"><input id="skipPinnedBottom" type="checkbox">Skip Pinned Bottom Rows</label>
        </div>
        <div>
          <button v-on:click="onBtExport()" style="margin: 5px 0px; font-weight: bold">Export to Excel</button>
        </div>
      </div>
      <div class="grid-wrapper">
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :popupParent="popupParent"
          :pinnedTopRowData="pinnedTopRowData"
          :pinnedBottomRowData="pinnedBottomRowData"
          :rowData="rowData"></ag-grid-vue>
        </div>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<(ColDef | ColGroupDef)[]>([
      {
        headerName: "Top Level Column Group",
        children: [
          {
            headerName: "Group A",
            children: [
              { field: "athlete", minWidth: 200 },
              { field: "country", minWidth: 200 },
              { headerName: "Group", valueGetter: "data.country.charAt(0)" },
            ],
          },
          {
            headerName: "Group B",
            children: [
              { field: "date", minWidth: 150 },
              { field: "sport", minWidth: 150 },
              { field: "gold" },
              { field: "silver" },
              { field: "bronze" },
              { field: "total" },
            ],
          },
        ],
      },
    ]);
    const defaultColDef = ref<ColDef>({
      filter: true,
      minWidth: 100,
      flex: 1,
    });
    const popupParent = ref<HTMLElement | null>(document.body);
    const pinnedTopRowData = ref<any[]>([
      {
        athlete: "Floating <Top> Athlete",
        country: "Floating <Top> Country",
        date: "01/08/2020",
        sport: "Track & Field",
        gold: 22,
        silver: 3,
        bronze: 44,
        total: 69,
      } as any,
    ]);
    const pinnedBottomRowData = ref<any[]>([
      {
        athlete: "Floating <Bottom> Athlete",
        country: "Floating <Bottom> Country",
        date: "01/08/2030",
        sport: "Track & Field",
        gold: 222,
        silver: 5,
        bronze: 244,
        total: 471,
      } as any,
    ]);
    const rowData = ref<IOlympicData[]>(null);

    function onBtExport() {
      gridApi.value!.exportDataAsExcel(getParams());
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) =>
        (rowData.value = data.filter((rec: any) => rec.country != null));

      fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      popupParent,
      pinnedTopRowData,
      pinnedBottomRowData,
      rowData,
      onGridReady,
      onBtExport,
    };
  },
});

createApp(VueExample).mount("#app");

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
  ExcelStyle,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="container">
      <div class="columns">
        <div>
          <button v-on:click="onBtExport()" style="font-weight: bold; margin-bottom: 5px">Export to Excel</button>
        </div>
      </div>
      <div class="grid-wrapper">
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :defaultColDef="defaultColDef"
          :columnDefs="columnDefs"
          :excelStyles="excelStyles"
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
    const defaultColDef = ref<ColDef>({
      filter: true,
      minWidth: 100,
      flex: 1,
    });
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", minWidth: 200 },
      { field: "country", minWidth: 200 },
      { field: "sport", minWidth: 150 },
      { field: "gold", hide: true },
      { field: "silver", hide: true },
      { field: "bronze", hide: true },
      { field: "total", hide: true },
    ]);
    const excelStyles = ref<ExcelStyle[]>([
      {
        id: "coverHeading",
        font: {
          size: 26,
          bold: true,
        },
      },
      {
        id: "coverText",
        font: {
          size: 14,
        },
      },
    ]);
    const rowData = ref<IOlympicData[]>(null);

    function onBtExport() {
      const performExport = async () => {
        const spreadsheets = [];
        //set a filter condition ensuring no records are returned so only the header content is exported
        await gridApi.value!.setColumnFilterModel("athlete", {
          values: [],
        });
        gridApi.value!.onFilterChanged();
        //export custom content for cover page
        spreadsheets.push(
          gridApi.value!.getSheetDataForExcel({
            prependContent: [
              {
                cells: [
                  {
                    styleId: "coverHeading",
                    mergeAcross: 3,
                    data: { value: "AG Grid", type: "String" },
                  },
                ],
              },
              {
                cells: [
                  {
                    styleId: "coverHeading",
                    mergeAcross: 3,
                    data: { value: "", type: "String" },
                  },
                ],
              },
              {
                cells: [
                  {
                    styleId: "coverText",
                    mergeAcross: 3,
                    data: {
                      value:
                        "Data shown lists Olympic medal winners for years 2000-2012",
                      type: "String",
                    },
                  },
                ],
              },
              {
                cells: [
                  {
                    styleId: "coverText",
                    data: {
                      value:
                        "This data includes a row for each participation record - athlete name, country, year, sport, count of gold, silver, bronze medals won during the sports event",
                      type: "String",
                    },
                  },
                ],
              },
            ],
            processHeaderCallback: () => "",
            sheetName: "cover",
          })!,
        );
        //remove filter condition set above so all the grid data can be exported on a separate sheet
        await gridApi.value.setColumnFilterModel("athlete", null);
        gridApi.value!.onFilterChanged();
        spreadsheets.push(gridApi.value!.getSheetDataForExcel()!);
        gridApi.value!.exportMultipleSheetsAsExcel({
          data: spreadsheets,
          fileName: "ag-grid.xlsx",
        });
      };
      performExport();
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
      defaultColDef,
      columnDefs,
      excelStyles,
      rowData,
      onGridReady,
      onBtExport,
    };
  },
});

createApp(VueExample).mount("#app");

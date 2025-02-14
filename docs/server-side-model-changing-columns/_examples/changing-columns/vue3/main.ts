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
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  ModuleRegistry,
  NumberFilterModule,
  RowModelType,
  SetFilterValuesFuncParams,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const colDefCountry: ColDef = { field: "country", rowGroup: true };

const colDefYear: ColDef = { field: "year", rowGroup: true };

const colDefAthlete: ColDef = {
  field: "athlete",
  filter: "agSetColumnFilter",
  filterParams: {
    values: getAthletesAsync,
  },
  suppressHeaderMenuButton: true,
  suppressHeaderContextMenu: true,
};

const colDefAge: ColDef = { field: "age" };

const colDefSport: ColDef = { field: "sport" };

const colDefGold: ColDef = { field: "gold", aggFunc: "sum" };

const colDefSilver: ColDef = { field: "silver", aggFunc: "sum" };

const colDefBronze: ColDef = { field: "bronze", aggFunc: "sum" };

function getAthletesAsync(params: SetFilterValuesFuncParams) {
  const countries = fakeServer.getAthletes();
  // simulating real server call with a 500ms delay
  setTimeout(() => {
    params.success(countries);
  }, 500);
}

function getBooleanValue(cssSelector: string) {
  return (
    (document.querySelector(cssSelector) as HTMLInputElement).checked === true
  );
}

function getServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params: IServerSideGetRowsParams) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      const response = server.getData(params.request);
      // adding delay to simulate real server call
      setTimeout(() => {
        if (response.success) {
          // call the success callback
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          // inform the grid request failed
          params.fail();
        }
      }, 200);
    },
  };
}

var fakeServer: any = undefined;

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">Select columns to show then hit 'Apply'</div>
      <div class="test-header">
        <label><input type="checkbox" id="athlete">Athlete</label>
        <label><input type="checkbox" id="age">Age</label>
        <label><input type="checkbox" id="country">Country</label>
        <label><input type="checkbox" id="year">Year</label>
        <label><input type="checkbox" id="sport">Sport</label>
        <label><input type="checkbox" id="gold">Gold</label>
        <label><input type="checkbox" id="silver">Silver</label>
        <label><input type="checkbox" id="bronze">Bronze</label>
        <button v-on:click="onBtApply()">Apply</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        class="test-grid"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :maintainColumnOrder="true"
        :rowModelType="rowModelType"
        :suppressAggFuncInHeader="true"
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
      colDefAthlete,
      colDefAge,
      colDefCountry,
      colDefYear,
      colDefSport,
      colDefGold,
      colDefSilver,
      colDefBronze,
    ]);
    const defaultColDef = ref<ColDef>({
      initialFlex: 1,
      minWidth: 120,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 200,
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const rowData = ref<IOlympicData[]>(null);

    function onBtApply() {
      const cols = [];
      if (getBooleanValue("#athlete")) {
        cols.push(colDefAthlete);
      }
      if (getBooleanValue("#age")) {
        cols.push(colDefAge);
      }
      if (getBooleanValue("#country")) {
        cols.push(colDefCountry);
      }
      if (getBooleanValue("#year")) {
        cols.push(colDefYear);
      }
      if (getBooleanValue("#sport")) {
        cols.push(colDefSport);
      }
      if (getBooleanValue("#gold")) {
        cols.push(colDefGold);
      }
      if (getBooleanValue("#silver")) {
        cols.push(colDefSilver);
      }
      if (getBooleanValue("#bronze")) {
        cols.push(colDefBronze);
      }
      gridApi.value!.setGridOption("columnDefs", cols);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      (document.getElementById("athlete") as HTMLInputElement).checked = true;
      (document.getElementById("age") as HTMLInputElement).checked = true;
      (document.getElementById("country") as HTMLInputElement).checked = true;
      (document.getElementById("year") as HTMLInputElement).checked = true;
      (document.getElementById("sport") as HTMLInputElement).checked = true;
      (document.getElementById("gold") as HTMLInputElement).checked = true;
      (document.getElementById("silver") as HTMLInputElement).checked = true;
      (document.getElementById("bronze") as HTMLInputElement).checked = true;

      const updateData = (data) => {
        // setup the fake server with entire dataset
        fakeServer = new FakeServer(data);
        // create datasource with a reference to the fake server
        const datasource: IServerSideDatasource =
          getServerSideDatasource(fakeServer);
        // register the datasource with the grid
        params.api!.setGridOption("serverSideDatasource", datasource);
      };

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      rowModelType,
      rowData,
      onGridReady,
      onBtApply,
    };
  },
});

createApp(VueExample).mount("#app");

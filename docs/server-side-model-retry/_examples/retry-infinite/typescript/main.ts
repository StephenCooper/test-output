import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  IServerSideDatasource,
  ModuleRegistry,
  RowModelType,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  RowGroupingModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;
const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    {
      // demonstrating the use of valueGetters
      colId: "country",
      valueGetter: "data.country",
      rowGroup: true,
      hide: true,
    },
    { field: "sport", rowGroup: true, hide: true },
    { field: "year", minWidth: 100 },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 120,
  },
  autoGroupColumnDef: {
    flex: 1,
    minWidth: 280,
    field: "athlete",
  },

  // use the server-side row model
  rowModelType: "serverSide",
  maxConcurrentDatasourceRequests: 1,

  suppressAggFuncInHeader: true,
  purgeClosedRowNodes: true,

  cacheBlockSize: 20,
};

function getServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params) => {
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
      }, 1000);
    },
  };
}

function onBtRetry() {
  gridApi!.retryServerSideLoads();
}

function onBtReset() {
  gridApi!.refreshServerSide({ purge: true });
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then(function (data) {
    // setup the fake server with entire dataset
    const fakeServer = new FakeServer(data);

    // create datasource with a reference to the fake server
    const datasource = getServerSideDatasource(fakeServer);

    // register the datasource with the grid
    gridApi!.setGridOption("serverSideDatasource", datasource);
  });

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onBtRetry = onBtRetry;
  (<any>window).onBtReset = onBtReset;
}

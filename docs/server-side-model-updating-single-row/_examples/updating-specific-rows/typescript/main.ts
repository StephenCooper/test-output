import {
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GridApi,
  GridOptions,
  HighlightChangesModule,
  IServerSideDatasource,
  ModuleRegistry,
  RowApiModule,
  RowModelType,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";

ModuleRegistry.registerModules([
  RowApiModule,
  HighlightChangesModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let versionCounter: number = 0;
const columnDefs: ColDef[] = [
  { field: "athlete" },
  { field: "date" },
  { field: "country" },
  { field: "version" },
];

let gridApi: GridApi;

const gridOptions: GridOptions = {
  defaultColDef: {
    flex: 1,
    sortable: false,
    enableCellChangeFlash: true,
  },
  columnDefs,
  // use the enterprise row model
  rowModelType: "serverSide",
  cacheBlockSize: 75,
  getRowId: (params) => `${params.data.athlete}-${params.data.date}`,
};

function updateRows(athlete?: string, date?: string) {
  versionCounter += 1;
  gridApi!.forEachNode((rowNode) => {
    if (athlete != null && rowNode.data.athlete !== athlete) {
      return;
    }

    if (date != null && rowNode.data.date !== date) {
      return;
    }

    // arbitrarily update some data
    const updated = rowNode.data;
    updated.version =
      versionCounter + " - " + versionCounter + " - " + versionCounter;

    // directly update data in rowNode
    rowNode.updateData(updated);
  });
}

const getServerSideDatasource = (server: any): IServerSideDatasource => {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);

      const response = server.getData(params.request);

      const dataWithVersion = response.rows.map((rowData: any) => {
        return {
          ...rowData,
          version:
            versionCounter + " - " + versionCounter + " - " + versionCounter,
        };
      });

      // adding delay to simulate real server call
      setTimeout(() => {
        if (response.success) {
          // call the success callback
          params.success({
            rowData: dataWithVersion,
            rowCount: response.lastRow,
          });
        } else {
          // inform the grid request failed
          params.fail();
        }
      }, 1000);
    },
  };
};

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
  (<any>window).updateRows = updateRows;
}

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
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  RowGroupingModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;
const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "country", rowGroup: true, hide: true },
    { field: "sport" },
    { field: "year", minWidth: 100 },
    { field: "gold", aggFunc: "sum", enableValue: true },
    { field: "silver", aggFunc: "sum", enableValue: true },
    { field: "bronze", aggFunc: "sum", enableValue: true },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 120,
  },
  autoGroupColumnDef: {
    flex: 1,
    minWidth: 280,
  },

  // use the server-side row model
  rowModelType: "serverSide",
  groupAllowUnbalanced: true,
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
      }, 2000);
    },
  };
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
  .then((response) => response.json())
  .then(function (data) {
    // add unbalanced data to the top of the dataset
    const unbalancedData = data.map((item: IOlympicData) => ({
      ...item,
      country: item.country === null ? "" : item.country,
    }));
    unbalancedData.sort((a: IOlympicData, b: IOlympicData) =>
      a.country === "" ? -1 : 1,
    );
    // setup the fake server with entire dataset
    const fakeServer = new FakeServer(unbalancedData);

    // create datasource with a reference to the fake server
    const datasource = getServerSideDatasource(fakeServer);

    // register the datasource with the grid
    gridApi!.setGridOption("serverSideDatasource", datasource);
  });

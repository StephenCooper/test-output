import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
  ValueGetterParams,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const athleteColumn = {
  headerName: "Athlete",
  valueGetter: (params: ValueGetterParams<IOlympicData>) => {
    return params.data ? params.data.athlete : undefined;
  },
};

function getColDefsMedalsIncluded(): ColDef<IOlympicData>[] {
  return [
    athleteColumn,
    {
      colId: "myAgeCol",
      headerName: "Age",
      valueGetter: (params: ValueGetterParams<IOlympicData>) => {
        return params.data ? params.data.age : undefined;
      },
    },
    {
      headerName: "Country",
      headerClass: "country-header",
      valueGetter: (params: ValueGetterParams<IOlympicData>) => {
        return params.data ? params.data.country : undefined;
      },
    },
    { field: "sport" },
    { field: "year" },
    { field: "date" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
}

function getColDefsMedalsExcluded(): ColDef<IOlympicData>[] {
  return [
    athleteColumn,
    {
      colId: "myAgeCol",
      headerName: "Age",
      valueGetter: (params: ValueGetterParams<IOlympicData>) => {
        return params.data ? params.data.age : undefined;
      },
    },
    {
      headerName: "Country",
      headerClass: "country-header",
      valueGetter: (params: ValueGetterParams<IOlympicData>) => {
        return params.data ? params.data.country : undefined;
      },
    },
    { field: "sport" },
    { field: "year" },
    { field: "date" },
  ];
}

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    initialWidth: 100,
  },
  columnDefs: getColDefsMedalsIncluded(),
};

function onBtExcludeMedalColumns() {
  gridApi!.setGridOption("columnDefs", getColDefsMedalsExcluded());
}

function onBtIncludeMedalColumns() {
  gridApi!.setGridOption("columnDefs", getColDefsMedalsIncluded());
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onBtExcludeMedalColumns = onBtExcludeMedalColumns;
  (<any>window).onBtIncludeMedalColumns = onBtIncludeMedalColumns;
}

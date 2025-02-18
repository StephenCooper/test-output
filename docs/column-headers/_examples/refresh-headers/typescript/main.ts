import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { CustomHeader } from "./customHeader";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ],
  defaultColDef: {
    headerComponent: CustomHeader,
  },
};

function onBtUpperNames() {
  const columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  columnDefs.forEach((c) => {
    c.headerName = c.field!.toUpperCase();
  });
  gridApi!.setGridOption("columnDefs", columnDefs);
}

function onBtLowerNames() {
  const columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  columnDefs.forEach((c) => {
    c.headerName = c.field;
  });
  gridApi!.setGridOption("columnDefs", columnDefs);
}

function onBtFilterOn() {
  const columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  columnDefs.forEach((c) => {
    c.filter = true;
  });
  gridApi!.setGridOption("columnDefs", columnDefs);
}

function onBtFilterOff() {
  const columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  columnDefs.forEach((c) => {
    c.filter = false;
  });
  gridApi!.setGridOption("columnDefs", columnDefs);
}

function onBtResizeOn() {
  const columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  columnDefs.forEach((c) => {
    c.resizable = true;
  });
  gridApi!.setGridOption("columnDefs", columnDefs);
}

function onBtResizeOff() {
  const columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  columnDefs.forEach((c) => {
    c.resizable = false;
  });
  gridApi!.setGridOption("columnDefs", columnDefs);
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then(function (data) {
    gridApi!.setGridOption("rowData", data);
  });

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onBtUpperNames = onBtUpperNames;
  (<any>window).onBtLowerNames = onBtLowerNames;
  (<any>window).onBtFilterOn = onBtFilterOn;
  (<any>window).onBtFilterOff = onBtFilterOff;
  (<any>window).onBtResizeOn = onBtResizeOn;
  (<any>window).onBtResizeOff = onBtResizeOff;
}

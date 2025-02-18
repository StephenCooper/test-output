import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [{ field: "accented", width: 150 }];

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: columnDefs,
  accentedSort: true,
  rowData: [{ accented: "aàáä" }, { accented: "aäàá" }, { accented: "aáàä" }],
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

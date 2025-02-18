import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  INumberFilterParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  ValueGetterParams,
  createGrid,
} from "ag-grid-community";

ModuleRegistry.registerModules([
  TextFilterModule,
  ClientSideRowModelModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

const originalColumnDefs: ColDef[] = [
  { field: "athlete" },
  {
    field: "age",
    maxWidth: 120,
    filter: "agNumberColumnFilter",
    filterParams: {
      includeBlanksInEquals: false,
      includeBlanksInNotEqual: false,
      includeBlanksInLessThan: false,
      includeBlanksInGreaterThan: false,
      includeBlanksInRange: false,
    } as INumberFilterParams,
  },
  {
    headerName: "Description",
    valueGetter: (params: ValueGetterParams) => `Age is ${params.data.age}`,
    minWidth: 340,
  },
];

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: originalColumnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  rowData: [
    {
      athlete: "Alberto Gutierrez",
      age: 36,
    },
    {
      athlete: "Niall Crosby",
      age: 40,
    },
    {
      athlete: "Sean Landsman",
      age: null,
    },
    {
      athlete: "Robert Clarke",
      age: undefined,
    },
  ],
};

function updateParams(toChange: string) {
  const value: boolean = (
    document.getElementById(`checkbox${toChange}`) as HTMLInputElement
  ).checked;
  originalColumnDefs[1].filterParams[`includeBlanksIn${toChange}`] = value;

  gridApi!.setGridOption("columnDefs", originalColumnDefs);
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).updateParams = updateParams;
}

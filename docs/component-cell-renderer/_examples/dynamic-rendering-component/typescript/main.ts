import {
  CellEditingStartedEvent,
  CellEditingStoppedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ICellRendererParams,
  ModuleRegistry,
  RowEditingStartedEvent,
  RowEditingStoppedEvent,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { GenderRenderer } from "./genderRenderer";
import { MoodRenderer } from "./moodRenderer";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

interface IRow {
  value: number | string;
  type: "age" | "gender" | "mood";
}

const rowData: IRow[] = [
  { value: 14, type: "age" },
  { value: "Female", type: "gender" },
  { value: "Happy", type: "mood" },
  { value: 21, type: "age" },
  { value: "Male", type: "gender" },
  { value: "Sad", type: "mood" },
];

let gridApi: GridApi<IRow>;

const gridOptions: GridOptions<IRow> = {
  columnDefs: [
    { field: "value" },
    {
      headerName: "Rendered Value",
      field: "value",
      cellRendererSelector: (params: ICellRendererParams<IRow>) => {
        const moodDetails = {
          component: MoodRenderer,
        };

        const genderDetails = {
          component: GenderRenderer,
          params: { values: ["Male", "Female"] },
        };
        if (params.data) {
          if (params.data.type === "gender") return genderDetails;
          else if (params.data.type === "mood") return moodDetails;
        }
        return undefined;
      },
    },
    { field: "type" },
  ],
  defaultColDef: {
    flex: 1,
    cellDataType: false,
  },
  rowData: rowData,
  onRowEditingStarted: (event: RowEditingStartedEvent<IRow>) => {
    console.log("never called - not doing row editing");
  },
  onRowEditingStopped: (event: RowEditingStoppedEvent<IRow>) => {
    console.log("never called - not doing row editing");
  },
  onCellEditingStarted: (event: CellEditingStartedEvent<IRow>) => {
    console.log("cellEditingStarted");
  },
  onCellEditingStopped: (event: CellEditingStoppedEvent<IRow>) => {
    console.log("cellEditingStopped");
  },
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

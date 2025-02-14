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
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  { field: "athlete", colId: "athlete" },
  { field: "age", colId: "age" },
  { field: "country", colId: "country" },
  { field: "year", colId: "year" },
  { field: "date", colId: "date" },
  { field: "total", colId: "total" },
  { field: "gold", colId: "gold" },
  { field: "silver", colId: "silver" },
  { field: "bronze", colId: "bronze" },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    initialWidth: 150,
    filter: true,
  },
  columnDefs: columnDefs,
  maintainColumnOrder: true,
};

function onBtNoGroups() {
  const columnDefs: ColDef[] = [
    { field: "athlete", colId: "athlete" },
    { field: "age", colId: "age" },
    { field: "country", colId: "country" },
    { field: "year", colId: "year" },
    { field: "date", colId: "date" },
    { field: "total", colId: "total" },
    { field: "gold", colId: "gold" },
    { field: "silver", colId: "silver" },
    { field: "bronze", colId: "bronze" },
  ];
  gridApi!.setGridOption("columnDefs", columnDefs);
}

function onMedalsInGroupOnly() {
  const columnDefs: (ColDef | ColGroupDef)[] = [
    { field: "athlete", colId: "athlete" },
    { field: "age", colId: "age" },
    { field: "country", colId: "country" },
    { field: "year", colId: "year" },
    { field: "date", colId: "date" },
    {
      headerName: "Medals",
      headerClass: "medals-group",
      children: [
        { field: "total", colId: "total" },
        { field: "gold", colId: "gold" },
        { field: "silver", colId: "silver" },
        { field: "bronze", colId: "bronze" },
      ],
    },
  ];
  gridApi!.setGridOption("columnDefs", columnDefs);
}

function onParticipantInGroupOnly() {
  const columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: "Participant",
      headerClass: "participant-group",
      children: [
        { field: "athlete", colId: "athlete" },
        { field: "age", colId: "age" },
        { field: "country", colId: "country" },
        { field: "year", colId: "year" },
        { field: "date", colId: "date" },
      ],
    },
    { field: "total", colId: "total" },
    { field: "gold", colId: "gold" },
    { field: "silver", colId: "silver" },
    { field: "bronze", colId: "bronze" },
  ];
  gridApi!.setGridOption("columnDefs", columnDefs);
}

function onParticipantAndMedalsInGroups() {
  const columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: "Participant",
      headerClass: "participant-group",
      children: [
        { field: "athlete", colId: "athlete" },
        { field: "age", colId: "age" },
        { field: "country", colId: "country" },
        { field: "year", colId: "year" },
        { field: "date", colId: "date" },
      ],
    },
    {
      headerName: "Medals",
      headerClass: "medals-group",
      children: [
        { field: "total", colId: "total" },
        { field: "gold", colId: "gold" },
        { field: "silver", colId: "silver" },
        { field: "bronze", colId: "bronze" },
      ],
    },
  ];
  gridApi!.setGridOption("columnDefs", columnDefs);
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onBtNoGroups = onBtNoGroups;
  (<any>window).onMedalsInGroupOnly = onMedalsInGroupOnly;
  (<any>window).onParticipantInGroupOnly = onParticipantInGroupOnly;
  (<any>window).onParticipantAndMedalsInGroups = onParticipantAndMedalsInGroups;
}

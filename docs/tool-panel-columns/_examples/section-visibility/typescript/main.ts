import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  PivotModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { headerName: "Name", field: "athlete", minWidth: 200 },
    { field: "age", enableRowGroup: true },
    { field: "country", minWidth: 200 },
    { field: "year" },
    { field: "date", suppressColumnsToolPanel: true, minWidth: 180 },
    { field: "sport", minWidth: 200 },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
    { field: "total", aggFunc: "sum" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    enablePivot: true,
  },
  autoGroupColumnDef: {
    minWidth: 200,
  },
  sideBar: {
    toolPanels: [
      {
        id: "columns",
        labelDefault: "Columns",
        labelKey: "columns",
        iconKey: "columns",
        toolPanel: "agColumnsToolPanel",
        toolPanelParams: {
          suppressRowGroups: true,
          suppressValues: true,
          suppressPivots: true,
          suppressPivotMode: true,
          suppressColumnFilter: true,
          suppressColumnSelectAll: true,
          suppressColumnExpandAll: true,
        },
      },
    ],
    defaultToolPanel: "columns",
  },
};

function showPivotModeSection() {
  const columnToolPanel = gridApi!.getToolPanelInstance("columns")!;
  columnToolPanel.setPivotModeSectionVisible(true);
}

function showRowGroupsSection() {
  const columnToolPanel = gridApi!.getToolPanelInstance("columns")!;
  columnToolPanel.setRowGroupsSectionVisible(true);
}

function showValuesSection() {
  const columnToolPanel = gridApi!.getToolPanelInstance("columns")!;
  columnToolPanel.setValuesSectionVisible(true);
}

function showPivotSection() {
  const columnToolPanel = gridApi!.getToolPanelInstance("columns")!;
  columnToolPanel.setPivotSectionVisible(true);
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).showPivotModeSection = showPivotModeSection;
  (<any>window).showRowGroupsSection = showRowGroupsSection;
  (<any>window).showValuesSection = showValuesSection;
  (<any>window).showPivotSection = showPivotSection;
}

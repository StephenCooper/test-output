import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  IDetailCellRendererParams,
  ModuleRegistry,
  PaginationModule,
  RowApiModule,
  RowSelectionModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
import { IAccount } from "./interfaces";

ModuleRegistry.registerModules([
  RowSelectionModule,
  PaginationModule,
  RowApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IAccount>;

const gridOptions: GridOptions<IAccount> = {
  columnDefs: [
    // group cell renderer needed for expand / collapse icons
    { field: "name", cellRenderer: "agGroupCellRenderer" },
    { field: "account" },
    { field: "calls" },
    { field: "minutes", valueFormatter: "x.toLocaleString() + 'm'" },
  ],
  defaultColDef: {
    flex: 1,
  },
  masterDetail: true,
  detailCellRendererParams: {
    detailGridOptions: {
      rowSelection: { mode: "multiRow", headerCheckbox: false },
      pagination: true,
      paginationAutoPageSize: true,
      columnDefs: [
        { field: "callId" },
        { field: "direction" },
        { field: "number", minWidth: 150 },
        { field: "duration", valueFormatter: "x.toLocaleString() + 's'" },
        { field: "switchCode", minWidth: 150 },
      ],
      defaultColDef: {
        flex: 1,
      },
    },
    getDetailRowData: (params) => {
      params.successCallback(params.data.callRecords);
    },
  } as IDetailCellRendererParams<IAccount, ICallRecord>,
  onFirstDataRendered: onFirstDataRendered,
};

function onFirstDataRendered(params: FirstDataRenderedEvent) {
  // arbitrarily expand a row for presentational purposes
  setTimeout(() => {
    params.api.getDisplayedRowAtIndex(1)!.setExpanded(true);
  }, 0);
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/master-detail-data.json")
  .then((response) => response.json())
  .then((data: IAccount[]) => {
    gridApi!.setGridOption("rowData", data);
  });

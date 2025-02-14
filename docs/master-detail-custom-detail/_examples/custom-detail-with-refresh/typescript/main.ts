import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  HighlightChangesModule,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
import { DetailCellRenderer } from "./detailCellRenderer";
import { IAccount } from "./interfaces";

ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  HighlightChangesModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
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
    enableCellChangeFlash: true,
  },
  masterDetail: true,
  detailCellRenderer: DetailCellRenderer,
  detailRowHeight: 70,
  groupDefaultExpanded: 1,
  onFirstDataRendered: onFirstDataRendered,
};

let allRowData: any[];

function onFirstDataRendered(params: FirstDataRenderedEvent) {
  setInterval(() => {
    if (!allRowData) {
      return;
    }

    const data = allRowData[0];

    const newCallRecords: any[] = [];
    data.callRecords.forEach((record: any, index: number) => {
      newCallRecords.push({
        name: record.name,
        callId: record.callId,
        duration: record.duration + (index % 2),
        switchCode: record.switchCode,
        direction: record.direction,
        number: record.number,
      });
    });

    data.callRecords = newCallRecords;
    data.calls++;

    const tran = {
      update: [data],
    };

    params.api.applyTransaction(tran);
  }, 2000);
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/master-detail-data.json")
  .then((response) => response.json())
  .then((data: IAccount[]) => {
    allRowData = data;
    gridApi!.setGridOption("rowData", allRowData);
  });

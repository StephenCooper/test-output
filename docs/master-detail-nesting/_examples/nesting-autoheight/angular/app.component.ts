import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDetailCellRendererParams,
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
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [rowData]="rowData"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [groupDefaultExpanded]="groupDefaultExpanded"
    [masterDetail]="true"
    [detailRowAutoHeight]="true"
    [detailCellRendererParams]="detailCellRendererParams"
  /> `,
})
export class AppComponent {
  rowData: any[] | null = [
    {
      a1: "level 1 - 111",
      b1: "level 1 - 222",
      children: [
        {
          a2: "level 2 - 333",
          b2: "level 2 - 444",
          children: [
            { a3: "level 3 - 5551", b3: "level 3 - 6661" },
            { a3: "level 3 - 5552", b3: "level 3 - 6662" },
            { a3: "level 3 - 5553", b3: "level 3 - 6663" },
            { a3: "level 3 - 5554", b3: "level 3 - 6664" },
            { a3: "level 3 - 5555", b3: "level 3 - 6665" },
            { a3: "level 3 - 5556", b3: "level 3 - 6666" },
          ],
        },
      ],
    },
    {
      a1: "level 1 - 111",
      b1: "level 1 - 222",
      children: [
        {
          a2: "level 2 - 333",
          b2: "level 2 - 444",
          children: [
            { a3: "level 3 - 5551", b3: "level 3 - 6661" },
            { a3: "level 3 - 5552", b3: "level 3 - 6662" },
            { a3: "level 3 - 5553", b3: "level 3 - 6663" },
            { a3: "level 3 - 5554", b3: "level 3 - 6664" },
            { a3: "level 3 - 5555", b3: "level 3 - 6665" },
            { a3: "level 3 - 5556", b3: "level 3 - 6666" },
          ],
        },
      ],
    },
  ];
  columnDefs: ColDef[] = [
    { field: "a1", cellRenderer: "agGroupCellRenderer" },
    { field: "b1" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
  };
  groupDefaultExpanded = 1;
  detailCellRendererParams: any = {
    // level 2 grid options
    detailGridOptions: {
      columnDefs: [
        { field: "a2", cellRenderer: "agGroupCellRenderer" },
        { field: "b2" },
      ],
      defaultColDef: {
        flex: 1,
      },
      groupDefaultExpanded: 1,
      masterDetail: true,
      detailRowHeight: 240,
      detailRowAutoHeight: true,
      detailCellRendererParams: {
        // level 3 grid options
        detailGridOptions: {
          columnDefs: [
            { field: "a3", cellRenderer: "agGroupCellRenderer" },
            { field: "b3" },
          ],
          defaultColDef: {
            flex: 1,
          },
        },
        getDetailRowData: (params) => {
          params.successCallback(params.data.children);
        },
      } as IDetailCellRendererParams,
    },
    getDetailRowData: (params) => {
      params.successCallback(params.data.children);
    },
  } as IDetailCellRendererParams;
}

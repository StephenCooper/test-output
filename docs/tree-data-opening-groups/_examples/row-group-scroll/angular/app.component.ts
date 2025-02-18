import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetDataPath,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowGroupOpenedEvent,
  ScrollApiModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { TreeDataModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ScrollApiModule,
  ClientSideRowModelModule,
  TreeDataModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [autoGroupColumnDef]="autoGroupColumnDef"
    [rowData]="rowData"
    [treeData]="true"
    [getDataPath]="getDataPath"
    [animateRows]="false"
    (rowGroupOpened)="onRowGroupOpened($event)"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "created" },
    { field: "modified" },
    {
      field: "size",
      aggFunc: "sum",
      valueFormatter: (params) => {
        const sizeInKb = params.value / 1024;
        if (sizeInKb > 1024) {
          return `${+(sizeInKb / 1024).toFixed(2)} MB`;
        } else {
          return `${+sizeInKb.toFixed(2)} KB`;
        }
      },
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    filter: true,
  };
  autoGroupColumnDef: ColDef = {
    headerName: "File Explorer",
    minWidth: 280,
    filter: "agTextColumnFilter",
    cellRendererParams: {
      suppressCount: true,
    },
  };
  rowData: any[] | null = getData();
  getDataPath: GetDataPath = (data) => data.path;

  onRowGroupOpened(event: RowGroupOpenedEvent<IOlympicData>) {
    if (event.expanded) {
      const rowNodeIndex = event.node.rowIndex!;
      // factor in child nodes so we can scroll to correct position
      const childCount = event.node.childrenAfterSort
        ? event.node.childrenAfterSort.length
        : 0;
      const newIndex = rowNodeIndex + childCount;
      this.gridApi.ensureIndexVisible(newIndex);
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

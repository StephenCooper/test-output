import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  CellDoubleClickedEvent,
  CellKeyDownEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetDataPath,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { TreeDataModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TreeDataModule,
  ValidationModule /* Development Only */,
]);
import { CustomGroupCellRenderer } from "./custom-group-cell-renderer.component";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, CustomGroupCellRenderer],
  template: `
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [treeData]="true"
      [getDataPath]="getDataPath"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [defaultColDef]="defaultColDef"
      [groupDefaultExpanded]="groupDefaultExpanded"
      [rowData]="rowData"
      (cellDoubleClicked)="onCellDoubleClicked($event)"
      (cellKeyDown)="onCellKeyDown($event)"
    />
  `,
})
export class AppComponent {
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
  getDataPath: GetDataPath = (data) => data.path;
  autoGroupColumnDef: ColDef = {
    cellRenderer: CustomGroupCellRenderer,
  };
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
  };
  groupDefaultExpanded = -1;
  rowData: any[] | null = getData();

  onCellDoubleClicked(params: CellDoubleClickedEvent<IOlympicData, any>) {
    if (params.colDef.showRowGroup) {
      params.node.setExpanded(!params.node.expanded);
    }
  }

  onCellKeyDown(params: CellKeyDownEvent<IOlympicData, any>) {
    if (!("colDef" in params)) {
      return;
    }
    if (!(params.event instanceof KeyboardEvent)) {
      return;
    }
    if (params.event.code !== "Enter") {
      return;
    }
    if (params.colDef.showRowGroup) {
      params.node.setExpanded(!params.node.expanded);
    }
  }
}

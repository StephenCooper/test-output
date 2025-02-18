import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  CellDoubleClickedEvent,
  CellKeyDownEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowGroupingDisplayType,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);
import { CustomGroupCellRenderer } from "./customGroupCellRenderer.component";
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, CustomGroupCellRenderer],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [autoGroupColumnDef]="autoGroupColumnDef"
    [defaultColDef]="defaultColDef"
    [groupDefaultExpanded]="groupDefaultExpanded"
    [groupDisplayType]="groupDisplayType"
    [rowData]="rowData"
    (cellDoubleClicked)="onCellDoubleClicked($event)"
    (cellKeyDown)="onCellKeyDown($event)"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      field: "country",
      rowGroup: true,
      hide: true,
    },
    {
      field: "year",
      rowGroup: true,
      hide: true,
    },
    {
      field: "athlete",
    },
    {
      field: "total",
      aggFunc: "sum",
    },
  ];
  autoGroupColumnDef: ColDef = {
    cellRenderer: CustomGroupCellRenderer,
  };
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
  };
  groupDefaultExpanded = 1;
  groupDisplayType: RowGroupingDisplayType = "multipleColumns";
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

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

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}

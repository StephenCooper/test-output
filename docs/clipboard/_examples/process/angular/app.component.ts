import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  CellSelectionOptions,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  ProcessCellForExportParams,
  ProcessGroupHeaderForExportParams,
  ProcessHeaderForExportParams,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [cellSelection]="true"
    [processCellForClipboard]="processCellForClipboard"
    [processHeaderForClipboard]="processHeaderForClipboard"
    [processGroupHeaderForClipboard]="processGroupHeaderForClipboard"
    [processCellFromClipboard]="processCellFromClipboard"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: "Participants",
      children: [
        { field: "athlete", headerName: "Athlete Name", minWidth: 200 },
        { field: "age" },
        { field: "country", minWidth: 150 },
      ],
    },
    {
      headerName: "Olympic Games",
      children: [
        { field: "year" },
        { field: "date", minWidth: 150 },
        { field: "sport", minWidth: 150 },
        { field: "gold" },
        { field: "silver", suppressPaste: true },
        { field: "bronze" },
        { field: "total" },
      ],
    },
  ];
  defaultColDef: ColDef = {
    editable: true,
    flex: 1,
    minWidth: 100,
    cellDataType: false,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }

  processCellForClipboard = (params: ProcessCellForExportParams) => {
    return "C-" + params.value;
  };

  processHeaderForClipboard = (params: ProcessHeaderForExportParams) => {
    const colDef = params.column.getColDef();
    let headerName = colDef.headerName || colDef.field || "";
    if (colDef.headerName !== "") {
      headerName = headerName.charAt(0).toUpperCase() + headerName.slice(1);
    }
    return "H-" + headerName;
  };

  processGroupHeaderForClipboard = (
    params: ProcessGroupHeaderForExportParams,
  ) => {
    const colGroupDef = params.columnGroup.getColGroupDef() || ({} as any);
    const headerName = colGroupDef.headerName || "";
    if (headerName === "") {
      return "";
    }
    return "GH-" + headerName;
  };

  processCellFromClipboard = (params: ProcessCellForExportParams) => {
    return "Z-" + params.value;
  };
}

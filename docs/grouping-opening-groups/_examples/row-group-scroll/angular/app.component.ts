import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  RowGroupOpenedEvent,
  RowGroupingDisplayType,
  ScrollApiModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ScrollApiModule,
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  ClientSideRowModelModule,
  RowGroupingModule,
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
    [animateRows]="false"
    [groupDisplayType]="groupDisplayType"
    [defaultColDef]="defaultColDef"
    [rowData]="rowData"
    (rowGroupOpened)="onRowGroupOpened($event)"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "athlete", width: 150, rowGroupIndex: 0 },
    { field: "age", width: 90, rowGroupIndex: 1 },
    { field: "country", width: 120, rowGroupIndex: 2 },
    { field: "year", width: 90 },
    { field: "date", width: 110, rowGroupIndex: 2 },
  ];
  groupDisplayType: RowGroupingDisplayType = "groupRows";
  defaultColDef: ColDef = {
    editable: true,
    filter: true,
    flex: 1,
    minWidth: 100,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

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

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}

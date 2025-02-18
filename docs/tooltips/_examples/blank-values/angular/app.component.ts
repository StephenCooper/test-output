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
  ITooltipParams,
  ModuleRegistry,
  TooltipModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TooltipModule,
  ClientSideRowModelModule,
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
    [tooltipShowDelay]="tooltipShowDelay"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      headerName: "A - Missing Value, NO Tooltip",
      field: "athlete",
      tooltipField: "athlete",
    },
    {
      headerName: "B - Missing Value, WITH Tooltip",
      field: "athlete",
      tooltipValueGetter: toolTipValueGetter,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
  };
  tooltipShowDelay = 500;
  rowData!: any[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent) {
    this.http
      .get<any[]>("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        // set some blank values to test tooltip against
        data[0].athlete = undefined;
        data[1].athlete = null;
        data[2].athlete = "";
        this.rowData = data;
      });
  }
}

const toolTipValueGetter = (params: ITooltipParams) =>
  params.value == null || params.value === "" ? "- Missing -" : params.value;

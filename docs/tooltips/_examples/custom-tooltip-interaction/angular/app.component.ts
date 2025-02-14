import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowApiModule,
  TooltipModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TooltipModule,
  ClientSideRowModelModule,
  RowApiModule,
  ValidationModule /* Development Only */,
]);
import { CustomTooltip } from "./custom-tooltip.component";
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, CustomTooltip],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [tooltipInteraction]="true"
    [tooltipShowDelay]="tooltipShowDelay"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      field: "athlete",
      minWidth: 150,
      tooltipField: "athlete",
      tooltipComponentParams: { type: "success" },
    },
    { field: "age", minWidth: 130, tooltipField: "age" },
    { field: "year" },
    { field: "sport" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    tooltipComponent: CustomTooltip,
  };
  tooltipShowDelay = 500;
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        this.rowData = data;
      });
  }
}

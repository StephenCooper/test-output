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
import { IOlympicData } from "./interfaces";

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
  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: "Athlete",
      field: "athlete",
      // here the Athlete column will tooltip the Country value
      tooltipField: "country",
      headerTooltip: "Tooltip for Athlete Column Header",
    },
    {
      field: "age",
      tooltipValueGetter: (p: ITooltipParams) =>
        "Create any fixed message, e.g. This is the Athlete’s Age ",
      headerTooltip: "Tooltip for Age Column Header",
    },
    {
      field: "year",
      tooltipValueGetter: (p: ITooltipParams) =>
        "This is a dynamic tooltip using the value of " + p.value,
      headerTooltip: "Tooltip for Year Column Header",
    },
    {
      headerName: "Hover For Tooltip",
      headerTooltip: "Column Groups can have Tooltips also",
      children: [
        {
          field: "sport",
          tooltipValueGetter: () => "Tooltip text about Sport should go here",
          headerTooltip: "Tooltip for Sport Column Header",
        },
      ],
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
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

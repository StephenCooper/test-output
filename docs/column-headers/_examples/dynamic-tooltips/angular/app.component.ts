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
  NumberEditorModule,
  NumberFilterModule,
  TextEditorModule,
  TextFilterModule,
  TooltipModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  TooltipModule,
  ValidationModule /* Development Only */,
]);
import { CustomHeader } from "./custom-header.component";
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, CustomHeader],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      field: "athlete",
      headerName: "Athlete's Full Name",
      suppressHeaderFilterButton: true,
      minWidth: 120,
    },
    {
      field: "age",
      headerName: "Athlete's Age",
      sortable: false,
      headerComponentParams: { menuIcon: "fa-external-link-alt" },
    },
    {
      field: "country",
      headerName: "Athlete's Country",
      suppressHeaderFilterButton: true,
      minWidth: 120,
    },
    { field: "year", headerName: "Event Year", sortable: false },
    {
      field: "date",
      headerName: "Event Date",
      suppressHeaderFilterButton: true,
    },
    { field: "sport", sortable: false },
    {
      field: "gold",
      headerName: "Gold Medals",
      headerComponentParams: { menuIcon: "fa-cog" },
      minWidth: 120,
    },
    { field: "silver", headerName: "Silver Medals", sortable: false },
    {
      field: "bronze",
      headerName: "Bronze Medals",
      suppressHeaderFilterButton: true,
      minWidth: 120,
    },
    { field: "total", headerName: "Total Medals", sortable: false },
  ];
  defaultColDef: ColDef = {
    editable: true,
    filter: true,
    width: 120,
    headerComponent: CustomHeader,
    headerComponentParams: {
      menuIcon: "fa-bars",
    },
  };
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

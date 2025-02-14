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
  ValidationModule,
  ValueGetterParams,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="test-container">
    <div class="test-header">
      <button (click)="onBtIncludeMedalColumns()">Include Medal Columns</button>
      <button (click)="onBtExcludeMedalColumns()">Exclude Medal Columns</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      class="test-grid"
      [defaultColDef]="defaultColDef"
      [columnDefs]="columnDefs"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  defaultColDef: ColDef = {
    initialWidth: 100,
  };
  columnDefs: ColDef[] = getColDefsMedalsIncluded();
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onBtExcludeMedalColumns() {
    this.gridApi.setGridOption("columnDefs", getColDefsMedalsExcluded());
  }

  onBtIncludeMedalColumns() {
    this.gridApi.setGridOption("columnDefs", getColDefsMedalsIncluded());
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

const athleteColumn = {
  headerName: "Athlete",
  valueGetter: (params: ValueGetterParams<IOlympicData>) => {
    return params.data ? params.data.athlete : undefined;
  },
};
function getColDefsMedalsIncluded(): ColDef<IOlympicData>[] {
  return [
    athleteColumn,
    {
      colId: "myAgeCol",
      headerName: "Age",
      valueGetter: (params: ValueGetterParams<IOlympicData>) => {
        return params.data ? params.data.age : undefined;
      },
    },
    {
      headerName: "Country",
      headerClass: "country-header",
      valueGetter: (params: ValueGetterParams<IOlympicData>) => {
        return params.data ? params.data.country : undefined;
      },
    },
    { field: "sport" },
    { field: "year" },
    { field: "date" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
}
function getColDefsMedalsExcluded(): ColDef<IOlympicData>[] {
  return [
    athleteColumn,
    {
      colId: "myAgeCol",
      headerName: "Age",
      valueGetter: (params: ValueGetterParams<IOlympicData>) => {
        return params.data ? params.data.age : undefined;
      },
    },
    {
      headerName: "Country",
      headerClass: "country-header",
      valueGetter: (params: ValueGetterParams<IOlympicData>) => {
        return params.data ? params.data.country : undefined;
      },
    },
    { field: "sport" },
    { field: "year" },
    { field: "date" },
  ];
}

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
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
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
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      groupId: "athleteGroupId",
      headerName: "Athlete",
      children: [
        {
          headerName: "Name",
          field: "athlete",
          minWidth: 150,
          columnChooserParams: {
            columnLayout: [
              {
                headerName: "Group 1",
                children: [
                  // custom column order with columns "gold", "silver", "bronze" omitted
                  { field: "sport" },
                  { field: "athlete" },
                  { field: "age" },
                ],
              },
            ],
          },
        },
        {
          field: "age",
          minWidth: 120,
        },
        {
          field: "sport",
          minWidth: 150,
          columnChooserParams: {
            // contracts all column groups
            contractColumnSelection: true,
          },
        },
      ],
    },
    {
      groupId: "medalsGroupId",
      headerName: "Medals",
      children: [{ field: "gold" }, { field: "silver" }, { field: "bronze" }],
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
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
}

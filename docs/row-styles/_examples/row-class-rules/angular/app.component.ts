import { Component } from "@angular/core";
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
  RowApiModule,
  RowClassRules,
  RowStyleModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextEditorModule,
  NumberEditorModule,
  RowApiModule,
  RowStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 5px">
      <button (click)="setData()">Update Data</button>
    </div>

    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [rowData]="rowData"
      [columnDefs]="columnDefs"
      [rowClassRules]="rowClassRules"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  rowData: any[] | null = getData();
  columnDefs: ColDef[] = [
    { headerName: "Employee", field: "employee" },
    { headerName: "Number Sick Days", field: "sickDays", editable: true },
  ];
  rowClassRules: RowClassRules = {
    // row style function
    "sick-days-warning": (params) => {
      const numSickDays = params.data.sickDays;
      return numSickDays > 5 && numSickDays <= 7;
    },
    // row style expression
    "sick-days-breach": "data.sickDays >= 8",
  };

  setData() {
    this.gridApi.forEachNode(function (rowNode) {
      const newData = {
        employee: rowNode.data.employee,
        sickDays: randomInt(),
      };
      rowNode.setData(newData);
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

function randomInt() {
  return Math.floor(Math.random() * 10);
}

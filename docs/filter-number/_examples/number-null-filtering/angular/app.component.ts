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
  INumberFilterParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  ValueGetterParams,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextFilterModule,
  ClientSideRowModelModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="test-container">
    <div class="test-header">
      <div class="test-label">Include NULL<br />in age:</div>
      <label
        ><input
          type="checkbox"
          id="checkboxEquals"
          (change)="updateParams('Equals')"
        />&nbsp;equals</label
      >
      <label
        ><input
          type="checkbox"
          id="checkboxNotEqual"
          (change)="updateParams('NotEqual')"
        />&nbsp;notEqual</label
      >
      <label
        ><input
          type="checkbox"
          id="checkboxLessThan"
          (change)="updateParams('LessThan')"
        />&nbsp;lessThan</label
      >
      <label
        ><input
          type="checkbox"
          id="checkboxGreaterThan"
          (change)="updateParams('GreaterThan')"
        />&nbsp;greaterThan</label
      >
      <label
        ><input
          type="checkbox"
          id="checkboxRange"
          (change)="updateParams('Range')"
        />&nbsp;inRange</label
      >
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = originalColumnDefs;
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
  };
  rowData: any[] | null = [
    {
      athlete: "Alberto Gutierrez",
      age: 36,
    },
    {
      athlete: "Niall Crosby",
      age: 40,
    },
    {
      athlete: "Sean Landsman",
      age: null,
    },
    {
      athlete: "Robert Clarke",
      age: undefined,
    },
  ];

  updateParams(toChange: string) {
    const value: boolean = (
      document.getElementById(`checkbox${toChange}`) as HTMLInputElement
    ).checked;
    originalColumnDefs[1].filterParams[`includeBlanksIn${toChange}`] = value;
    this.gridApi.setGridOption("columnDefs", originalColumnDefs);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

const originalColumnDefs: ColDef[] = [
  { field: "athlete" },
  {
    field: "age",
    maxWidth: 120,
    filter: "agNumberColumnFilter",
    filterParams: {
      includeBlanksInEquals: false,
      includeBlanksInNotEqual: false,
      includeBlanksInLessThan: false,
      includeBlanksInGreaterThan: false,
      includeBlanksInRange: false,
    } as INumberFilterParams,
  },
  {
    headerName: "Description",
    valueGetter: (params: ValueGetterParams) => `Age is ${params.data.age}`,
    minWidth: 340,
  },
];

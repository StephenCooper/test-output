import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  CellApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DateFilterModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDateFilterParams,
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
  ValueGetterParams,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  CellApiModule,
  TextFilterModule,
  ClientSideRowModelModule,
  DateFilterModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="test-container">
    <div class="test-header">
      <div class="test-label">Include NULL<br />in date:</div>
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
      date: null,
    },
    {
      athlete: "Niall Crosby",
      date: undefined,
    },
    {
      athlete: "Sean Landsman",
      date: new Date(2016, 9, 25),
    },
    {
      athlete: "Robert Clarke",
      date: new Date(2016, 9, 25),
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
    field: "date",
    cellDataType: "date",
    filter: "agDateColumnFilter",
    filterParams: {
      includeBlanksInEquals: false,
      includeBlanksInNotEqual: false,
      includeBlanksInLessThan: false,
      includeBlanksInGreaterThan: false,
      includeBlanksInRange: false,
    } as IDateFilterParams,
  },
  {
    headerName: "Description",
    valueGetter: (params: ValueGetterParams) => {
      let date = params.data.date;
      if (date != null) {
        date = params.api.getCellValue({
          rowNode: params.node!,
          colKey: "date",
          useFormatter: true,
        });
      }
      return `Date is ${date}`;
    },
    minWidth: 340,
  },
];

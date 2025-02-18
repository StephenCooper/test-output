import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  CellValueChangedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
  ValueGetterParams,
  ValueSetterParams,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextEditorModule,
  NumberEditorModule,
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
    [rowData]="rowData"
    (cellValueChanged)="onCellValueChanged($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      headerName: "Name",
      valueGetter: (params: ValueGetterParams) => {
        return params.data.firstName + " " + params.data.lastName;
      },
      valueSetter: (params: ValueSetterParams) => {
        const fullName = params.newValue || "";
        const nameSplit = fullName.split(" ");
        const newFirstName = nameSplit[0];
        const newLastName = nameSplit[1];
        const data = params.data;
        if (data.firstName !== newFirstName || data.lastName !== newLastName) {
          data.firstName = newFirstName;
          data.lastName = newLastName;
          // return true to tell grid that the value has changed, so it knows
          // to update the cell
          return true;
        } else {
          // return false, the grid doesn't need to update
          return false;
        }
      },
    },
    {
      headerName: "A",
      field: "a",
    },
    {
      headerName: "B",
      valueGetter: (params: ValueGetterParams) => {
        return params.data.b;
      },
      valueSetter: (params: ValueSetterParams) => {
        const newVal = params.newValue;
        const valueChanged = params.data.b !== newVal;
        if (valueChanged) {
          params.data.b = newVal;
        }
        return valueChanged;
      },
      cellDataType: "number",
    },
    {
      headerName: "C.X",
      valueGetter: (params: ValueGetterParams) => {
        if (params.data.c) {
          return params.data.c.x;
        } else {
          return undefined;
        }
      },
      valueSetter: (params: ValueSetterParams) => {
        const newVal = params.newValue;
        if (!params.data.c) {
          params.data.c = {};
        }
        const valueChanged = params.data.c.x !== newVal;
        if (valueChanged) {
          params.data.c.x = newVal;
        }
        return valueChanged;
      },
      cellDataType: "number",
    },
    {
      headerName: "C.Y",
      valueGetter: (params: ValueGetterParams) => {
        if (params.data.c) {
          return params.data.c.y;
        } else {
          return undefined;
        }
      },
      valueSetter: (params: ValueSetterParams) => {
        const newVal = params.newValue;
        if (!params.data.c) {
          params.data.c = {};
        }
        const valueChanged = params.data.c.y !== newVal;
        if (valueChanged) {
          params.data.c.y = newVal;
        }
        return valueChanged;
      },
      cellDataType: "number",
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    editable: true,
  };
  rowData: any[] | null = getData();

  onCellValueChanged(event: CellValueChangedEvent) {
    console.log("Data after change is", event.data);
  }
}

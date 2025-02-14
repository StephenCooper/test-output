import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  CellEditingStartedEvent,
  CellEditingStoppedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  ModuleRegistry,
  RowEditingStartedEvent,
  RowEditingStoppedEvent,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { GenderRenderer } from "./gender-renderer.component";
import { MoodRenderer } from "./mood-renderer.component";

interface IRow {
  value: number | string;
  type: "age" | "gender" | "mood";
}

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, GenderRenderer, MoodRenderer],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [rowData]="rowData"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    (rowEditingStarted)="onRowEditingStarted($event)"
    (rowEditingStopped)="onRowEditingStopped($event)"
    (cellEditingStarted)="onCellEditingStarted($event)"
    (cellEditingStopped)="onCellEditingStopped($event)"
  /> `,
})
export class AppComponent {
  rowData: IRow[] | null = [
    { value: 14, type: "age" },
    { value: "Female", type: "gender" },
    { value: "Happy", type: "mood" },
    { value: 21, type: "age" },
    { value: "Male", type: "gender" },
    { value: "Sad", type: "mood" },
  ];
  columnDefs: ColDef[] = [
    { field: "value" },
    {
      headerName: "Rendered Value",
      field: "value",
      cellRendererSelector: (params: ICellRendererParams<IRow>) => {
        const moodDetails = {
          component: MoodRenderer,
        };
        const genderDetails = {
          component: GenderRenderer,
          params: { values: ["Male", "Female"] },
        };
        if (params.data) {
          if (params.data.type === "gender") return genderDetails;
          else if (params.data.type === "mood") return moodDetails;
        }
        return undefined;
      },
    },
    { field: "type" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    cellDataType: false,
  };

  onRowEditingStarted(event: RowEditingStartedEvent<IRow>) {
    console.log("never called - not doing row editing");
  }

  onRowEditingStopped(event: RowEditingStoppedEvent<IRow>) {
    console.log("never called - not doing row editing");
  }

  onCellEditingStarted(event: CellEditingStartedEvent<IRow>) {
    console.log("cellEditingStarted");
  }

  onCellEditingStopped(event: CellEditingStoppedEvent<IRow>) {
    console.log("cellEditingStopped");
  }
}

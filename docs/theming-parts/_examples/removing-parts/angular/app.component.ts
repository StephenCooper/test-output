import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import "./style.css";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  GridState,
  ModuleRegistry,
  RowSelectionOptions,
  Theme,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([AllEnterpriseModule]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [rowData]="rowData"
    [theme]="theme"
    [defaultColDef]="defaultColDef"
    [initialState]="initialState"
    [rowSelection]="rowSelection"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "make" },
    { field: "model" },
    { field: "price" },
  ];
  rowData: IOlympicData[] | null = (() => {
    const rowData: any[] = [];
    for (let i = 0; i < 10; i++) {
      rowData.push({
        make: "Toyota",
        model: "Celica",
        price: 35000 + i * 1000,
      });
      rowData.push({ make: "Ford", model: "Mondeo", price: 32000 + i * 1000 });
      rowData.push({
        make: "Porsche",
        model: "Boxster",
        price: 72000 + i * 1000,
      });
    }
    return rowData;
  })();
  theme: Theme | "legacy" = myCustomTheme;
  defaultColDef: ColDef = {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  };
  initialState: GridState = {
    rowSelection: ["1", "2", "3"],
  };
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
    checkboxes: true,
  };
}

const myCustomTheme = themeQuartz.withoutPart("checkboxStyle");

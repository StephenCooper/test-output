import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowSelectionOptions,
  Theme,
  colorSchemeVariable,
  createTheme,
  iconSetMaterial,
} from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
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
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
    checkboxes: true,
  };
}

const myCustomTheme = createTheme()
  // add just the parts you want
  .withPart(iconSetMaterial)
  .withPart(colorSchemeVariable)
  // set default param values
  .withParams({
    accentColor: "red",
    iconSize: 18,
  });

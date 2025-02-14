import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ExcelExportParams,
  ExcelStyle,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
import { createBase64FlagsFromResponse } from "./imageUtils";
import { FlagContext } from "./interfaces";
ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);
import { CountryCellRenderer } from "./country-cell-renderer.component";
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, CountryCellRenderer],
  template: `<div class="container">
    <div>
      <button class="export" (click)="onBtExport()">Export to Excel</button>
    </div>
    <div class="grid-wrapper">
      <ag-grid-angular
        style="width: 100%; height: 100%;"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [excelStyles]="excelStyles"
        [defaultExcelExportParams]="defaultExcelExportParams"
        [context]="context"
        [rowData]="rowData"
        (gridReady)="onGridReady($event)"
      />
    </div>
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "athlete", width: 200 },
    {
      field: "country",
      cellClass: "countryCell",
      cellRenderer: CountryCellRenderer,
    },
    { field: "age" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  defaultColDef: ColDef = {
    width: 150,
  };
  excelStyles: ExcelStyle[] = [
    {
      id: "countryCell",
      alignment: {
        vertical: "Center",
        indent: 4,
      },
    },
  ];
  defaultExcelExportParams: ExcelExportParams = {
    addImageToCell: (rowIndex, col, value) => {
      if (col.getColId() !== "country") {
        return;
      }
      const countryCode = countryCodes[value];
      return {
        image: {
          id: countryCode,
          base64: base64flags[countryCode],
          imageType: "png",
          width: 20,
          height: 11,
          position: {
            offsetX: 10,
            offsetY: 5.5,
          },
        },
        value,
      };
    },
  };
  context: any = {
    base64flags: base64flags,
    countryCodes: countryCodes,
  } as FlagContext;
  rowData!: IOlympicData[];

  onBtExport() {
    this.gridApi.exportDataAsExcel();
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
      .then((data) =>
        createBase64FlagsFromResponse(data, countryCodes, base64flags),
      )
      .then((data) => params.api.setGridOption("rowData", data));
  }
}

const countryCodes: any = {};
const base64flags: any = {};

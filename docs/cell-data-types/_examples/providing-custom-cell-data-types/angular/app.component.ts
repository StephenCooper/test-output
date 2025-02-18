import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  CellSelectionOptions,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DataTypeDefinition,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextEditorModule,
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

interface IOlympicDataTypes extends IOlympicData {
  countryObject: {
    code: string;
  };
  sportObject: {
    name: string;
  };
}

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [dataTypeDefinitions]="dataTypeDefinitions"
    [cellSelection]="cellSelection"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "countryObject", headerName: "Country" },
    { field: "sportObject", headerName: "Sport" },
  ];
  defaultColDef: ColDef = {
    filter: true,
    floatingFilter: true,
    editable: true,
  };
  dataTypeDefinitions: {
    [cellDataType: string]: DataTypeDefinition;
  } = {
    country: {
      baseDataType: "object",
      extendsDataType: "object",
      valueParser: (params) =>
        params.newValue == null || params.newValue === ""
          ? null
          : { code: params.newValue },
      valueFormatter: (params) =>
        params.value == null ? "" : params.value.code,
      dataTypeMatcher: (value: any) => value && !!value.code,
    },
    sport: {
      baseDataType: "object",
      extendsDataType: "object",
      valueParser: (params) =>
        params.newValue == null || params.newValue === ""
          ? null
          : { name: params.newValue },
      valueFormatter: (params) =>
        params.value == null ? "" : params.value.name,
      dataTypeMatcher: (value: any) => value && !!value.name,
    },
  };
  cellSelection: boolean | CellSelectionOptions = { handle: { mode: "fill" } };
  rowData!: IOlympicDataTypes[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent<IOlympicDataTypes>) {
    this.http
      .get<
        IOlympicDataTypes[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe(
        (data) =>
          (this.rowData = data.map((rowData) => {
            const dateParts = rowData.date.split("/");
            return {
              ...rowData,
              countryObject: {
                code: rowData.country,
              },
              sportObject: {
                name: rowData.sport,
              },
            };
          })),
      );
  }
}

import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DataTypeDefinition,
  DateEditorModule,
  DateFilterModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  ValueFormatterLiteParams,
  ValueParserLiteParams,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  NumberEditorModule,
  NumberFilterModule,
  DateEditorModule,
  DateFilterModule,
  TextEditorModule,
  TextFilterModule,
  ClientSideRowModelModule,
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
    [dataTypeDefinitions]="dataTypeDefinitions"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "age" },
    { field: "date" },
  ];
  defaultColDef: ColDef = {
    filter: true,
    floatingFilter: true,
    editable: true,
  };
  dataTypeDefinitions: {
    [cellDataType: string]: DataTypeDefinition;
  } = {
    dateString: {
      baseDataType: "dateString",
      extendsDataType: "dateString",
      valueParser: (params: ValueParserLiteParams<IOlympicData, string>) =>
        params.newValue != null && params.newValue.match("\\d{2}/\\d{2}/\\d{4}")
          ? params.newValue
          : null,
      valueFormatter: (
        params: ValueFormatterLiteParams<IOlympicData, string>,
      ) => (params.value == null ? "" : params.value),
      dataTypeMatcher: (value: any) =>
        typeof value === "string" && !!value.match("\\d{2}/\\d{2}/\\d{4}"),
      dateParser: (value: string | undefined) => {
        if (value == null || value === "") {
          return undefined;
        }
        const dateParts = value.split("/");
        return dateParts.length === 3
          ? new Date(
              parseInt(dateParts[2]),
              parseInt(dateParts[1]) - 1,
              parseInt(dateParts[0]),
            )
          : undefined;
      },
      dateFormatter: (value: Date | undefined) => {
        if (value == null) {
          return undefined;
        }
        const date = String(value.getDate());
        const month = String(value.getMonth() + 1);
        return `${date.length === 1 ? "0" + date : date}/${month.length === 1 ? "0" + month : month}/${value.getFullYear()}`;
      },
    },
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

import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IRichCellEditorParams,
  ModuleRegistry,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { RichSelectModule } from "ag-grid-enterprise";
import { colors } from "./colors";
ModuleRegistry.registerModules([
  TextEditorModule,
  ClientSideRowModelModule,
  RichSelectModule,
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
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      headerName: "Color (Column as String Type)",
      field: "color",
      width: 250,
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: {
        formatValue: (v) => v.name,
        parseValue: (v) => v.name,
        values: colors,
        searchType: "matchAny",
        allowTyping: true,
        filterList: true,
        valueListMaxHeight: 220,
      } as IRichCellEditorParams,
    },
    {
      headerName: "Color (Column as Complex Object)",
      field: "detailedColor",
      width: 290,
      valueFormatter: (p) => `${p.value.name} (${p.value.code})`,
      valueParser: (p) => p.newValue,
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: {
        formatValue: (v) => v.name,
        values: colors,
        searchType: "matchAny",
        allowTyping: true,
        filterList: true,
        valueListMaxHeight: 220,
      } as IRichCellEditorParams,
    },
  ];
  defaultColDef: ColDef = {
    width: 200,
    editable: true,
  };
  rowData: any[] | null = colors.map((v) => ({
    color: v.name,
    detailedColor: v,
  }));
}

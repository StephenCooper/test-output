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
import { ColourCellRenderer } from "./colour-cell-renderer.component";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, ColourCellRenderer],
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
      headerName: "Allow Typing (Match)",
      field: "color",
      cellRenderer: ColourCellRenderer,
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: {
        values: colors,
        searchType: "match",
        allowTyping: true,
        filterList: true,
        highlightMatch: true,
        valueListMaxHeight: 220,
      } as IRichCellEditorParams,
    },
    {
      headerName: "Allow Typing (MatchAny)",
      field: "color",
      cellRenderer: ColourCellRenderer,
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: {
        values: colors,
        searchType: "matchAny",
        allowTyping: true,
        filterList: true,
        highlightMatch: true,
        valueListMaxHeight: 220,
      } as IRichCellEditorParams,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    editable: true,
  };
  rowData: any[] | null = data;
}

function getRandomNumber(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const data = Array.from(Array(20).keys()).map(() => {
  const color = colors[getRandomNumber(0, colors.length - 1)];
  return { color };
});

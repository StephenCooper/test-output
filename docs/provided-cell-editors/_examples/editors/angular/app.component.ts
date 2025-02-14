import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ILargeTextEditorParams,
  IRichCellEditorParams,
  ISelectCellEditorParams,
  ITextCellEditorParams,
  LargeTextEditorModule,
  ModuleRegistry,
  SelectEditorModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { RichSelectModule } from "ag-grid-enterprise";
import { colors } from "./colors";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RichSelectModule,
  SelectEditorModule,
  TextEditorModule,
  LargeTextEditorModule,
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
      headerName: "Text Editor",
      field: "color1",
      cellRenderer: ColourCellRenderer,
      cellEditor: "agTextCellEditor",
      cellEditorParams: {
        maxLength: 20,
      } as ITextCellEditorParams,
    },
    {
      headerName: "Select Editor",
      field: "color2",
      cellRenderer: ColourCellRenderer,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: colors,
      } as ISelectCellEditorParams,
    },
    {
      headerName: "Rich Select Editor",
      field: "color3",
      cellRenderer: ColourCellRenderer,
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: {
        values: colors,
        cellRenderer: ColourCellRenderer,
        filterList: true,
        searchType: "match",
        allowTyping: true,
        valueListMaxHeight: 220,
      } as IRichCellEditorParams,
    },
    {
      headerName: "Large Text Editor",
      field: "description",
      cellEditorPopup: true,
      cellEditor: "agLargeTextCellEditor",
      cellEditorParams: {
        maxLength: 250,
        rows: 10,
        cols: 50,
      } as ILargeTextEditorParams,
      flex: 2,
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
  return {
    color1: color,
    color2: color,
    color3: color,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  };
});

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
  SelectEditorModule,
  TextEditorModule,
  ValidationModule,
  ValueFormatterParams,
  ValueSetterParams,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RichSelectModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RichSelectModule,
  SetFilterModule,
  SelectEditorModule,
  TextEditorModule,
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
    (cellValueChanged)="onCellValueChanged($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      field: "make",
      minWidth: 100,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: carCodes,
      },
      filter: "agSetColumnFilter",
      refData: carMappings,
    },
    {
      field: "exteriorColour",
      minWidth: 150,
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: {
        values: colourCodes,
        cellRenderer: ColourCellRenderer,
      },
      filter: "agSetColumnFilter",
      filterParams: {
        cellRenderer: ColourCellRenderer,
      },
      refData: colourMappings,
      cellRenderer: ColourCellRenderer,
    },
    {
      field: "interiorColour",
      minWidth: 150,
      filter: "agSetColumnFilter",
      filterParams: {
        cellRenderer: ColourCellRenderer,
      },
      refData: colourMappings,
      cellRenderer: ColourCellRenderer,
    },
    {
      headerName: "Retail Price",
      field: "price",
      minWidth: 120,
      colId: "retailPrice",
      valueGetter: (params) => {
        return params.data.price;
      },
      valueFormatter: currencyFormatter,
      valueSetter: numberValueSetter,
    },
    {
      headerName: "Retail Price (incl Taxes)",
      minWidth: 120,
      editable: false,
      valueGetter: (params) => {
        // example of chaining value getters
        return params.getValue("retailPrice") * 1.2;
      },
      valueFormatter: currencyFormatter,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    editable: true,
  };
  rowData: any[] | null = getData();

  onCellValueChanged(params: CellValueChangedEvent) {
    // notice that the data always contains the keys rather than values after editing
    console.log("onCellValueChanged Data: ", params.data);
  }
}

const carMappings = {
  tyt: "Toyota",
  frd: "Ford",
  prs: "Porsche",
  nss: "Nissan",
};
const colourMappings = {
  cb: "Cadet Blue",
  bw: "Burlywood",
  fg: "Forest Green",
};
function extractKeys(mappings: Record<string, string>) {
  return Object.keys(mappings);
}
const carCodes = extractKeys(carMappings);
const colourCodes = extractKeys(colourMappings);
function currencyFormatter(params: ValueFormatterParams) {
  const value = Math.floor(params.value);
  if (isNaN(value)) {
    return "";
  }
  return "£" + value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
function numberValueSetter(params: ValueSetterParams) {
  const valueAsNumber = parseFloat(params.newValue);
  if (isNaN(valueAsNumber) || !isFinite(params.newValue)) {
    return false; // don't set invalid numbers!
  }
  params.data.price = valueAsNumber;
  return true;
}

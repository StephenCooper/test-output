import {
  CellSelectionOptions,
  CheckboxEditorModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DataTypeDefinition,
  DateEditorModule,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  CheckboxEditorModule,
  DateEditorModule,
  ClientSideRowModelModule,
  ClipboardModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  RowGroupingModule,
  SetFilterModule,
  RowGroupingPanelModule,
  ValidationModule /* Development Only */,
]);

interface IOlympicDataTypes extends IOlympicData {
  dateObject: Date;
  hasGold: boolean;
  hasSilver: boolean;
  countryObject: {
    name: string;
  };
}

let gridApi: GridApi<IOlympicDataTypes>;

const gridOptions: GridOptions<IOlympicDataTypes> = {
  columnDefs: [
    { field: "athlete" },
    { field: "age", minWidth: 100 },
    { field: "hasGold", minWidth: 100, headerName: "Gold" },
    {
      field: "hasSilver",
      minWidth: 100,
      headerName: "Silver",
      cellRendererParams: { disabled: true },
    },
    { field: "dateObject", headerName: "Date" },
    { field: "date", headerName: "Date (String)" },
    { field: "countryObject", headerName: "Country" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 180,
    filter: true,
    floatingFilter: true,
    editable: true,
    enableRowGroup: true,
  },
  dataTypeDefinitions: {
    object: {
      baseDataType: "object",
      extendsDataType: "object",
      valueParser: (params) => ({ name: params.newValue }),
      valueFormatter: (params) =>
        params.value == null ? "" : params.value.name,
    },
  },
  rowGroupPanelShow: "always",
  cellSelection: {
    handle: { mode: "fill" },
  },
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicDataTypes[]) =>
    gridApi!.setGridOption(
      "rowData",
      data.map((rowData) => {
        const dateParts = rowData.date.split("/");
        return {
          ...rowData,
          date: `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`,
          dateObject: new Date(
            parseInt(dateParts[2]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[0]),
          ),
          countryObject: {
            name: rowData.country,
          },
          hasGold: rowData.gold > 0,
          hasSilver: rowData.silver > 0,
        };
      }),
    ),
  );

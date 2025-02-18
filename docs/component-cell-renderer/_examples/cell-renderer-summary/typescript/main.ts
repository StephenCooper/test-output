import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { CompanyLogoRenderer } from "./companyLogoRenderer";
import { CompanyRenderer } from "./companyRenderer";
import { CustomButtonComponent } from "./customButtonComponent";
import { MissionResultRenderer } from "./missionResultRenderer";
import { PriceRenderer } from "./priceRenderer";

ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

// Grid API: Access to Grid API methods
let gridApi: GridApi;

// Row Data Interface
interface IRow {
  company: string;
  website: string;
  revenue: number;
  hardware: boolean;
}

const gridOptions: GridOptions<IRow> = {
  defaultColDef: {
    flex: 10,
  },
  // Data to be displayed
  rowData: [],
  // Columns to be displayed (Should match rowData properties)
  columnDefs: [
    {
      field: "company",
      flex: 6,
    },
    {
      field: "website",
      cellRenderer: CompanyRenderer,
    },
    {
      headerName: "Logo",
      field: "company",
      cellRenderer: CompanyLogoRenderer,
      cellClass: "logoCell",
      minWidth: 100,
    },
    {
      field: "revenue",
      cellRenderer: PriceRenderer,
    },
    {
      field: "hardware",
      cellRenderer: MissionResultRenderer,
    },
    {
      colId: "actions",
      headerName: "Actions",
      cellRenderer: CustomButtonComponent,
    },
  ],
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/small-company-data.json")
  .then((response) => response.json())
  .then((data) => {
    gridApi!.setGridOption("rowData", data);
  });

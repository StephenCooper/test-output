import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ISetFilterParams,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);
import { CountryCellRenderer } from "./country-cell-renderer.component";
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, CountryCellRenderer],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 5px">
      <button (click)="printFilterModel()">Print Filter Model</button>
    </div>

    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [context]="context"
      [defaultColDef]="defaultColDef"
      [sideBar]="sideBar"
      [rowData]="rowData"
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    {
      headerName: "No Cell Renderer",
      field: "country",
      cellRenderer: CountryCellRenderer,
      filter: "agSetColumnFilter",
      filterParams: {
        // no cell renderer!
      },
    },
    {
      headerName: "With Cell Renderers",
      field: "country",
      cellRenderer: CountryCellRenderer,
      filter: "agSetColumnFilter",
      filterParams: {
        cellRenderer: CountryCellRenderer,
        cellRendererParams: { isFilterRenderer: true },
      } as ISetFilterParams,
    },
  ];
  context: any = {
    COUNTRY_CODES: COUNTRY_CODES,
  };
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 225,
    floatingFilter: true,
  };
  sideBar: SideBarDef | string | string[] | boolean | null = "filters";
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.getToolPanelInstance("filters")!.expandFilters();
  }

  printFilterModel() {
    const filterModel = this.gridApi.getFilterModel();
    console.log(filterModel);
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        // only return data that has corresponding country codes
        const dataWithFlags = data.filter(function (d: any) {
          return COUNTRY_CODES[d.country];
        });
        // Empty data used to demonstrate custom (Blanks) handling in filter cell renderer
        dataWithFlags[0].country = "";
        this.rowData = dataWithFlags;
      });
  }
}

const COUNTRY_CODES: Record<string, string> = {
  Ireland: "ie",
  Luxembourg: "lu",
  Belgium: "be",
  Spain: "es",
  France: "fr",
  Germany: "de",
  Sweden: "se",
  Italy: "it",
  Greece: "gr",
  Iceland: "is",
  Portugal: "pt",
  Malta: "mt",
  Norway: "no",
  Brazil: "br",
  Argentina: "ar",
  Colombia: "co",
  Peru: "pe",
  Venezuela: "ve",
  Uruguay: "uy",
};

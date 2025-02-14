import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { CompanyLogoRenderer } from "./companyLogoRenderer.component";
import { CompanyRenderer } from "./companyRenderer.component";
import { CustomButtonComponent } from "./customButtonComponent.component";
import { MissionResultRenderer } from "./missionResultRenderer.component";
import { PriceRenderer } from "./priceRenderer.component";

interface IRow {
  company: string;
  location: string;
  price: number;
  successful: boolean;
}

@Component({
  selector: "my-app",
  standalone: true,
  imports: [
    AgGridAngular,
    CompanyLogoRenderer,
    CompanyRenderer,
    CustomButtonComponent,
    MissionResultRenderer,
    PriceRenderer,
  ],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [defaultColDef]="defaultColDef"
    [rowData]="rowData"
    [columnDefs]="columnDefs"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  defaultColDef: ColDef = {
    flex: 10,
  };
  rowData: any[] | null = [] as IRow[];
  columnDefs: ColDef[] = [
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
      headerName: "Hardware",
      cellRenderer: MissionResultRenderer,
    },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: CustomButtonComponent,
    },
  ] as ColDef[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent) {
    this.http
      .get<
        any[]
      >("https://www.ag-grid.com/example-assets/small-company-data.json")
      .subscribe((data) => {
        this.rowData = data;
      });
  }
}

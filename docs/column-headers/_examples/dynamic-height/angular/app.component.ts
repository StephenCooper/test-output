import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { PivotModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextFilterModule,
  ClientSideRowModelModule,
  PivotModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div class="button-bar example-header">
      <table>
        <tbody>
          <tr>
            <td class="labels">pivot<br />(<span id="pivot">off</span>)</td>
            <td class="buttons-container">
              <button (click)="setPivotOn()">on</button>
              <button (click)="setPivotOff()">off</button>
            </td>
          </tr>
          <tr>
            <td class="labels">
              groupHeaderHeight<br />(<span id="groupHeaderHeight"
                >undefined</span
              >)
            </td>
            <td class="buttons-container">
              <button (click)="setGroupHeaderHeight(40)">40px</button>
              <button (click)="setGroupHeaderHeight(60)">60px</button>
              <button (click)="setGroupHeaderHeight(undefined)">
                undefined
              </button>
            </td>
            <td class="labels">
              headerHeight<br />(<span id="headerHeight">undefined</span>)
            </td>
            <td class="buttons-container">
              <button (click)="setHeaderHeight(70)">70px</button>
              <button (click)="setHeaderHeight(80)">80px</button>
              <button (click)="setHeaderHeight(undefined)">undefined</button>
            </td>
          </tr>
          <tr id="requiresPivot" class="hidden">
            <td class="labels">
              pivotGroupHeaderHeight<br />(<span id="pivotGroupHeaderHeight"
                >undefined</span
              >)
            </td>
            <td class="buttons-container">
              <button (click)="setPivotGroupHeaderHeight(50)">50px</button>
              <button (click)="setPivotGroupHeaderHeight(70)">70px</button>
              <button (click)="setPivotGroupHeaderHeight(undefined)">
                undefined
              </button>
            </td>
            <td class="labels">
              pivotHeaderHeight<br />(<span id="pivotHeaderHeight"
                >undefined</span
              >)
            </td>
            <td class="buttons-container">
              <button (click)="setPivotHeaderHeight(60)">60px</button>
              <button (click)="setPivotHeaderHeight(80)">80px</button>
              <button (click)="setPivotHeaderHeight(undefined)">
                undefined
              </button>
            </td>
          </tr>
          <tr id="requiresNotPivot">
            <td class="labels">
              floatingFiltersHeight<br />(<span id="floatingFiltersHeight"
                >undefined</span
              >)
            </td>
            <td class="buttons-container">
              <button (click)="setFloatingFiltersHeight(35)">35px</button>
              <button (click)="setFloatingFiltersHeight(55)">55px</button>
              <button (click)="setFloatingFiltersHeight(undefined)">
                undefined
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: "Athlete Details",
      children: [
        {
          field: "athlete",
          width: 150,
          suppressSizeToFit: true,
          enableRowGroup: true,
          rowGroupIndex: 0,
        },
        {
          field: "age",
          width: 90,
          minWidth: 75,
          maxWidth: 100,
          enableRowGroup: true,
        },
        {
          field: "country",
          enableRowGroup: true,
        },
        {
          field: "year",
          width: 90,
          enableRowGroup: true,
          pivotIndex: 0,
        },
        { field: "sport", width: 110, enableRowGroup: true },
        {
          field: "gold",
          enableValue: true,
          suppressHeaderMenuButton: true,
          filter: "agNumberColumnFilter",
          aggFunc: "sum",
        },
        {
          field: "silver",
          enableValue: true,
          suppressHeaderMenuButton: true,
          filter: "agNumberColumnFilter",
          aggFunc: "sum",
        },
        {
          field: "bronze",
          enableValue: true,
          suppressHeaderMenuButton: true,
          filter: "agNumberColumnFilter",
          aggFunc: "sum",
        },
        {
          field: "total",
          enableValue: true,
          suppressHeaderMenuButton: true,
          filter: "agNumberColumnFilter",
          aggFunc: "sum",
        },
      ],
    },
  ];
  defaultColDef: ColDef = {
    floatingFilter: true,
    width: 120,
  };
  autoGroupColumnDef: ColDef = {
    width: 200,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  setPivotOn() {
    document.querySelector("#requiresPivot")!.className = "";
    document.querySelector("#requiresNotPivot")!.className = "hidden";
    this.gridApi.setGridOption("pivotMode", true);
    setIdText("pivot", "on");
  }

  setPivotOff() {
    document.querySelector("#requiresPivot")!.className = "hidden";
    document.querySelector("#requiresNotPivot")!.className = "";
    this.gridApi.setGridOption("pivotMode", false);
    setIdText("pivot", "off");
  }

  setHeaderHeight(value?: number) {
    this.gridApi.setGridOption("headerHeight", value);
    setIdText("headerHeight", value);
  }

  setGroupHeaderHeight(value?: number) {
    this.gridApi.setGridOption("groupHeaderHeight", value);
    setIdText("groupHeaderHeight", value);
  }

  setFloatingFiltersHeight(value?: number) {
    this.gridApi.setGridOption("floatingFiltersHeight", value);
    setIdText("floatingFiltersHeight", value);
  }

  setPivotGroupHeaderHeight(value?: number) {
    this.gridApi.setGridOption("pivotGroupHeaderHeight", value);
    setIdText("pivotGroupHeaderHeight", value);
  }

  setPivotHeaderHeight(value?: number) {
    this.gridApi.setGridOption("pivotHeaderHeight", value);
    setIdText("pivotHeaderHeight", value);
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}

function setIdText(id: string, value: string | number | undefined) {
  document.getElementById(id)!.textContent =
    value == undefined ? "undefined" : value + "";
}

import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DomLayoutType,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  PinnedRowModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextFilterModule,
  PinnedRowModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="test-header">
      <div>
        <button (click)="updateRowData(0)">0 Rows</button>
        <button (click)="updateRowData(5)">5 Rows</button>
        <button (click)="updateRowData(50)">50 Rows</button>
      </div>
      <div>
        <button (click)="setAutoHeight()">Auto Height</button>
        <button (click)="setFixedHeight()">Fixed Height</button>
      </div>
      <div>
        <input
          name="pinned-rows"
          type="checkbox"
          id="floating-rows"
          (click)="cbFloatingRows()"
        />
        <label for="pinned-rows"> Pinned Rows </label>
      </div>
      <div>Row Count = <span id="currentRowCount"></span></div>
    </div>

    <ag-grid-angular
      id="myGrid"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      [domLayout]="domLayout"
      [popupParent]="popupParent"
      (gridReady)="onGridReady($event)"
    />

    <div style="border: 10px solid #eee; padding: 10px; margin-top: 20px">
      <p style="text-align: center">
        This text is under the grid and should move up and down as the height of
        the grid changes.
      </p>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: "Core",
      children: [
        { headerName: "ID", field: "id" },
        { field: "make" },
        { field: "price", filter: "agNumberColumnFilter" },
      ],
    },
    {
      headerName: "Extra",
      children: [
        { field: "val1", filter: "agNumberColumnFilter" },
        { field: "val2", filter: "agNumberColumnFilter" },
        { field: "val3", filter: "agNumberColumnFilter" },
        { field: "val4", filter: "agNumberColumnFilter" },
        { field: "val5", filter: "agNumberColumnFilter" },
        { field: "val6", filter: "agNumberColumnFilter" },
        { field: "val7", filter: "agNumberColumnFilter" },
        { field: "val8", filter: "agNumberColumnFilter" },
        { field: "val9", filter: "agNumberColumnFilter" },
        { field: "val10", filter: "agNumberColumnFilter" },
      ],
    },
  ];
  defaultColDef: ColDef = {
    enableRowGroup: true,
    enableValue: true,
    filter: true,
  };
  rowData: any[] | null = getData(5);
  domLayout: DomLayoutType = "autoHeight";
  popupParent: HTMLElement | null = document.body;

  updateRowData(rowCount: number) {
    this.gridApi.setGridOption("rowData", getData(rowCount));
    document.querySelector("#currentRowCount")!.textContent = `${rowCount}`;
  }

  cbFloatingRows() {
    const show = (document.getElementById("floating-rows") as HTMLInputElement)
      .checked;
    if (show) {
      this.gridApi.setGridOption("pinnedTopRowData", [
        createRow(999),
        createRow(998),
      ]);
      this.gridApi.setGridOption("pinnedBottomRowData", [
        createRow(997),
        createRow(996),
      ]);
    } else {
      this.gridApi.setGridOption("pinnedTopRowData", undefined);
      this.gridApi.setGridOption("pinnedBottomRowData", undefined);
    }
  }

  setAutoHeight() {
    this.gridApi.setGridOption("domLayout", "autoHeight");
    // auto height will get the grid to fill the height of the contents,
    // so the grid div should have no height set, the height is dynamic.
    (document.querySelector<HTMLElement>("#myGrid")! as any).style.height = "";
  }

  setFixedHeight() {
    // we could also call setDomLayout() here as normal is the default
    this.gridApi.setGridOption("domLayout", "normal");
    // when auto height is off, the grid ahs a fixed height, and then the grid
    // will provide scrollbars if the data does not fit into it.
    (document.querySelector<HTMLElement>("#myGrid")! as any)!.style.height =
      "400px";
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    document.querySelector("#currentRowCount")!.textContent = "5";
  }
}

function createRow(index: number) {
  const makes = ["Toyota", "Ford", "BMW", "Phantom", "Porsche"];
  return {
    id: "D" + (1000 + index),
    make: makes[Math.floor(Math.random() * makes.length)],
    price: Math.floor(Math.random() * 100000),
    val1: Math.floor(Math.random() * 1000),
    val2: Math.floor(Math.random() * 1000),
    val3: Math.floor(Math.random() * 1000),
    val4: Math.floor(Math.random() * 1000),
    val5: Math.floor(Math.random() * 1000),
    val6: Math.floor(Math.random() * 1000),
    val7: Math.floor(Math.random() * 1000),
    val8: Math.floor(Math.random() * 1000),
    val9: Math.floor(Math.random() * 1000),
    val10: Math.floor(Math.random() * 1000),
  };
}
function getData(count: number) {
  const rowData = [];
  for (let i = 0; i < count; i++) {
    rowData.push(createRow(i));
  }
  return rowData;
}

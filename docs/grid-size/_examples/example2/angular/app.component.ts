import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnAutoSizeModule,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  GridSizeChangedEvent,
  ModuleRegistry,
  RenderApiModule,
  RowApiModule,
  RowHeightParams,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
  ValidationModule,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  RenderApiModule,
  RowApiModule,
  ColumnAutoSizeModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [rowData]="rowData"
    [autoSizeStrategy]="autoSizeStrategy"
    [getRowHeight]="getRowHeight"
    (firstDataRendered)="onFirstDataRendered($event)"
    (gridSizeChanged)="onGridSizeChanged($event)"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "athlete", minWidth: 150 },
    { field: "age", minWidth: 70, maxWidth: 90 },
    { field: "country", minWidth: 130 },
    { field: "year", minWidth: 70, maxWidth: 90 },
    { field: "date", minWidth: 120 },
    { field: "sport", minWidth: 120 },
    { field: "gold", minWidth: 80 },
    { field: "silver", minWidth: 80 },
    { field: "bronze", minWidth: 80 },
    { field: "total", minWidth: 80 },
  ];
  rowData: any[] | null = getData();
  autoSizeStrategy:
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy = {
    type: "fitGridWidth",
  };
  getRowHeight: (params: RowHeightParams) => number | undefined | null = (
    params: RowHeightParams,
  ) => {
    return currentRowHeight;
  };

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    updateRowHeight(params);
  }

  onGridSizeChanged(params: GridSizeChangedEvent) {
    updateRowHeight(params);
  }

  onGridReady(params: GridReadyEvent) {
    minRowHeight = params.api.getSizesForCurrentTheme().rowHeight;
    currentRowHeight = minRowHeight;
  }
}

let minRowHeight = 25;
let currentRowHeight: number;
const updateRowHeight = (params: { api: GridApi }) => {
  // get the height of the grid body - this excludes the height of the headers
  const bodyViewport = document.querySelector(".ag-body-viewport");
  if (!bodyViewport) {
    return;
  }
  const gridHeight = bodyViewport.clientHeight;
  // get the rendered rows
  const renderedRowCount = params.api.getDisplayedRowCount();
  // if the rendered rows * min height is greater than available height, just just set the height
  // to the min and let the scrollbar do its thing
  if (renderedRowCount * minRowHeight >= gridHeight) {
    if (currentRowHeight !== minRowHeight) {
      currentRowHeight = minRowHeight;
      params.api.resetRowHeights();
    }
  } else {
    // set the height of the row to the grid height / number of rows available
    currentRowHeight = Math.floor(gridHeight / renderedRowCount);
    params.api.resetRowHeights();
  }
};

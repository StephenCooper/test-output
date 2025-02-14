import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IViewportDatasource,
  IViewportDatasourceParams,
  ModuleRegistry,
  RowModelType,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { ViewportRowModelModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ViewportRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [rowHeight]="rowHeight"
    [rowModelType]="rowModelType"
    [viewportDatasource]="viewportDatasource"
    [rowData]="rowData"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      headerName: "ID",
      field: "id",
    },
    {
      headerName: "Expected Position",
      valueGetter: '"translateY(" + node.rowIndex * 100 + "px)"',
    },
    {
      field: "a",
    },
    {
      field: "b",
    },
    {
      field: "c",
    },
  ];
  rowHeight = 100;
  rowModelType: RowModelType = "viewport";
  viewportDatasource: IViewportDatasource = createViewportDatasource();
  rowData!: any[];
}

function createViewportDatasource(): IViewportDatasource {
  let initParams: IViewportDatasourceParams;
  return {
    init: (params: IViewportDatasourceParams) => {
      initParams = params;
      const oneMillion = 1000 * 1000;
      params.setRowCount(oneMillion);
    },
    setViewportRange(firstRow: number, lastRow: number) {
      const rowData: any = {};
      for (let rowIndex = firstRow; rowIndex <= lastRow; rowIndex++) {
        const item: any = {};
        item.id = rowIndex;
        item.a = "A-" + rowIndex;
        item.b = "B-" + rowIndex;
        item.c = "C-" + rowIndex;
        rowData[rowIndex] = item;
      }
      initParams.setRowData(rowData);
    },
    destroy: () => {},
  };
}

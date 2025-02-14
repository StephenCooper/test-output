import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowSelectedEvent,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowSelectionModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

interface ICar {
  make: string;
  model: string;
  price: number;
}
interface IDiscountRate {
  discount: number;
}

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="test-container">
    <div class="test-header">
      <button (click)="onShowSelection()">Log Selected Cars</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      class="test-grid"
      [columnDefs]="columnDefs"
      [rowData]="rowData"
      [rowSelection]="rowSelection"
      [context]="context"
      [getRowId]="getRowId"
      (rowSelected)="onRowSelected($event)"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<ICar>;

  columnDefs: ColDef[] = [
    { headerName: "Make", field: "make" },
    { headerName: "Model", field: "model" },
    {
      headerName: "Price",
      field: "price",
      valueFormatter: (params: ValueFormatterParams<ICar, number>) => {
        // params.value: number
        return "£" + params.value;
      },
    },
  ];
  rowData: ICar[] | null = [
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 },
  ];
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
  };
  context: any = {
    discount: 0.9,
  } as IDiscountRate;
  getRowId: GetRowIdFunc = (params: GetRowIdParams<ICar>) => {
    // params.data : ICar
    return params.data.make + params.data.model;
  };

  onRowSelected(event: RowSelectedEvent<ICar, IDiscountRate>) {
    // event.data: ICar | undefined
    if (event.data && event.node.isSelected()) {
      const price = event.data.price;
      // event.context: IContext
      const discountRate = event.context.discount;
      console.log("Price with 10% discount:", price * discountRate);
    }
  }

  onShowSelection() {
    // api.getSelectedRows() : ICar[]
    const cars: ICar[] = this.gridApi.getSelectedRows();
    console.log(
      "Selected cars are",
      cars.map((c) => `${c.make} ${c.model}`),
    );
  }

  onGridReady(params: GridReadyEvent<ICar>) {
    this.gridApi = params.api;
  }
}

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
  PinnedRowModule,
  RowClassParams,
  RowStyle,
  RowStyleModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  PinnedRowModule,
  RowStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { CustomPinnedRowRenderer } from "./custom-pinned-row-renderer.component";
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, CustomPinnedRowRenderer],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [getRowStyle]="getRowStyle"
    [pinnedTopRowData]="pinnedTopRowData"
    [pinnedBottomRowData]="pinnedBottomRowData"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      field: "athlete",
      cellRendererSelector: (params) => {
        if (params.node.rowPinned) {
          return {
            component: CustomPinnedRowRenderer,
            params: {
              style: { color: "#5577CC" },
            },
          };
        } else {
          // rows that are not pinned don't use any cell renderer
          return undefined;
        }
      },
    },
    {
      field: "country",
      cellRendererSelector: (params) => {
        if (params.node.rowPinned) {
          return {
            component: CustomPinnedRowRenderer,
            params: {
              style: { fontStyle: "italic" },
            },
          };
        } else {
          // rows that are not pinned don't use any cell renderer
          return undefined;
        }
      },
    },
    { field: "sport" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
  };
  getRowStyle: (params: RowClassParams) => RowStyle | undefined = (
    params: RowClassParams,
  ): RowStyle | undefined => {
    if (params.node.rowPinned) {
      return { fontWeight: "bold" };
    }
  };
  pinnedTopRowData: any[] = [
    {
      athlete: "TOP 1 (athlete)",
      country: "TOP 1 (country)",
      sport: "TOP 1 (sport)",
    },
    {
      athlete: "TOP 2 (athlete)",
      country: "TOP 2 (country)",
      sport: "TOP 2 (sport)",
    },
  ];
  pinnedBottomRowData: any[] = [
    {
      athlete: "BOTTOM 1 (athlete)",
      country: "BOTTOM 1 (country)",
      sport: "BOTTOM 1 (sport)",
    },
    {
      athlete: "BOTTOM 2 (athlete)",
      country: "BOTTOM 2 (country)",
      sport: "BOTTOM 2 (sport)",
    },
  ];
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}

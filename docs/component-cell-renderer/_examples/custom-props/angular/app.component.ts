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
  RowApiModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { CustomButtonComponent } from "./customButtonComponent.component";
import { MissionResultRenderer } from "./missionResultRenderer.component";

interface IRow {
  company: string;
  location: string;
  price: number;
  successful: boolean;
}

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, CustomButtonComponent, MissionResultRenderer],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 5px">
      <button (click)="refreshData()">Refresh Data</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [rowData]="rowData"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  rowData: any[] | null = [] as IRow[];
  columnDefs: ColDef[] = [
    {
      field: "company",
    },
    {
      field: "successful",
      headerName: "Success",
      cellRenderer: MissionResultRenderer,
    },
    {
      field: "successful",
      headerName: "Success",
      cellRenderer: MissionResultRenderer,
      cellRendererParams: {
        src: successIconSrc,
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: CustomButtonComponent,
      cellRendererParams: {
        onClick: onClick,
      },
    },
  ] as ColDef[];
  defaultColDef: ColDef = {
    flex: 1,
  };

  constructor(private http: HttpClient) {}

  refreshData() {
    this.gridApi.forEachNode((rowNode) => {
      rowNode.setDataValue("successful", Math.random() > 0.5);
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    this.http
      .get<
        any[]
      >("https://www.ag-grid.com/example-assets/small-space-mission-data.json")
      .subscribe((data) => {
        this.rowData = data;
      });
  }
}

function successIconSrc(params: boolean) {
  if (params === true) {
    return "https://www.ag-grid.com/example-assets/icons/tick-in-circle.png";
  } else {
    return "https://www.ag-grid.com/example-assets/icons/cross-in-circle.png";
  }
}
const onClick = () => alert("Mission Launched");

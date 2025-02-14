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
  ICombinedSimpleModel,
  IDateFilterParams,
  ModuleRegistry,
  NumberFilterModule,
  SideBarDef,
  TextFilterModel,
  TextFilterModule,
  ValidationModule,
  createGrid,
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
  TextFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div>
      <div class="button-group">
        <button (click)="saveFilterModel()">Save Filter Model</button>
        <button (click)="restoreFilterModel()">
          Restore Saved Filter Model
        </button>
        <button
          (click)="restoreFromHardCoded()"
          title="Name = 'Mich%', Country = ['Ireland', 'United States'], Age < 30, Date < 01/01/2010"
        >
          Set Custom Filter Model
        </button>
        <button (click)="clearFilter()">Reset Filter</button>
      </div>
    </div>
    <div>
      <div class="button-group">
        Saved Filters: <span id="savedFilters">(none)</span>
      </div>
    </div>

    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [sideBar]="sideBar"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "athlete", filter: "agTextColumnFilter" },
    { field: "age", filter: "agNumberColumnFilter", maxWidth: 100 },
    { field: "country", filter: "agTextColumnFilter" },
    { field: "year", filter: "agNumberColumnFilter", maxWidth: 100 },
    { field: "sport", filter: "agTextColumnFilter" },
    { field: "gold", filter: "agNumberColumnFilter" },
    { field: "silver", filter: "agNumberColumnFilter" },
    { field: "bronze", filter: "agNumberColumnFilter" },
    { field: "total", filter: "agNumberColumnFilter" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    filter: true,
  };
  sideBar: SideBarDef | string | string[] | boolean | null = "filters";
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  clearFilter() {
    this.gridApi.setColumnFilterModel("athlete", null).then(() => {
      this.gridApi.onFilterChanged();
    });
  }

  saveFilterModel() {
    savedFilterModel = this.gridApi.getColumnFilterModel("athlete");
    const convertTextFilterModel = (model: TextFilterModel) => {
      return `${(model as TextFilterModel).type} ${(model as TextFilterModel).filter}`;
    };
    const convertCombinedFilterModel = (
      model: ICombinedSimpleModel<TextFilterModel>,
    ) => {
      return model
        .conditions!.map((condition) => convertTextFilterModel(condition))
        .join(` ${model.operator} `);
    };
    let savedFilterString: string;
    if (!savedFilterModel) {
      savedFilterString = "(none)";
    } else if (
      (savedFilterModel as ICombinedSimpleModel<TextFilterModel>).operator
    ) {
      savedFilterString = convertCombinedFilterModel(
        savedFilterModel as ICombinedSimpleModel<TextFilterModel>,
      );
    } else {
      savedFilterString = convertTextFilterModel(
        savedFilterModel as TextFilterModel,
      );
    }
    (document.querySelector("#savedFilters") as any).innerText =
      savedFilterString;
  }

  restoreFilterModel() {
    this.gridApi.setColumnFilterModel("athlete", savedFilterModel).then(() => {
      this.gridApi.onFilterChanged();
    });
  }

  restoreFromHardCoded() {
    const hardcodedFilter = { type: "startsWith", filter: "Mich" };
    this.gridApi.setColumnFilterModel("athlete", hardcodedFilter).then(() => {
      this.gridApi.onFilterChanged();
    });
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    params.api.getToolPanelInstance("filters")!.expandFilters(["athlete"]);

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}

const filterParams: IDateFilterParams = {
  comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
    const dateAsString = cellValue;
    if (dateAsString == null) return -1;
    const dateParts = dateAsString.split("/");
    const cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0]),
    );
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
    return 0;
  },
};
let savedFilterModel:
  | TextFilterModel
  | ICombinedSimpleModel<TextFilterModel>
  | null = null;

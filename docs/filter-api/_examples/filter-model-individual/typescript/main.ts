import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
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
import { IOlympicData } from "./interfaces";

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

const columnDefs: ColDef[] = [
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

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 150,
    filter: true,
  },
  sideBar: "filters",
  onGridReady: (params) => {
    params.api.getToolPanelInstance("filters")!.expandFilters(["athlete"]);
  },
};

let savedFilterModel:
  | TextFilterModel
  | ICombinedSimpleModel<TextFilterModel>
  | null = null;

function clearFilter() {
  gridApi!.setColumnFilterModel("athlete", null).then(() => {
    gridApi!.onFilterChanged();
  });
}

function saveFilterModel() {
  savedFilterModel = gridApi!.getColumnFilterModel("athlete");

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

function restoreFilterModel() {
  gridApi!.setColumnFilterModel("athlete", savedFilterModel).then(() => {
    gridApi!.onFilterChanged();
  });
}

function restoreFromHardCoded() {
  const hardcodedFilter = { type: "startsWith", filter: "Mich" };
  gridApi!.setColumnFilterModel("athlete", hardcodedFilter).then(() => {
    gridApi!.onFilterChanged();
  });
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).clearFilter = clearFilter;
  (<any>window).saveFilterModel = saveFilterModel;
  (<any>window).restoreFilterModel = restoreFilterModel;
  (<any>window).restoreFromHardCoded = restoreFromHardCoded;
}

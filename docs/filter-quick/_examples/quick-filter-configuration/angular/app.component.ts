import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  ModuleRegistry,
  NumberEditorModule,
  QuickFilterModule,
  RowApiModule,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  RowApiModule,
  QuickFilterModule,
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div class="example-header">
      <input
        type="text"
        id="filter-text-box"
        placeholder="Filter..."
        (input)="onFilterTextBoxChanged()"
      />
      <button style="margin-left: 20px" (click)="onPrintQuickFilterTexts()">
        Print Quick Filter Cache Texts
      </button>
      <button
        id="includeHiddenColumns"
        style="margin-left: 20px"
        (click)="onIncludeHiddenColumnsToggled()"
      >
        Include Hidden Columns
      </button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      [cacheQuickFilter]="true"
      [quickFilterParser]="quickFilterParser"
      [quickFilterMatcher]="quickFilterMatcher"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    // simple column, easy to understand
    { field: "name" },
    // the grid works with embedded fields
    { headerName: "Age", field: "person.age" },
    // or use value getter, all works with quick filter
    { headerName: "Country", valueGetter: "data.person.country" },
    // or use the object value, so value passed around is an object
    {
      headerName: "Results",
      field: "medals",
      cellRenderer: MedalRenderer,
      // this is needed to avoid toString=[object,object] result with objects
      getQuickFilterText: (params) => {
        return getMedalString(params.value);
      },
      cellDataType: false,
    },
    {
      headerName: "Hidden",
      field: "hidden",
      hide: true,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    editable: true,
  };
  rowData: any[] | null = getData();

  onIncludeHiddenColumnsToggled() {
    includeHiddenColumns = !includeHiddenColumns;
    this.gridApi.setGridOption(
      "includeHiddenColumnsInQuickFilter",
      includeHiddenColumns,
    );
    document.querySelector("#includeHiddenColumns")!.textContent =
      `${includeHiddenColumns ? "Exclude" : "Include"} Hidden Columns`;
  }

  onFilterTextBoxChanged() {
    this.gridApi.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value,
    );
  }

  onPrintQuickFilterTexts() {
    this.gridApi.forEachNode(function (rowNode, index) {
      console.log(
        "Row " +
          index +
          " quick filter text is " +
          rowNode.quickFilterAggregateText,
      );
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  quickFilterParser = (quickFilter: string) => {
    const quickFilterParts = [];
    let lastSpaceIndex = -1;
    const isQuote = (index: number) => quickFilter[index] === '"';
    const getQuickFilterPart = (
      lastSpaceIndex: number,
      currentIndex: number,
    ) => {
      const startsWithQuote = isQuote(lastSpaceIndex + 1);
      const endsWithQuote = isQuote(currentIndex - 1);
      const startIndex =
        startsWithQuote && endsWithQuote
          ? lastSpaceIndex + 2
          : lastSpaceIndex + 1;
      const endIndex =
        startsWithQuote && endsWithQuote ? currentIndex - 1 : currentIndex;
      return quickFilter.slice(startIndex, endIndex);
    };
    for (let i = 0; i < quickFilter.length; i++) {
      const char = quickFilter[i];
      if (char === " ") {
        if (!isQuote(lastSpaceIndex + 1) || isQuote(i - 1)) {
          quickFilterParts.push(getQuickFilterPart(lastSpaceIndex, i));
          lastSpaceIndex = i;
        }
      }
    }
    if (lastSpaceIndex !== quickFilter.length - 1) {
      quickFilterParts.push(
        getQuickFilterPart(lastSpaceIndex, quickFilter.length),
      );
    }
    return quickFilterParts;
  };

  quickFilterMatcher = (
    quickFilterParts: string[],
    rowQuickFilterAggregateText: string,
  ) => {
    let result: boolean;
    try {
      result = quickFilterParts.every((part) =>
        rowQuickFilterAggregateText.match(part),
      );
    } catch {
      result = false;
    }
    return result;
  };
}

const getMedalString = function ({
  gold,
  silver,
  bronze,
}: {
  gold: number;
  silver: number;
  bronze: number;
}) {
  const goldStr = gold > 0 ? `Gold: ${gold} ` : "";
  const silverStr = silver > 0 ? `Silver: ${silver} ` : "";
  const bronzeStr = bronze > 0 ? `Bronze: ${bronze}` : "";
  return goldStr + silverStr + bronzeStr;
};
const MedalRenderer = function (params: ICellRendererParams) {
  return getMedalString(params.value);
};
let includeHiddenColumns = false;

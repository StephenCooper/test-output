import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  InfiniteRowModelModule,
  ModuleRegistry,
  RowModelType,
  SortModelItem,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextFilterModule,
  InfiniteRowModelModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="test-container">
    <div class="test-header">
      <button (click)="onBtShowYearColumn()">Show Year</button>
      <button (click)="onBtHideYearColumn()">Hide Year</button>
    </div>

    <ag-grid-angular
      style="width: 100%; height: 100%;"
      class="test-grid"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowModelType]="rowModelType"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "athlete", colId: "athlete", minWidth: 180 },
    { field: "age", colId: "age" },
    { field: "country", colId: "country", minWidth: 180 },
    { field: "year", colId: "year" },
    { field: "sport", colId: "sport", minWidth: 180 },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
  };
  rowModelType: RowModelType = "infinite";
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onBtShowYearColumn() {
    this.gridApi.setGridOption("columnDefs", [
      { field: "athlete", colId: "athlete" },
      { field: "age", colId: "age" },
      { field: "country", colId: "country" },
      { field: "year", colId: "year" },
      { field: "sport", colId: "sport" },
    ]);
  }

  onBtHideYearColumn() {
    this.gridApi.setGridOption("columnDefs", [
      { field: "athlete", colId: "athlete" },
      { field: "age", colId: "age" },
      { field: "country", colId: "country" },
      { field: "sport", colId: "sport" },
    ]);
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        // give each row an id
        data.forEach(function (d: any, index: number) {
          d.id = "R" + (index + 1);
        });
        const dataSource: IDatasource = {
          rowCount: undefined,
          getRows: (params) => {
            console.log(
              "asking for " + params.startRow + " to " + params.endRow,
            );
            // At this point in your code, you would call the server.
            // To make the demo look real, wait for 500ms before returning
            setTimeout(() => {
              // take a slice of the total rows
              const dataAfterSortingAndFiltering = sortAndFilter(
                data,
                params.sortModel,
                params.filterModel,
              );
              const rowsThisPage = dataAfterSortingAndFiltering.slice(
                params.startRow,
                params.endRow,
              );
              // if on or after the last page, work out the last row.
              let lastRow = -1;
              if (dataAfterSortingAndFiltering.length <= params.endRow) {
                lastRow = dataAfterSortingAndFiltering.length;
              }
              // call the success callback
              params.successCallback(rowsThisPage, lastRow);
            }, 500);
          },
        };
        params.api!.setGridOption("datasource", dataSource);
      });
  }
}

function sortAndFilter(
  allOfTheData: any[],
  sortModel: SortModelItem[],
  filterModel: any,
) {
  return sortData(sortModel, filterData(filterModel, allOfTheData));
}
function sortData(sortModel: SortModelItem[], data: any[]) {
  const sortPresent = sortModel && sortModel.length > 0;
  if (!sortPresent) {
    return data;
  }
  // do an in memory sort of the data, across all the fields
  const resultOfSort = data.slice();
  resultOfSort.sort(function (a, b) {
    for (let k = 0; k < sortModel.length; k++) {
      const sortColModel = sortModel[k];
      const valueA = a[sortColModel.colId];
      const valueB = b[sortColModel.colId];
      // this filter didn't find a difference, move onto the next one
      if (valueA == valueB) {
        continue;
      }
      const sortDirection = sortColModel.sort === "asc" ? 1 : -1;
      if (valueA > valueB) {
        return sortDirection;
      } else {
        return sortDirection * -1;
      }
    }
    // no filters found a difference
    return 0;
  });
  return resultOfSort;
}
function filterData(filterModel: any, data: any[]) {
  const filterPresent = filterModel && Object.keys(filterModel).length > 0;
  if (!filterPresent) {
    return data;
  }
  const resultOfFilter = [];
  for (let i = 0; i < data.length; i++) {
    var item = data[i];
    var filterFails = false;
    const filterKeys = Object.keys(filterModel);
    filterKeys.forEach((filterKey) => {
      const filterValue = filterModel[filterKey].filter;
      const valueForRow = item[filterKey];
      if (filterValue != valueForRow) {
        // year didn't match, so skip this record
        filterFails = true;
      }
    });
    // if (filterModel.year) {
    //     var val1 = filterModel.year.filter;
    //     var val2 = item.year;
    //     if (val1 != val2) {
    //         // year didn't match, so skip this record
    //         continue;
    //     }
    // }
    //
    if (!filterFails) {
      resultOfFilter.push(item);
    }
  }
  return resultOfFilter;
}

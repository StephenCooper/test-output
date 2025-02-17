"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./style.css";
import {
  InfiniteRowModelModule,
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextFilterModule,
  InfiniteRowModelModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

function sortAndFilter(allOfTheData, sortModel, filterModel) {
  return sortData(sortModel, filterData(filterModel, allOfTheData));
}

function sortData(sortModel, data) {
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

function filterData(filterModel, data) {
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

const GridExample = () => {
  const gridRef = useRef(null);
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", colId: "athlete", minWidth: 180 },
    { field: "age", colId: "age" },
    { field: "country", colId: "country", minWidth: 180 },
    { field: "year", colId: "year" },
    { field: "sport", colId: "sport", minWidth: 180 },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      filter: true,
    };
  }, []);

  const onBtShowYearColumn = useCallback(() => {
    gridRef.current.api.setGridOption("columnDefs", [
      { field: "athlete", colId: "athlete" },
      { field: "age", colId: "age" },
      { field: "country", colId: "country" },
      { field: "year", colId: "year" },
      { field: "sport", colId: "sport" },
    ]);
  }, []);

  const onBtHideYearColumn = useCallback(() => {
    gridRef.current.api.setGridOption("columnDefs", [
      { field: "athlete", colId: "athlete" },
      { field: "age", colId: "age" },
      { field: "country", colId: "country" },
      { field: "sport", colId: "sport" },
    ]);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          <button onClick={onBtShowYearColumn}>Show Year</button>
          <button onClick={onBtHideYearColumn}>Hide Year</button>
        </div>

        <div style={gridStyle} className="test-grid">
          <AgGridReact
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowModelType={"infinite"}
          />
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
window.tearDownExample = () => root.unmount();

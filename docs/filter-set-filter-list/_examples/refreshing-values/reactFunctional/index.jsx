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
import "./styles.css";
import { getData } from "./data.jsx";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
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
  ValidationModule /* Development Only */,
]);

const list1 = ["Elephant", "Lion", "Monkey"];

const list2 = ["Elephant", "Giraffe", "Tiger"];

const valuesArray = list1.slice();

let valuesCallbackList = list1;

const valuesCallback = (params) => {
  setTimeout(() => {
    params.success(valuesCallbackList);
  }, 1000);
};

const arrayFilterParams = {
  values: valuesArray,
};

const callbackFilterParams = {
  values: valuesCallback,
  refreshValuesOnOpen: true,
};

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(getData());
  const [columnDefs, setColumnDefs] = useState([
    {
      colId: "array",
      headerName: "Values Array",
      field: "animal",
      filter: "agSetColumnFilter",
      filterParams: arrayFilterParams,
    },
    {
      colId: "callback",
      headerName: "Values Callback",
      field: "animal",
      filter: "agSetColumnFilter",
      filterParams: callbackFilterParams,
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      filter: true,
    };
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    params.api.getToolPanelInstance("filters").expandFilters();
  }, []);

  const useList1 = useCallback(() => {
    console.log("Updating values to " + list1);
    valuesArray.length = 0;
    list1.forEach((value) => {
      valuesArray.push(value);
    });
    gridRef.current.api.getColumnFilterInstance("array").then((filter) => {
      filter.refreshFilterValues();
      valuesCallbackList = list1;
    });
  }, [list1, valuesArray]);

  const useList2 = useCallback(() => {
    console.log("Updating values to " + list2);
    valuesArray.length = 0;
    list2.forEach((value) => {
      valuesArray.push(value);
    });
    gridRef.current.api.getColumnFilterInstance("array").then((filter) => {
      filter.refreshFilterValues();
      valuesCallbackList = list2;
    });
  }, [list2, valuesArray]);

  return (
    <div style={containerStyle}>
      <div id="container">
        <div id="header">
          <button onClick={useList1}>
            Use <code>['Elephant', 'Lion', 'Monkey']</code>
          </button>
          <button onClick={useList2}>
            Use <code>['Elephant', 'Giraffe', 'Tiger']</code>
          </button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            sideBar={"filters"}
            onFirstDataRendered={onFirstDataRendered}
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

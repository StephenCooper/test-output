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
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { CellSelectionModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);

const daysList = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const createRowData = (rowData) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  for (let i = 0; i < rowData.length; i++) {
    const dt = new Date(
      getRandom(currentYear - 10, currentYear + 10),
      getRandom(0, 12),
      getRandom(1, 25),
    );
    rowData[i].dayOfTheWeek = daysList[dt.getDay()];
  }
  return rowData;
};

var getRandom = function (start, finish) {
  return Math.floor(Math.random() * (finish - start) + start);
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", minWidth: 150 },
    { headerName: "Day of the Week", field: "dayOfTheWeek", minWidth: 180 },
    { field: "age", maxWidth: 90 },
    { field: "country", minWidth: 150 },
    { field: "year", maxWidth: 90 },
    { field: "date", minWidth: 150 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      editable: true,
      cellDataType: false,
    };
  }, []);
  const cellSelection = useMemo(() => {
    return {
      handle: {
        mode: "fill",
        setFillValue(params) {
          const hasNonDayValues = params.initialValues.some(function (val) {
            return daysList.indexOf(val) === -1;
          });
          if (hasNonDayValues) {
            return false;
          }
          const lastValue = params.values[params.values.length - 1];
          const idxOfLast = daysList.indexOf(lastValue);
          const nextDay = daysList[(idxOfLast + 1) % daysList.length];
          console.log("Custom Fill Operation -> Next Day is:", nextDay);
          return nextDay;
        },
      },
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => {
        setRowData(createRowData(data));
      });
  }, []);

  const onFillStart = useCallback((event) => {
    console.log("Fill Start", event);
  }, []);

  const onFillEnd = useCallback((event) => {
    console.log("Fill End", event);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          cellSelection={cellSelection}
          onGridReady={onGridReady}
          onFillStart={onFillStart}
          onFillEnd={onFillEnd}
        />
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

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
  NumberEditorModule,
  RowApiModule,
  RowStyleModule,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextEditorModule,
  NumberEditorModule,
  RowApiModule,
  RowStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const randomInt = () => {
  return Math.floor(Math.random() * 10);
};

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(getData());
  const [columnDefs, setColumnDefs] = useState([
    { headerName: "Employee", field: "employee" },
    { headerName: "Number Sick Days", field: "sickDays", editable: true },
  ]);
  const rowClassRules = useMemo(() => {
    return {
      // row style function
      "sick-days-warning": (params) => {
        const numSickDays = params.data.sickDays;
        return numSickDays > 5 && numSickDays <= 7;
      },
      // row style expression
      "sick-days-breach": "data.sickDays >= 8",
    };
  }, []);

  const setData = useCallback(() => {
    gridRef.current.api.forEachNode(function (rowNode) {
      const newData = {
        employee: rowNode.data.employee,
        sickDays: randomInt(),
      };
      rowNode.setData(newData);
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button onClick={setData}>Update Data</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            rowClassRules={rowClassRules}
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

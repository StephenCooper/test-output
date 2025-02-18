"use client";

import React, { useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  CheckboxEditorModule,
  ClientSideRowModelModule,
  DateEditorModule,
  ModuleRegistry,
  NumberEditorModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  NumberEditorModule,
  DateEditorModule,
  CheckboxEditorModule,
  ValidationModule /* Development Only */,
]);

const data = Array.from(Array(20).keys()).map((val, index) => ({
  number: index,
  date: new Date(2023, 5, index + 1),
  dateString: `2023-06-${index < 9 ? "0" + (index + 1) : index + 1}`,
  boolean: !!(index % 2),
}));

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(data);
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Number Editor",
      field: "number",
      cellEditor: "agNumberCellEditor",
      cellEditorParams: {
        precision: 0,
      },
    },
    {
      headerName: "Date Editor",
      field: "date",
      valueFormatter: (params) => {
        if (!params.value) {
          return "";
        }
        const month = params.value.getMonth() + 1;
        const day = params.value.getDate();
        return `${params.value.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
      },
      cellEditor: "agDateCellEditor",
    },
    {
      headerName: "Date as String Editor",
      field: "dateString",
      cellEditor: "agDateStringCellEditor",
    },
    {
      headerName: "Checkbox Cell Editor",
      field: "boolean",
      cellEditor: "agCheckboxCellEditor",
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      editable: true,
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
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

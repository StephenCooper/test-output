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
  CellValueChangedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
  ValueGetterParams,
  ValueSetterParams,
  createGrid,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextEditorModule,
  NumberEditorModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(getData());
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      headerName: "Name",
      valueGetter: (params: ValueGetterParams) => {
        return params.data.firstName + " " + params.data.lastName;
      },
      valueSetter: (params: ValueSetterParams) => {
        const fullName = params.newValue || "";
        const nameSplit = fullName.split(" ");
        const newFirstName = nameSplit[0];
        const newLastName = nameSplit[1];
        const data = params.data;
        if (data.firstName !== newFirstName || data.lastName !== newLastName) {
          data.firstName = newFirstName;
          data.lastName = newLastName;
          // return true to tell grid that the value has changed, so it knows
          // to update the cell
          return true;
        } else {
          // return false, the grid doesn't need to update
          return false;
        }
      },
    },
    {
      headerName: "A",
      field: "a",
    },
    {
      headerName: "B",
      valueGetter: (params: ValueGetterParams) => {
        return params.data.b;
      },
      valueSetter: (params: ValueSetterParams) => {
        const newVal = params.newValue;
        const valueChanged = params.data.b !== newVal;
        if (valueChanged) {
          params.data.b = newVal;
        }
        return valueChanged;
      },
      cellDataType: "number",
    },
    {
      headerName: "C.X",
      valueGetter: (params: ValueGetterParams) => {
        if (params.data.c) {
          return params.data.c.x;
        } else {
          return undefined;
        }
      },
      valueSetter: (params: ValueSetterParams) => {
        const newVal = params.newValue;
        if (!params.data.c) {
          params.data.c = {};
        }
        const valueChanged = params.data.c.x !== newVal;
        if (valueChanged) {
          params.data.c.x = newVal;
        }
        return valueChanged;
      },
      cellDataType: "number",
    },
    {
      headerName: "C.Y",
      valueGetter: (params: ValueGetterParams) => {
        if (params.data.c) {
          return params.data.c.y;
        } else {
          return undefined;
        }
      },
      valueSetter: (params: ValueSetterParams) => {
        const newVal = params.newValue;
        if (!params.data.c) {
          params.data.c = {};
        }
        const valueChanged = params.data.c.y !== newVal;
        if (valueChanged) {
          params.data.c.y = newVal;
        }
        return valueChanged;
      },
      cellDataType: "number",
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      editable: true,
    };
  }, []);

  const onCellValueChanged = useCallback((event: CellValueChangedEvent) => {
    console.log("Data after change is", event.data);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
(window as any).tearDownExample = () => root.unmount();

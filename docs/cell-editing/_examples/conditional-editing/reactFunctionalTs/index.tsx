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
import {
  CellClassParams,
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColTypeDef,
  EditableCallbackParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  RowApiModule,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  RowApiModule,
  NumberEditorModule,
  TextEditorModule,
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let editableYear = 2012;

function isCellEditable(params: EditableCallbackParams | CellClassParams) {
  return params.data.year === editableYear;
}

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", type: "editableColumn" },
    { field: "age", type: "editableColumn" },
    { field: "year" },
    { field: "country" },
    { field: "sport" },
    { field: "total" },
  ]);
  const columnTypes = useMemo<{
    [key: string]: ColTypeDef;
  }>(() => {
    return {
      editableColumn: {
        editable: (params: EditableCallbackParams<IOlympicData>) => {
          return isCellEditable(params);
        },
        cellStyle: (params: CellClassParams<IOlympicData>) => {
          if (isCellEditable(params)) {
            return { backgroundColor: "#2244CC44" };
          }
        },
      },
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  const setEditableYear = useCallback((year: number) => {
    editableYear = year;
    // Redraw to re-apply the new cell style
    gridRef.current!.api.redrawRows();
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button
            style={{ fontSize: "12px" }}
            onClick={() => setEditableYear(2008)}
          >
            Enable Editing for 2008
          </button>
          <button
            style={{ fontSize: "12px" }}
            onClick={() => setEditableYear(2012)}
          >
            Enable Editing for 2012
          </button>
        </div>

        <div style={gridStyle}>
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            columnTypes={columnTypes}
            onGridReady={onGridReady}
          />
        </div>
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

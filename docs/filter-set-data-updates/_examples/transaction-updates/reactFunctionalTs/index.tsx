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
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  ModuleRegistry,
  RowApiModule,
  SideBarDef,
  TextEditorModule,
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
  ClientSideRowModelApiModule,
  RowApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TextEditorModule,
  ValidationModule /* Development Only */,
]);

function getRowData() {
  return [
    { col1: "A" },
    { col1: "A" },
    { col1: "B" },
    { col1: "B" },
    { col1: "C" },
    { col1: "C" },
  ];
}

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(getRowData());
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      headerName: "Set Filter Column",
      field: "col1",
      filter: "agSetColumnFilter",
      editable: true,
      minWidth: 250,
    },
  ]);

  const onFirstDataRendered = useCallback((params: FirstDataRenderedEvent) => {
    params.api.getToolPanelInstance("filters")!.expandFilters();
  }, []);

  const updateFirstRow = useCallback(() => {
    const firstRow = gridRef.current!.api.getDisplayedRowAtIndex(0);
    if (firstRow) {
      const firstRowData = firstRow.data;
      firstRowData["col1"] += "X";
      gridRef.current!.api.applyTransaction({ update: [firstRowData] });
    }
  }, []);

  const addDRow = useCallback(() => {
    gridRef.current!.api.applyTransaction({ add: [{ col1: "D" }] });
  }, []);

  const reset = useCallback(() => {
    gridRef.current!.api.setFilterModel(null);
    setRowData(getRowData());
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <label>Transaction Updates: </label>
          <button onClick={updateFirstRow}>Update First Displayed Row</button>
          <button onClick={addDRow}>Add New 'D' Row</button>
          <button onClick={reset} style={{ marginLeft: "20px" }}>
            Reset
          </button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            sideBar={"filters"}
            onFirstDataRendered={onFirstDataRendered}
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

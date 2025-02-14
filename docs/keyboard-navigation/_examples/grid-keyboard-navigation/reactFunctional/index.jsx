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
  NumberFilterModule,
  RowSelectionModule,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ClipboardModule,
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  PivotModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  RowSelectionModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  NumberFilterModule,
  ClipboardModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Participant",
      children: [
        { field: "athlete", minWidth: 170 },
        { field: "country", minWidth: 150 },
      ],
    },
    { field: "sport" },
    {
      headerName: "Medals",
      children: [
        {
          field: "total",
          columnGroupShow: "closed",
          filter: "agNumberColumnFilter",
          width: 120,
          flex: 0,
        },
        {
          field: "gold",
          columnGroupShow: "open",
          filter: "agNumberColumnFilter",
          width: 100,
          flex: 0,
        },
        {
          field: "silver",
          columnGroupShow: "open",
          filter: "agNumberColumnFilter",
          width: 100,
          flex: 0,
        },
        {
          field: "bronze",
          columnGroupShow: "open",
          filter: "agNumberColumnFilter",
          width: 100,
          flex: 0,
        },
      ],
    },
    { field: "year", filter: "agNumberColumnFilter" },
  ]);
  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
    };
  }, []);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      minWidth: 100,
      filter: true,
      floatingFilter: true,
      flex: 1,
    };
  }, []);
  const sideBar = useMemo(() => {
    return {
      toolPanels: ["columns", "filters"],
      defaultToolPanel: "",
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection={rowSelection}
          defaultColDef={defaultColDef}
          sideBar={sideBar}
          onGridReady={onGridReady}
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

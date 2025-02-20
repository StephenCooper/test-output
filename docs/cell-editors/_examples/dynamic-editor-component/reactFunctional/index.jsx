'use client';
import React, { StrictMode, useCallback, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RichSelectModule,
} from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { getData } from "./data";
import MoodEditor from "./moodEditor";
import NumericCellEditor from "./numericCellEditor";
import "./styles.css";

ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  ColumnsToolPanelModule,
  RichSelectModule,
  ValidationModule /* Development Only */,
]);

const cellEditorSelector = (params) => {
  if (params.data.type === "age") {
    return {
      component: NumericCellEditor,
    };
  }
  if (params.data.type === "gender") {
    return {
      component: "agRichSelectCellEditor",
      params: {
        values: ["Male", "Female"],
      },
    };
  }
  if (params.data.type === "mood") {
    return {
      component: MoodEditor,
      popup: true,
      popupPosition: "under",
    };
  }
  return undefined;
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(getData());
  const [columnDefs, setColumnDefs] = useState([
    { field: "type" },
    {
      field: "value",
      editable: true,
      cellEditorSelector: cellEditorSelector,
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      cellDataType: false,
    };
  }, []);

  const onRowEditingStarted = useCallback((event) => {
    console.log("never called - not doing row editing");
  }, []);

  const onRowEditingStopped = useCallback((event) => {
    console.log("never called - not doing row editing");
  }, []);

  const onCellEditingStarted = useCallback((event) => {
    console.log("cellEditingStarted");
  }, []);

  const onCellEditingStopped = useCallback((event) => {
    console.log("cellEditingStopped");
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onRowEditingStarted={onRowEditingStarted}
          onRowEditingStopped={onRowEditingStopped}
          onCellEditingStarted={onCellEditingStarted}
          onCellEditingStopped={onCellEditingStopped}
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

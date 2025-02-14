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
import { colors } from "./colors.jsx";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { RichSelectModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextEditorModule,
  ClientSideRowModelModule,
  RichSelectModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(
    colors.map((v) => ({ color: v.name, detailedColor: v })),
  );
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Color (Column as String Type)",
      field: "color",
      width: 250,
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: {
        formatValue: (v) => v.name,
        parseValue: (v) => v.name,
        values: colors,
        searchType: "matchAny",
        allowTyping: true,
        filterList: true,
        valueListMaxHeight: 220,
      },
    },
    {
      headerName: "Color (Column as Complex Object)",
      field: "detailedColor",
      width: 290,
      valueFormatter: (p) => `${p.value.name} (${p.value.code})`,
      valueParser: (p) => p.newValue,
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: {
        formatValue: (v) => v.name,
        values: colors,
        searchType: "matchAny",
        allowTyping: true,
        filterList: true,
        valueListMaxHeight: 220,
      },
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      width: 200,
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

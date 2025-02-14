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
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ILargeTextEditorParams,
  IRichCellEditorParams,
  ISelectCellEditorParams,
  ITextCellEditorParams,
  LargeTextEditorModule,
  ModuleRegistry,
  SelectEditorModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { RichSelectModule } from "ag-grid-enterprise";
import { colors } from "./colors";
import ColourCellRenderer from "./colourCellRenderer.tsx";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RichSelectModule,
  SelectEditorModule,
  TextEditorModule,
  LargeTextEditorModule,
  ValidationModule /* Development Only */,
]);

function getRandomNumber(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const data = Array.from(Array(20).keys()).map(() => {
  const color = colors[getRandomNumber(0, colors.length - 1)];
  return {
    color1: color,
    color2: color,
    color3: color,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  };
});

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(data);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      headerName: "Text Editor",
      field: "color1",
      cellRenderer: ColourCellRenderer,
      cellEditor: "agTextCellEditor",
      cellEditorParams: {
        maxLength: 20,
      } as ITextCellEditorParams,
    },
    {
      headerName: "Select Editor",
      field: "color2",
      cellRenderer: ColourCellRenderer,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: colors,
      } as ISelectCellEditorParams,
    },
    {
      headerName: "Rich Select Editor",
      field: "color3",
      cellRenderer: ColourCellRenderer,
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: {
        values: colors,
        cellRenderer: ColourCellRenderer,
        filterList: true,
        searchType: "match",
        allowTyping: true,
        valueListMaxHeight: 220,
      } as IRichCellEditorParams,
    },
    {
      headerName: "Large Text Editor",
      field: "description",
      cellEditorPopup: true,
      cellEditor: "agLargeTextCellEditor",
      cellEditorParams: {
        maxLength: 250,
        rows: 10,
        cols: 50,
      } as ILargeTextEditorParams,
      flex: 2,
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
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

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
(window as any).tearDownExample = () => root.unmount();

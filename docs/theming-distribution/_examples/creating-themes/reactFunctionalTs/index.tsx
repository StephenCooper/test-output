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
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridOptions,
  ModuleRegistry,
  RowSelectionOptions,
  Theme,
  colorSchemeVariable,
  createGrid,
  createTheme,
  iconSetMaterial,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule]);

const myCustomTheme = createTheme()
  // add just the parts you want
  .withPart(iconSetMaterial)
  .withPart(colorSchemeVariable)
  // set default param values
  .withParams({
    accentColor: "red",
    iconSize: 18,
  });

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>(
    (() => {
      const rowData: any[] = [];
      for (let i = 0; i < 10; i++) {
        rowData.push({
          make: "Toyota",
          model: "Celica",
          price: 35000 + i * 1000,
        });
        rowData.push({
          make: "Ford",
          model: "Mondeo",
          price: 32000 + i * 1000,
        });
        rowData.push({
          make: "Porsche",
          model: "Boxster",
          price: 72000 + i * 1000,
        });
      }
      return rowData;
    })(),
  );
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "make" },
    { field: "model" },
    { field: "price" },
  ]);
  const theme = useMemo<Theme | "legacy">(() => {
    return myCustomTheme;
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    };
  }, []);
  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return { mode: "multiRow", checkboxes: true };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          theme={theme}
          defaultColDef={defaultColDef}
          rowSelection={rowSelection}
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

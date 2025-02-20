'use client';
import React, { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import {
  ClientSideRowModelModule,
  CsvExportModule,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import type { ColDef } from "ag-grid-community";
import {
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";

import "./styles.css";

// Register shared Modules globally
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);
const leftModules = [SetFilterModule, ClipboardModule, CsvExportModule];
const rightModules = [
  TextFilterModule,
  NumberFilterModule,
  CsvExportModule,
  ExcelExportModule,
];

const columns: ColDef[] = [
  { field: "id" },
  { field: "color" },
  { field: "value1" },
];

const defaultColDef: ColDef = {
  flex: 1,
  minWidth: 80,
  filter: true,
  floatingFilter: true,
};

const GridExample = () => {
  const [leftRowData, setLeftRowData] = useState<any[]>([]);
  const [rightRowData, setRightRowData] = useState<any[]>([]);

  let rowIdSequence = 100;
  useEffect(() => {
    const createRowBlock = () =>
      ["Red", "Green", "Blue"].map((color) => ({
        id: rowIdSequence++,
        color: color,
        value1: Math.floor(Math.random() * 100),
      }));

    setLeftRowData(createRowBlock());
    setRightRowData(createRowBlock());
  }, []);

  return (
    <div className="example-wrapper">
      <div className="inner-col">
        <AgGridReact
          defaultColDef={defaultColDef}
          rowData={leftRowData}
          modules={leftModules}
          columnDefs={columns}
        />
      </div>

      <div className="inner-col">
        <AgGridReact
          defaultColDef={defaultColDef}
          rowData={rightRowData}
          modules={rightModules}
          columnDefs={columns}
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

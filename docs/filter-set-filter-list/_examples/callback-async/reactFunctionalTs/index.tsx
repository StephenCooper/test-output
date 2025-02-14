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
  ISetFilterParams,
  ModuleRegistry,
  SetFilterValuesFuncParams,
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
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const filterParams: ISetFilterParams = {
  values: (params: SetFilterValuesFuncParams) => {
    setTimeout(() => {
      params.success(["value 1", "value 2"]);
    }, 3000);
  },
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>([
    { value: "value 1" },
    { value: "value 1" },
    { value: "value 1" },
    { value: "value 1" },
    { value: "value 2" },
    { value: "value 2" },
    { value: "value 2" },
    { value: "value 2" },
    { value: "value 2" },
  ]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      headerName: "Set filter column",
      field: "value",
      flex: 1,
      filter: "agSetColumnFilter",
      floatingFilter: true,
      filterParams: filterParams,
    },
  ]);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact rowData={rowData} columnDefs={columnDefs} />
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

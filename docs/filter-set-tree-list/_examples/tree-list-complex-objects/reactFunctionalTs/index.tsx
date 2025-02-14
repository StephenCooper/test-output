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
  GetDataPath,
  GridApi,
  GridOptions,
  ISetFilterParams,
  KeyCreatorParams,
  ModuleRegistry,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
  TreeDataModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TreeDataModule,
  ValidationModule /* Development Only */,
]);

const pathLookup: {
  [key: string]: string;
} = getData().reduce((pathMap, row) => {
  pathMap[row.path.key] = row.path.displayValue;
  return pathMap;
}, {});

function treeListFormatter(
  pathKey: string | null,
  _level: number,
  parentPathKeys: (string | null)[],
): string {
  return pathLookup[[...parentPathKeys, pathKey].join(".")];
}

const valueFormatter: (params: ValueFormatterParams) => string = (
  params: ValueFormatterParams,
) => {
  return params.value ? pathLookup[params.value.join(".")] : "(Blanks)";
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(getData());
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "employmentType" },
    { field: "jobTitle" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 200,
      filter: true,
      floatingFilter: true,
      cellDataType: false,
    };
  }, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerName: "Employee",
      field: "path",
      cellRendererParams: {
        suppressCount: true,
      },
      filter: "agSetColumnFilter",
      filterParams: {
        treeList: true,
        keyCreator: (params: KeyCreatorParams) => params.value.join("."),
        treeListFormatter: treeListFormatter,
        valueFormatter: valueFormatter,
      } as ISetFilterParams<any, string[]>,
      minWidth: 280,
      valueFormatter: (params: ValueFormatterParams) =>
        params.value.displayValue,
    };
  }, []);
  const getDataPath = useCallback((data) => data.path.key.split("."), []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          treeData={true}
          groupDefaultExpanded={-1}
          getDataPath={getDataPath}
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

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
  CellSelectionOptions,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberEditorModule,
  ProcessCellForExportParams,
  ProcessGroupHeaderForExportParams,
  ProcessHeaderForExportParams,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const { data, loading } = useFetchJson<IOlympicData>(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<(ColDef | ColGroupDef)[]>([
    {
      headerName: "Participants",
      children: [
        { field: "athlete", headerName: "Athlete Name", minWidth: 200 },
        { field: "age" },
        { field: "country", minWidth: 150 },
      ],
    },
    {
      headerName: "Olympic Games",
      children: [
        { field: "year" },
        { field: "date", minWidth: 150 },
        { field: "sport", minWidth: 150 },
        { field: "gold" },
        { field: "silver", suppressPaste: true },
        { field: "bronze" },
        { field: "total" },
      ],
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      flex: 1,
      minWidth: 100,
      cellDataType: false,
    };
  }, []);

  const processCellForClipboard = useCallback(
    (params: ProcessCellForExportParams) => {
      return "C-" + params.value;
    },
    [],
  );

  const processHeaderForClipboard = useCallback(
    (params: ProcessHeaderForExportParams) => {
      const colDef = params.column.getColDef();
      let headerName = colDef.headerName || colDef.field || "";
      if (colDef.headerName !== "") {
        headerName = headerName.charAt(0).toUpperCase() + headerName.slice(1);
      }
      return "H-" + headerName;
    },
    [],
  );

  const processGroupHeaderForClipboard = useCallback(
    (params: ProcessGroupHeaderForExportParams) => {
      const colGroupDef = params.columnGroup.getColGroupDef() || ({} as any);
      const headerName = colGroupDef.headerName || "";
      if (headerName === "") {
        return "";
      }
      return "GH-" + headerName;
    },
    [],
  );

  const processCellFromClipboard = useCallback(
    (params: ProcessCellForExportParams) => {
      return "Z-" + params.value;
    },
    [],
  );

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={data}
          loading={loading}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          cellSelection={true}
          processCellForClipboard={processCellForClipboard}
          processHeaderForClipboard={processHeaderForClipboard}
          processGroupHeaderForClipboard={processGroupHeaderForClipboard}
          processCellFromClipboard={processCellFromClipboard}
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

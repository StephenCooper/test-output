"use client";

import React, { useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  CheckboxEditorModule,
  ClientSideRowModelModule,
  DateEditorModule,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  CheckboxEditorModule,
  DateEditorModule,
  ClientSideRowModelModule,
  ClipboardModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  RowGroupingModule,
  SetFilterModule,
  RowGroupingPanelModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete" },
    { field: "age", minWidth: 100 },
    { field: "hasGold", minWidth: 100, headerName: "Gold" },
    {
      field: "hasSilver",
      minWidth: 100,
      headerName: "Silver",
      cellRendererParams: { disabled: true },
    },
    { field: "dateObject", headerName: "Date" },
    { field: "date", headerName: "Date (String)" },
    { field: "countryObject", headerName: "Country" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 180,
      filter: true,
      floatingFilter: true,
      editable: true,
      enableRowGroup: true,
    };
  }, []);
  const dataTypeDefinitions = useMemo(() => {
    return {
      object: {
        baseDataType: "object",
        extendsDataType: "object",
        valueParser: (params) => ({ name: params.newValue }),
        valueFormatter: (params) =>
          params.value == null ? "" : params.value.name,
      },
    };
  }, []);
  const cellSelection = useMemo(() => {
    return {
      handle: { mode: "fill" },
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={data}
          loading={loading}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          dataTypeDefinitions={dataTypeDefinitions}
          rowGroupPanelShow={"always"}
          cellSelection={cellSelection}
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

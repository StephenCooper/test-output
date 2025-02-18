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
import "./styles.css";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  AdvancedFilterModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  AdvancedFilterModule,
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

function valueGetter(params) {
  return params.data ? params.data[params.colDef.field] * -1 : null;
}

let includeHiddenColumns = false;

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    {
      field: "athlete",
      filterParams: {
        caseSensitive: true,
        filterOptions: ["contains"],
      },
    },
    { field: "country", rowGroup: true, hide: true },
    { field: "sport", hide: true },
    { field: "age", minWidth: 100, filter: false },
    {
      headerName: "Medals (+)",
      children: [
        { field: "gold", minWidth: 100 },
        { field: "silver", minWidth: 100 },
        { field: "bronze", minWidth: 100 },
      ],
    },
    {
      headerName: "Medals (-)",
      children: [
        {
          field: "gold",
          headerValueGetter: (params) =>
            params.location === "advancedFilter" ? "Gold (-)" : "Gold",
          valueGetter: valueGetter,
          cellDataType: "number",
          minWidth: 100,
        },
        {
          field: "silver",
          headerValueGetter: (params) =>
            params.location === "advancedFilter" ? "Silver (-)" : "Silver",
          valueGetter: valueGetter,
          cellDataType: "number",
          minWidth: 100,
        },
        {
          field: "bronze",
          headerValueGetter: (params) =>
            params.location === "advancedFilter" ? "Bronze (-)" : "Bronze",
          valueGetter: valueGetter,
          cellDataType: "number",
          minWidth: 100,
        },
      ],
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 180,
      filter: true,
    };
  }, []);

  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  const onIncludeHiddenColumnsToggled = useCallback(() => {
    includeHiddenColumns = !includeHiddenColumns;
    gridRef.current.api.setGridOption(
      "includeHiddenColumnsInAdvancedFilter",
      includeHiddenColumns,
    );
    document.querySelector("#includeHiddenColumns").textContent =
      `${includeHiddenColumns ? "Exclude" : "Include"} Hidden Columns`;
  }, [includeHiddenColumns]);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="example-header">
          <button
            id="includeHiddenColumns"
            onClick={onIncludeHiddenColumnsToggled}
          >
            Include Hidden Columns
          </button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            groupDefaultExpanded={1}
            enableAdvancedFilter={true}
          />
        </div>
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

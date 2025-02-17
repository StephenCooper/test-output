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
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  UseGroupTotalRow,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const { data, loading } = useFetchJson<any>(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "country", rowGroup: true, hide: true },
    { field: "year", rowGroup: true, hide: true },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 150,
    };
  }, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      minWidth: 300,
    };
  }, []);

  const onChange = useCallback(() => {
    const suppressStickyTotalRow = document.querySelector<HTMLInputElement>(
      "#input-property-value",
    )!.value;
    if (
      suppressStickyTotalRow === "grand" ||
      suppressStickyTotalRow === "group"
    ) {
      gridRef.current!.api.setGridOption(
        "suppressStickyTotalRow",
        suppressStickyTotalRow,
      );
    } else if (suppressStickyTotalRow === "true") {
      gridRef.current!.api.setGridOption("suppressStickyTotalRow", true);
    } else {
      gridRef.current!.api.setGridOption("suppressStickyTotalRow", false);
    }
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="example-header">
          <label>
            <span>suppressStickyTotalRow:</span>
            <select id="input-property-value" onChange={onChange}>
              <option value="false">false</option>
              <option value="true">true</option>
              <option value="grand">"grand"</option>
              <option value="group">"group"</option>
            </select>
          </label>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            groupDefaultExpanded={-1}
            groupTotalRow={"bottom"}
            grandTotalRow={"bottom"}
          />
        </div>
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

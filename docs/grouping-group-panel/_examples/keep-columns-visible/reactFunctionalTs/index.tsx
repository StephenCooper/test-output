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
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule, RowGroupingPanelModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "country", enableRowGroup: true },
    { field: "year", enableRowGroup: true },
    { field: "athlete", minWidth: 180 },
    { field: "total" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 150,
    };
  }, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      minWidth: 200,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  const onPropertyChange = useCallback(() => {
    const prop = (
      document.querySelector("#visibility-behaviour") as HTMLSelectElement
    ).value;
    if (prop === "true" || prop === "false") {
      gridRef.current!.api.setGridOption(
        "suppressGroupChangesColumnVisibility",
        prop === "true",
      );
    } else {
      gridRef.current!.api.setGridOption(
        "suppressGroupChangesColumnVisibility",
        prop as "suppressHideOnGroup" | "suppressShowOnUngroup",
      );
    }
  }, []);

  const resetCols = useCallback(() => {
    gridRef.current!.api.setGridOption("columnDefs", [
      { field: "country", enableRowGroup: true, hide: false },
      { field: "year", enableRowGroup: true, hide: false },
      { field: "athlete", minWidth: 180, hide: false },
      { field: "total", hide: false },
    ]);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="example-header">
          <label>
            <span>suppressGroupChangesColumnVisibility:</span>
            <select id="visibility-behaviour" onChange={onPropertyChange}>
              <option value="false">false</option>
              <option value="true">true</option>
              <option value="suppressHideOnGroup">"suppressHideOnGroup"</option>
              <option value="suppressShowOnUngroup">
                "suppressShowOnUngroup"
              </option>
            </select>
          </label>
          <button onClick={resetCols}>Reset Column Visibility</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            suppressDragLeaveHidesColumns={true}
            rowGroupPanelShow={"always"}
            onGridReady={onGridReady}
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

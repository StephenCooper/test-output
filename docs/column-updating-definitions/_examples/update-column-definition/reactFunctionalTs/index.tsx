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
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const COL_DEFS: ColDef<IOlympicData>[] = [
  { field: "athlete" },
  { field: "age" },
  { field: "country" },
  { field: "sport" },
  { field: "year" },
  { field: "date" },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
  { field: "total" },
];

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      initialWidth: 100,
      filter: true,
    };
  }, []);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>(COL_DEFS);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => {
        setRowData(data);
      });
  }, []);

  const setHeaderNames = useCallback(() => {
    COL_DEFS.forEach((colDef, index) => {
      colDef.headerName = "C" + index;
    });
    gridRef.current!.api.setGridOption("columnDefs", COL_DEFS);
  }, []);

  const removeHeaderNames = useCallback(() => {
    COL_DEFS.forEach((colDef) => {
      colDef.headerName = undefined;
    });
    gridRef.current!.api.setGridOption("columnDefs", COL_DEFS);
  }, []);

  const setValueFormatters = useCallback(() => {
    COL_DEFS.forEach((colDef) => {
      colDef.valueFormatter = function (params) {
        return "[ " + params.value + " ]";
      };
    });
    gridRef.current!.api.setGridOption("columnDefs", COL_DEFS);
  }, []);

  const removeValueFormatters = useCallback(() => {
    COL_DEFS.forEach((colDef) => {
      colDef.valueFormatter = undefined;
    });
    gridRef.current!.api.setGridOption("columnDefs", COL_DEFS);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          <button onClick={setHeaderNames}>Set Header Names</button>
          <button onClick={removeHeaderNames}>Remove Header Names</button>
          <button onClick={setValueFormatters}>Set Value Formatters</button>
          <button onClick={removeValueFormatters}>
            Remove Value Formatters
          </button>
        </div>

        <div style={gridStyle} className="test-grid">
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={rowData}
            defaultColDef={defaultColDef}
            columnDefs={columnDefs}
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
(window as any).tearDownExample = () => root.unmount();

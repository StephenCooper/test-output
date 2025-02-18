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
  HeaderClassParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const { data, loading } = useFetchJson<any>(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<(ColDef | ColGroupDef)[]>([
    {
      headerName: "Athlete Details",
      headerStyle: { color: "white", backgroundColor: "cadetblue" },
      children: [
        {
          field: "athlete",
          headerStyle: { color: "white", backgroundColor: "teal" },
        },
        { field: "age", initialWidth: 120 },
        {
          field: "country",
          headerStyle: (params: HeaderClassParams) => {
            return {
              color: "white",
              backgroundColor: params.floatingFilter
                ? "cornflowerblue"
                : "teal",
            };
          },
        },
      ],
    },
    {
      field: "sport",
      wrapHeaderText: true,
      autoHeaderHeight: true,
      headerName: "The Sport the athlete participated in",
      headerClass: "sport-header",
    },
    {
      headerName: "Medal Details",
      headerStyle: (params) => {
        return {
          color: "white",
          backgroundColor: params.columnGroup?.isExpanded()
            ? "cornflowerblue"
            : "orangered",
        };
      },
      children: [
        { field: "bronze", columnGroupShow: "open" },
        { field: "silver", columnGroupShow: "open" },
        { field: "gold", columnGroupShow: "open" },
        {
          columnGroupShow: "closed",
          field: "total",
        },
      ],
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      initialWidth: 200,
      floatingFilter: true,
      filter: true,
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

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
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      headerName: "Athlete Name",
      field: "athlete",
      suppressHeaderFilterButton: true,
    },
    { field: "age", sortable: false },
    { field: "country", suppressHeaderFilterButton: true },
    { field: "year", sortable: false },
    { field: "date", suppressHeaderFilterButton: true, sortable: false },
    { field: "sport", sortable: false },
    { field: "gold" },
    { field: "silver", sortable: false },
    { field: "bronze", suppressHeaderFilterButton: true },
    { field: "total", sortable: false },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      width: 150,
      headerComponentParams: {
        template: `<div class="ag-cell-label-container" role="presentation">
                    <span data-ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>
                    <span data-ref="eFilterButton" class="ag-header-icon ag-header-cell-filter-button"></span>
                    <div data-ref="eLabel" class="ag-header-cell-label" role="presentation">
                        <span data-ref="eSortOrder" class="ag-header-icon ag-sort-order ag-hidden"></span>
                        <span data-ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon ag-hidden"></span>
                        <span data-ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon ag-hidden"></span>
                        <span data-ref="eSortMixed" class="ag-header-icon ag-sort-mixed-icon ag-hidden"></span>
                        <span data-ref="eSortNone" class="ag-header-icon ag-sort-none-icon ag-hidden"></span>
                        ** <span data-ref="eText" class="ag-header-cell-text" role="columnheader"></span>
                        <span data-ref="eFilter" class="ag-header-icon ag-filter-icon"></span>
                    </div>
                </div>`,
      },
    };
  }, []);

  const { data, loading } = useFetchJson<IOlympicData>(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
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

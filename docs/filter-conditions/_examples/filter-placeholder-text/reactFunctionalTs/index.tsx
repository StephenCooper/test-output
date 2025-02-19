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
  IFilterPlaceholderFunctionParams,
  INumberFilterParams,
  ITextFilterParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "athlete",
    },
    {
      field: "country",
      filter: "agTextColumnFilter",
      filterParams: {
        filterPlaceholder: "Country...",
      } as ITextFilterParams,
    },
    {
      field: "sport",
      filter: "agTextColumnFilter",
      filterParams: {
        filterPlaceholder: (params: IFilterPlaceholderFunctionParams) => {
          const { filterOptionKey, placeholder } = params;
          return `${filterOptionKey} - ${placeholder}`;
        },
      } as ITextFilterParams,
    },
    {
      field: "total",
      filter: "agNumberColumnFilter",
      filterParams: {
        filterPlaceholder: (params: IFilterPlaceholderFunctionParams) => {
          const { filterOption } = params;
          return `${filterOption} total`;
        },
      } as INumberFilterParams,
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      filter: true,
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

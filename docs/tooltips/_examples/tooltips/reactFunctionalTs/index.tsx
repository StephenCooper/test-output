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
  ITooltipParams,
  ModuleRegistry,
  TooltipModule,
  ValidationModule,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TooltipModule,
  ClientSideRowModelModule,
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
      headerName: "Athlete",
      field: "athlete",
      // here the Athlete column will tooltip the Country value
      tooltipField: "country",
      headerTooltip: "Tooltip for Athlete Column Header",
    },
    {
      field: "age",
      tooltipValueGetter: (p: ITooltipParams) =>
        "Create any fixed message, e.g. This is the Athlete’s Age ",
      headerTooltip: "Tooltip for Age Column Header",
    },
    {
      field: "year",
      tooltipValueGetter: (p: ITooltipParams) =>
        "This is a dynamic tooltip using the value of " + p.value,
      headerTooltip: "Tooltip for Year Column Header",
    },
    {
      headerName: "Hover For Tooltip",
      headerTooltip: "Column Groups can have Tooltips also",
      children: [
        {
          field: "sport",
          tooltipValueGetter: () => "Tooltip text about Sport should go here",
          headerTooltip: "Tooltip for Sport Column Header",
        },
      ],
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={data}
          loading={loading}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          tooltipShowDelay={500}
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

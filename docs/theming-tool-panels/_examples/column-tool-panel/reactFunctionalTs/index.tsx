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
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  SideBarDef,
  Theme,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllEnterpriseModule]);
import { useFetchJson } from "./useFetchJson";

const myTheme = themeQuartz.withParams({
  columnSelectIndentSize: 40,
  columnDropCellBackgroundColor: "purple",
  columnDropCellTextColor: "white",
  columnDropCellDragHandleColor: "white",
  columnDropCellBorder: { color: "yellow", style: "dashed", width: 2 },
});

const GridExample = () => {
  const { data, loading } = useFetchJson<IOlympicData>(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);
  const [columnDefs, setColumnDefs] = useState<(ColDef | ColGroupDef)[]>([
    {
      headerName: "Athlete",
      children: [
        { field: "athlete", minWidth: 170, rowGroup: true },
        { field: "age", rowGroup: true },
        { field: "country" },
      ],
    },
    {
      headerName: "Event",
      children: [{ field: "year" }, { field: "date" }, { field: "sport" }],
    },
    {
      headerName: "Medals",
      children: [
        { field: "gold" },
        { field: "silver" },
        { field: "bronze" },
        { field: "total" },
      ],
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      filter: true,
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={data}
          loading={loading}
          theme={theme}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          sideBar={"columns"}
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

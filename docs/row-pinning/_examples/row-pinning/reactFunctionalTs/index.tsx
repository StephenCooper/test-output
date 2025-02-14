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
  PinnedRowModule,
  RowClassParams,
  RowStyle,
  RowStyleModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import CustomPinnedRowRenderer from "./customPinnedRowRenderer.tsx";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  PinnedRowModule,
  RowStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "athlete",
      cellRendererSelector: (params) => {
        if (params.node.rowPinned) {
          return {
            component: CustomPinnedRowRenderer,
            params: {
              style: { color: "#5577CC" },
            },
          };
        } else {
          // rows that are not pinned don't use any cell renderer
          return undefined;
        }
      },
    },
    {
      field: "country",
      cellRendererSelector: (params) => {
        if (params.node.rowPinned) {
          return {
            component: CustomPinnedRowRenderer,
            params: {
              style: { fontStyle: "italic" },
            },
          };
        } else {
          // rows that are not pinned don't use any cell renderer
          return undefined;
        }
      },
    },
    { field: "sport" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
    };
  }, []);
  const getRowStyle = useCallback(
    (params: RowClassParams): RowStyle | undefined => {
      if (params.node.rowPinned) {
        return { fontWeight: "bold" };
      }
    },
    [],
  );
  const pinnedTopRowData = useMemo<any[]>(() => {
    return [
      {
        athlete: "TOP 1 (athlete)",
        country: "TOP 1 (country)",
        sport: "TOP 1 (sport)",
      },
      {
        athlete: "TOP 2 (athlete)",
        country: "TOP 2 (country)",
        sport: "TOP 2 (sport)",
      },
    ];
  }, []);
  const pinnedBottomRowData = useMemo<any[]>(() => {
    return [
      {
        athlete: "BOTTOM 1 (athlete)",
        country: "BOTTOM 1 (country)",
        sport: "BOTTOM 1 (sport)",
      },
      {
        athlete: "BOTTOM 2 (athlete)",
        country: "BOTTOM 2 (country)",
        sport: "BOTTOM 2 (sport)",
      },
    ];
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          getRowStyle={getRowStyle}
          pinnedTopRowData={pinnedTopRowData}
          pinnedBottomRowData={pinnedBottomRowData}
          onGridReady={onGridReady}
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

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
  CellDoubleClickedEvent,
  CellKeyDownEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import CustomGroupCellRenderer from "./customGroupCellRenderer.tsx";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "country",
      rowGroup: true,
      hide: true,
    },
    {
      field: "year",
      rowGroup: true,
      hide: true,
    },
    {
      field: "athlete",
    },
    {
      field: "total",
      aggFunc: "sum",
    },
  ]);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      cellRenderer: CustomGroupCellRenderer,
    };
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 120,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  const onCellDoubleClicked = useCallback(
    (params: CellDoubleClickedEvent<IOlympicData, any>) => {
      if (params.colDef.showRowGroup) {
        params.node.setExpanded(!params.node.expanded);
      }
    },
    [],
  );

  const onCellKeyDown = useCallback(
    (params: CellKeyDownEvent<IOlympicData, any>) => {
      if (!("colDef" in params)) {
        return;
      }
      if (!(params.event instanceof KeyboardEvent)) {
        return;
      }
      if (params.event.code !== "Enter") {
        return;
      }
      if (params.colDef.showRowGroup) {
        params.node.setExpanded(!params.node.expanded);
      }
    },
    [],
  );

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          autoGroupColumnDef={autoGroupColumnDef}
          defaultColDef={defaultColDef}
          groupDefaultExpanded={1}
          onGridReady={onGridReady}
          onCellDoubleClicked={onCellDoubleClicked}
          onCellKeyDown={onCellKeyDown}
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

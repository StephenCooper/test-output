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
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  ModuleRegistry,
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
import { MasterDetailModule } from "ag-grid-enterprise";
import DetailCellRenderer from "./detailCellRenderer.tsx";
import { IAccount } from "./interfaces";
ModuleRegistry.registerModules([
  RowApiModule,
  ClientSideRowModelModule,
  MasterDetailModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const detailCellRenderer = useCallback(DetailCellRenderer, []);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    // group cell renderer needed for expand / collapse icons
    { field: "name", cellRenderer: "agGroupCellRenderer", pinned: "left" },
    { field: "account" },
    { field: "calls" },
    { field: "minutes", valueFormatter: "x.toLocaleString() + 'm'" },
    { headerName: "Extra Col 1", valueGetter: '"AAA"' },
    { headerName: "Extra Col 2", valueGetter: '"BBB"' },
    { headerName: "Extra Col 3", valueGetter: '"CCC"' },
    { headerName: "Pinned Right", pinned: "right" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {};
  }, []);

  const { data, loading } = useFetchJson<IAccount>(
    "https://www.ag-grid.com/example-assets/master-detail-data.json",
  );

  const onFirstDataRendered = useCallback((params: FirstDataRenderedEvent) => {
    setTimeout(() => {
      params.api.forEachNode(function (node) {
        node.setExpanded(node.id === "1");
      });
    }, 1000);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IAccount>
          rowData={data}
          loading={loading}
          masterDetail={true}
          detailCellRenderer={detailCellRenderer}
          detailRowHeight={150}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          embedFullWidthRows={true}
          onFirstDataRendered={onFirstDataRendered}
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

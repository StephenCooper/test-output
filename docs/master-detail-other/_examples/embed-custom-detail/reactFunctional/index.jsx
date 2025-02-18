"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./style.css";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
import { MasterDetailModule } from "ag-grid-enterprise";
import DetailCellRenderer from "./detailCellRenderer.jsx";
ModuleRegistry.registerModules([
  RowApiModule,
  ClientSideRowModelModule,
  MasterDetailModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/master-detail-data.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const detailCellRenderer = useCallback(DetailCellRenderer, []);
  const [columnDefs, setColumnDefs] = useState([
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
  const defaultColDef = useMemo(() => {
    return {};
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    setTimeout(() => {
      params.api.forEachNode(function (node) {
        node.setExpanded(node.id === "1");
      });
    }, 1000);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
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

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
window.tearDownExample = () => root.unmount();

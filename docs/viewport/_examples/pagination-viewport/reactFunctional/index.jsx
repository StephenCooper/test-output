"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  CellStyleModule,
  HighlightChangesModule,
  ModuleRegistry,
  PaginationModule,
  RowSelectionModule,
  ValidationModule,
} from "ag-grid-community";
import { ViewportRowModelModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  RowSelectionModule,
  PaginationModule,
  CellStyleModule,
  ViewportRowModelModule,
  HighlightChangesModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

function numberFormatter(params) {
  if (typeof params.value === "number") {
    return params.value.toFixed(2);
  } else {
    return params.value;
  }
}

class RowIndexRenderer {
  eGui;
  init(params) {
    this.eGui = document.createElement("div");
    this.eGui.textContent = "" + params.node.rowIndex;
  }
  refresh(params) {
    return false;
  }
  getGui() {
    return this.eGui;
  }
}

const GridExample = () => {
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/stocks.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    // this col shows the row index, doesn't use any data from the row
    {
      headerName: "#",
      maxWidth: 80,
      cellRenderer: RowIndexRenderer,
    },
    { field: "code", maxWidth: 90 },
    { field: "name", minWidth: 220 },
    {
      field: "bid",
      cellClass: "cell-number",
      valueFormatter: numberFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      field: "mid",
      cellClass: "cell-number",
      valueFormatter: numberFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      field: "ask",
      cellClass: "cell-number",
      valueFormatter: numberFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      field: "volume",
      cellClass: "cell-number",
      cellRenderer: "agAnimateSlideCellRenderer",
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 140,
      sortable: false,
    };
  }, []);
  const getRowId = useCallback((params) => {
    // the code is unique, so perfect for the id
    return params.data.code;
  }, []);
  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
      headerCheckbox: false,
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
          rowModelType={"viewport"}
          pagination={true}
          paginationAutoPageSize={true}
          viewportRowModelPageSize={1}
          viewportRowModelBufferSize={0}
          getRowId={getRowId}
          rowSelection={rowSelection}
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

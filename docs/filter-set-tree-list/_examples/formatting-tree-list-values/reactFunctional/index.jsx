"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

function dateCellValueFormatter(params) {
  return params.value ? params.value.toLocaleDateString() : "";
}

function dateFloatingFilterValueFormatter(params) {
  return params.value ? params.value.toLocaleDateString() : "(Blanks)";
}

function treeListFormatter(pathKey, level, _parentPathKeys) {
  if (level === 1) {
    const date = new Date();
    date.setMonth(Number(pathKey) - 1);
    return date.toLocaleDateString(undefined, { month: "long" });
  }
  return pathKey || "(Blanks)";
}

function groupTreeListFormatter(pathKey, level, _parentPathKeys) {
  if (level === 0 && pathKey) {
    return pathKey + " (" + pathKey.substring(0, 2).toUpperCase() + ")";
  }
  return pathKey || "(Blanks)";
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: "country", rowGroup: true, hide: true },
    { field: "sport" },
    {
      field: "date",
      valueFormatter: dateCellValueFormatter,
      filter: "agSetColumnFilter",
      filterParams: {
        treeList: true,
        treeListFormatter: treeListFormatter,
        valueFormatter: dateFloatingFilterValueFormatter,
      },
    },
    {
      field: "gold",
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      floatingFilter: true,
      cellDataType: false,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      field: "athlete",
      filter: "agSetColumnFilter",
      filterParams: {
        treeList: true,
        keyCreator: (params) => (params.value ? params.value.join("#") : null),
        treeListFormatter: groupTreeListFormatter,
      },
      minWidth: 200,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => {
        const randomDays = [1, 4, 10, 15, 18];
        setRowData([
          {},
          ...data.map((row) => {
            // generate pseudo-random dates
            const dateParts = row.date.split("/");
            const randomMonth =
              parseInt(dateParts[1]) - Math.floor(Math.random() * 3);
            const newDate = new Date(
              parseInt(dateParts[2]),
              randomMonth,
              randomMonth + randomDays[Math.floor(Math.random() * 5)],
            );
            return { ...row, date: newDate };
          }),
        ]);
      });
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          onGridReady={onGridReady}
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

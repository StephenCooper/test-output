"use client";

import React, { useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  RowSelectionModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  NumberFilterModule,
  RowSelectionModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

function suppressEnter(params) {
  const KEY_ENTER = "Enter";
  const event = params.event;
  const key = event.key;
  const suppress = key === KEY_ENTER;
  return suppress;
}

function suppressNavigation(params) {
  const KEY_A = "A";
  const KEY_C = "C";
  const KEY_V = "V";
  const KEY_D = "D";
  const KEY_PAGE_UP = "PageUp";
  const KEY_PAGE_DOWN = "PageDown";
  const KEY_TAB = "Tab";
  const KEY_LEFT = "ArrowLeft";
  const KEY_UP = "ArrowUp";
  const KEY_RIGHT = "ArrowRight";
  const KEY_DOWN = "ArrowDown";
  const KEY_F2 = "F2";
  const KEY_BACKSPACE = "Backspace";
  const KEY_ESCAPE = "Escape";
  const KEY_SPACE = " ";
  const KEY_DELETE = "Delete";
  const KEY_PAGE_HOME = "Home";
  const KEY_PAGE_END = "End";
  const event = params.event;
  const key = event.key;
  let keysToSuppress = [
    KEY_PAGE_UP,
    KEY_PAGE_DOWN,
    KEY_TAB,
    KEY_F2,
    KEY_ESCAPE,
  ];
  const editingKeys = [
    KEY_LEFT,
    KEY_RIGHT,
    KEY_UP,
    KEY_DOWN,
    KEY_BACKSPACE,
    KEY_DELETE,
    KEY_SPACE,
    KEY_PAGE_HOME,
    KEY_PAGE_END,
  ];
  if (event.ctrlKey || event.metaKey) {
    keysToSuppress.push(KEY_A);
    keysToSuppress.push(KEY_V);
    keysToSuppress.push(KEY_C);
    keysToSuppress.push(KEY_D);
  }
  if (!params.editing) {
    keysToSuppress = keysToSuppress.concat(editingKeys);
  }
  if (
    params.column.getId() === "country" &&
    (key === KEY_UP || key === KEY_DOWN)
  ) {
    return false;
  }
  const suppress = keysToSuppress.some(function (suppressedKey) {
    return suppressedKey === key || key.toUpperCase() === suppressedKey;
  });
  return suppress;
}

const suppressUpDownNavigation = (params) => {
  const key = params.event.key;
  return key === "ArrowUp" || key === "ArrowDown";
};

const GridExample = () => {
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    {
      field: "athlete",
      minWidth: 170,
      suppressKeyboardEvent: (params) => {
        return suppressEnter(params) || suppressNavigation(params);
      },
    },
    { field: "age" },
    {
      field: "country",
      minWidth: 130,
      suppressHeaderKeyboardEvent: (params) => {
        const key = params.event.key;
        return key === "ArrowLeft" || key === "ArrowRight" || key === "Enter";
      },
    },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
      suppressKeyboardEvent: suppressNavigation,
      suppressHeaderKeyboardEvent: suppressUpDownNavigation,
    };
  }, []);
  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
      checkboxes: false,
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

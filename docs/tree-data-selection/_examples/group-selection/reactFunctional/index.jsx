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
import { getData } from "./data.jsx";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  QuickFilterModule,
  RowSelectionModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  TreeDataModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  RowSelectionModule,
  QuickFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  TreeDataModule,
  ValidationModule /* Development Only */,
]);

const getGroupSelectsValue = () => {
  return document.querySelector("#input-group-selection-mode")?.value ?? "self";
};

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(getData());
  const [columnDefs, setColumnDefs] = useState([
    { field: "created" },
    { field: "modified" },
    {
      field: "size",
      aggFunc: "sum",
      valueFormatter: (params) => {
        const sizeInKb = params.value / 1024;
        if (sizeInKb > 1024) {
          return `${+(sizeInKb / 1024).toFixed(2)} MB`;
        } else {
          return `${+sizeInKb.toFixed(2)} KB`;
        }
      },
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      headerName: "File Explorer",
      minWidth: 280,
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: {
        suppressCount: true,
      },
    };
  }, []);
  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
      groupSelects: "self",
    };
  }, []);
  const getDataPath = useCallback((data) => data.path, []);

  const onSelectionModeChange = useCallback(() => {
    gridRef.current.api.setGridOption("rowSelection", {
      mode: "multiRow",
      groupSelects: getGroupSelectsValue(),
    });
  }, []);

  const onQuickFilterChanged = useCallback(() => {
    gridRef.current.api.setGridOption(
      "quickFilterText",
      document.querySelector("#input-quick-filter")?.value,
    );
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="example-header">
          <label>
            <span>Group selects:</span>
            <select
              id="input-group-selection-mode"
              onChange={onSelectionModeChange}
            >
              <option value="self">self</option>
              <option value="descendants">descendants</option>
              <option value="filteredDescendants">filteredDescendants</option>
            </select>
          </label>

          <label>
            <span>Quick Filter:</span>
            <input
              type="text"
              id="input-quick-filter"
              onInput={onQuickFilterChanged}
            />
          </label>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            rowSelection={rowSelection}
            groupDefaultExpanded={-1}
            suppressAggFuncInHeader={true}
            treeData={true}
            getDataPath={getDataPath}
          />
        </div>
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

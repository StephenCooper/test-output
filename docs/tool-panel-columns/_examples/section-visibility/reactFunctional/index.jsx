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
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  PivotModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const gridRef = useRef(null);
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { headerName: "Name", field: "athlete", minWidth: 200 },
    { field: "age", enableRowGroup: true },
    { field: "country", minWidth: 200 },
    { field: "year" },
    { field: "date", suppressColumnsToolPanel: true, minWidth: 180 },
    { field: "sport", minWidth: 200 },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
    { field: "total", aggFunc: "sum" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      enablePivot: true,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 200,
    };
  }, []);
  const sideBar = useMemo(() => {
    return {
      toolPanels: [
        {
          id: "columns",
          labelDefault: "Columns",
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "agColumnsToolPanel",
          toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
            suppressPivots: true,
            suppressPivotMode: true,
            suppressColumnFilter: true,
            suppressColumnSelectAll: true,
            suppressColumnExpandAll: true,
          },
        },
      ],
      defaultToolPanel: "columns",
    };
  }, []);

  const showPivotModeSection = useCallback(() => {
    const columnToolPanel = gridRef.current.api.getToolPanelInstance("columns");
    columnToolPanel.setPivotModeSectionVisible(true);
  }, []);

  const showRowGroupsSection = useCallback(() => {
    const columnToolPanel = gridRef.current.api.getToolPanelInstance("columns");
    columnToolPanel.setRowGroupsSectionVisible(true);
  }, []);

  const showValuesSection = useCallback(() => {
    const columnToolPanel = gridRef.current.api.getToolPanelInstance("columns");
    columnToolPanel.setValuesSectionVisible(true);
  }, []);

  const showPivotSection = useCallback(() => {
    const columnToolPanel = gridRef.current.api.getToolPanelInstance("columns");
    columnToolPanel.setPivotSectionVisible(true);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div>
          <span className="button-group">
            <button onClick={showPivotModeSection}>
              Show Pivot Mode Section
            </button>
            <button onClick={showRowGroupsSection}>
              Show Row Groups Section
            </button>
            <button onClick={showValuesSection}>Show Values Section</button>
            <button onClick={showPivotSection}>Show Pivot Section</button>
          </span>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            sideBar={sideBar}
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

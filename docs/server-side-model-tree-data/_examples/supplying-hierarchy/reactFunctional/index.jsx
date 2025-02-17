"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, ValidationModule } from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
  TreeDataModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ColumnsToolPanelModule,
  TreeDataModule,
  ColumnMenuModule,
  ContextMenuModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/tree-data.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "employeeId", hide: true },
    { field: "employeeName", hide: true },
    { field: "jobTitle" },
    { field: "employmentType" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      width: 240,
      flex: 1,
      sortable: false,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      field: "employeeName",
      cellRendererParams: {
        innerRenderer: (params) => {
          // display employeeName rather than group key (employeeId)
          return params.data.employeeName;
        },
      },
    };
  }, []);
  const isServerSideGroupOpenByDefault = useCallback((params) => {
    // open first two levels by default
    return params.rowNode.level < 2;
  }, []);
  const isServerSideGroup = useCallback((dataItem) => {
    // indicate if node is a group
    return !!dataItem.underlings;
  }, []);
  const getServerSideGroupKey = useCallback((dataItem) => {
    // specify which group key to use
    return dataItem.employeeId;
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={data}
          loading={loading}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          rowModelType={"serverSide"}
          treeData={true}
          isServerSideGroupOpenByDefault={isServerSideGroupOpenByDefault}
          isServerSideGroup={isServerSideGroup}
          getServerSideGroupKey={getServerSideGroupKey}
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

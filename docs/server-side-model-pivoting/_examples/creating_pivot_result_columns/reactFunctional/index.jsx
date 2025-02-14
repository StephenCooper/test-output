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
import { FakeServer } from "./fakeServer.jsx";
import {
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const getServerSideDatasource = (server) => {
  return {
    getRows: (params) => {
      const request = params.request;
      console.log("[Datasource] - rows requested by grid: ", params.request);
      const response = server.getData(request);
      // add pivot results cols to the grid
      addPivotResultCols(request, response, params.api);
      // simulating real server call with a 500ms delay
      setTimeout(() => {
        if (response.success) {
          // supply data to grid
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          params.fail();
        }
      }, 500);
    },
  };
};

const addPivotResultCols = (request, response, api) => {
  // check if pivot colDefs already exist
  const existingPivotColDefs = api.getPivotResultColumns();
  if (existingPivotColDefs && existingPivotColDefs.length > 0) {
    return;
  }
  // create pivot colDef's based of data returned from the server
  const pivotResultColumns = createPivotResultColumns(
    request,
    response.pivotFields,
  );
  // supply pivot result columns to the grid
  api.setPivotResultColumns(pivotResultColumns);
};

const addColDef = (colId, parts, res, request) => {
  if (parts.length === 0) return [];
  const first = parts[0];
  const existing = res.find((r) => "groupId" in r && r.groupId === first);
  if (existing) {
    existing["children"] = addColDef(
      colId,
      parts.slice(1),
      existing.children,
      request,
    );
  } else {
    const colDef = {};
    const isGroup = parts.length > 1;
    if (isGroup) {
      colDef["groupId"] = first;
      colDef["headerName"] = first;
    } else {
      const valueCol = request.valueCols.find((r) => r.field === first);
      if (valueCol) {
        colDef["colId"] = colId;
        colDef["headerName"] = valueCol.displayName;
        colDef["field"] = colId;
      }
    }
    const children = addColDef(colId, parts.slice(1), [], request);
    if (children.length > 0) {
      colDef["children"] = children;
    }
    res.push(colDef);
  }
  return res;
};

const createPivotResultColumns = (request, pivotFields) => {
  if (request.pivotMode && request.pivotCols.length > 0) {
    const pivotResultCols = [];
    pivotFields.forEach((field) =>
      addColDef(field, field.split("_"), pivotResultCols, request),
    );
    return pivotResultCols;
  }
  return [];
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "country", rowGroup: true },
    { field: "year", pivot: true },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 200,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => {
        // setup the fake server with entire dataset
        const fakeServer = new FakeServer(data);
        // create datasource with a reference to the fake server
        const datasource = getServerSideDatasource(fakeServer);
        // register the datasource with the grid
        params.api.setGridOption("serverSideDatasource", datasource);
      });
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          rowModelType={"serverSide"}
          pivotMode={true}
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

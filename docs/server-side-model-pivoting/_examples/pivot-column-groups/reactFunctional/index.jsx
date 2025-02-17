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
import { ModuleRegistry, ValidationModule } from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
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
      // simulating real server call with a 500ms delay
      setTimeout(() => {
        if (response.success) {
          // supply data to grid
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
            pivotResultFields: response.pivotFields,
          });
        } else {
          params.fail();
        }
      }, 500);
    },
  };
};

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "country", rowGroup: true },
    { field: "sport", rowGroup: true },
    { field: "year", pivot: true },
    { field: "total", aggFunc: "sum" },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      width: 150,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 200,
    };
  }, []);
  const processPivotResultColDef = useCallback((colDef) => {
    const pivotValueColumn = colDef.pivotValueColumn;
    if (!pivotValueColumn) return;
    // if column is not the total column, it should only be shown when expanded.
    // this will enable expandable column groups.
    if (pivotValueColumn.getColId() !== "total") {
      colDef.columnGroupShow = "open";
    }
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

  const expand = useCallback((key, open = false) => {
    if (key) {
      gridRef.current.api.setColumnGroupState([{ groupId: key, open: open }]);
      return;
    }
    const existingState = gridRef.current.api.getColumnGroupState();
    const expandedState = existingState.map((s) => ({
      groupId: s.groupId,
      open: open,
    }));
    gridRef.current.api.setColumnGroupState(expandedState);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button onClick={() => expand("2000", true)}>Expand 2000</button>
          <button onClick={() => expand("2000")}>Collapse 2000</button>
          <button onClick={() => expand(undefined, true)}>Expand All</button>
          <button onClick={() => expand(undefined)}>Collapse All</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            rowModelType={"serverSide"}
            pivotMode={true}
            processPivotResultColDef={processPivotResultColDef}
            onGridReady={onGridReady}
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

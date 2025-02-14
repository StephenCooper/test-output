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
import { FakeServer } from "./fakeServer.jsx";
import {
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  RowGroupingModule,
  RowGroupingPanelModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  RowGroupingModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  RowGroupingPanelModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

let selectionState = {
  selectAllChildren: false,
  toggledNodes: [],
};

const getServerSideDatasource = (server) => {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      const response = server.getData(params.request);
      // adding delay to simulate real server call
      setTimeout(() => {
        if (response.success) {
          // call the success callback
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          // inform the grid request failed
          params.fail();
        }
      }, 200);
    },
  };
};

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "country", enableRowGroup: true, rowGroup: true, hide: true },
    { field: "year", enableRowGroup: true, rowGroup: true, hide: true },
    { field: "athlete", hide: true },
    { field: "sport", enableRowGroup: true, filter: "agTextColumnFilter" },
    { field: "gold", aggFunc: "sum", filter: "agNumberColumnFilter" },
    { field: "silver", aggFunc: "sum", filter: "agNumberColumnFilter" },
    { field: "bronze", aggFunc: "sum", filter: "agNumberColumnFilter" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      floatingFilter: true,
      flex: 1,
      minWidth: 120,
    };
  }, []);
  const getRowId = useCallback((params) => {
    if (params.data.id != null) {
      return "leaf-" + params.data.id;
    }
    const rowGroupCols = params.api.getRowGroupColumns();
    const rowGroupColIds = rowGroupCols.map((col) => col.getId()).join("-");
    const thisGroupCol = rowGroupCols[params.level];
    return (
      "group-" +
      rowGroupColIds +
      "-" +
      (params.parentKeys || []).join("-") +
      params.data[thisGroupCol.getColDef().field]
    );
  }, []);
  const isServerSideGroupOpenByDefault = useCallback((params) => {
    return (
      params.rowNode.key === "United States" ||
      String(params.rowNode.key) === "2004"
    );
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      field: "athlete",
      flex: 1,
      minWidth: 240,
    };
  }, []);
  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
      groupSelects: "descendants",
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => {
        // assign a unique ID to each data item
        data.forEach(function (item, index) {
          item.id = index;
        });
        // setup the fake server with entire dataset
        const fakeServer = new FakeServer(data);
        // create datasource with a reference to the fake server
        const datasource = getServerSideDatasource(fakeServer);
        // register the datasource with the grid
        params.api.setGridOption("serverSideDatasource", datasource);
      });
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    params.api.setServerSideSelectionState({
      selectAllChildren: true,
      toggledNodes: [
        {
          nodeId: "group-country-year-United States",
          selectAllChildren: false,
          toggledNodes: [
            {
              nodeId: "group-country-year-United States2004",
              selectAllChildren: true,
            },
          ],
        },
      ],
    });
  }, []);

  const saveSelectionState = useCallback(() => {
    selectionState = gridRef.current.api.getServerSideSelectionState();
    console.log(JSON.stringify(selectionState, null, 2));
  }, [selectionState]);

  const loadSelectionState = useCallback(() => {
    gridRef.current.api.setServerSideSelectionState(selectionState);
  }, [selectionState]);

  const clearSelectionState = useCallback(() => {
    gridRef.current.api.setServerSideSelectionState({
      selectAllChildren: false,
      toggledNodes: [],
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button onClick={saveSelectionState}>Save Selection</button>
          <button onClick={loadSelectionState}>Load Selection</button>
          <button onClick={clearSelectionState}>Clear Selection</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            getRowId={getRowId}
            isServerSideGroupOpenByDefault={isServerSideGroupOpenByDefault}
            autoGroupColumnDef={autoGroupColumnDef}
            rowModelType={"serverSide"}
            rowSelection={rowSelection}
            rowGroupPanelShow={"always"}
            suppressAggFuncInHeader={true}
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
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

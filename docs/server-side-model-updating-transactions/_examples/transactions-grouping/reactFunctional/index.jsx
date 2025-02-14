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
  changePortfolioOnServer,
  createRowOnServer,
  data,
  deletePortfolioOnServer,
} from "./data.jsx";
import { FakeServer } from "./fakeServer.jsx";
import {
  HighlightChangesModule,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  HighlightChangesModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  ValidationModule /* Development Only */,
]);

const getServerSideDatasource = (server) => {
  return {
    getRows: (params) => {
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
      }, 300);
    },
  };
};

const logResults = (transaction, result) => {
  console.log(
    "[Example] - Applied transaction:",
    transaction,
    "Result:",
    result,
  );
};

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "tradeId" },
    { field: "portfolio", hide: true, rowGroup: true },
    { field: "book" },
    { field: "previous" },
    { field: "current" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      enableCellChangeFlash: true,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 220,
    };
  }, []);
  const isServerSideGroupOpenByDefault = useCallback((params) => {
    return (
      params.rowNode.key === "Aggressive" || params.rowNode.key === "Hybrid"
    );
  }, []);
  const getRowId = useCallback((params) => {
    if (params.level === 0) {
      return params.data.portfolio;
    }
    return String(params.data.tradeId);
  }, []);

  const onGridReady = useCallback((params) => {
    // setup the fake server
    const server = new FakeServer(data);
    // create datasource with a reference to the fake server
    const datasource = getServerSideDatasource(server);
    // register the datasource with the grid
    params.api.setGridOption("serverSideDatasource", datasource);
  }, []);

  const deleteAllHybrid = useCallback(() => {
    // NOTE: real applications would be better served listening to a stream of changes from the server instead
    const serverResponse = deletePortfolioOnServer("Hybrid");
    if (!serverResponse.success) {
      console.warn("Nothing has changed on the server");
      return;
    }
    if (serverResponse) {
      // apply tranaction to keep grid in sync
      const transaction = {
        remove: [{ portfolio: "Hybrid" }],
      };
      const result =
        gridRef.current.api.applyServerSideTransaction(transaction);
      logResults(transaction, result);
    }
  }, [deletePortfolioOnServer]);

  const createOneAggressive = useCallback(() => {
    // NOTE: real applications would be better served listening to a stream of changes from the server instead
    const serverResponse = createRowOnServer("Aggressive", "Aluminium", "GL-1");
    if (!serverResponse.success) {
      console.warn("Nothing has changed on the server");
      return;
    }
    if (serverResponse.newGroupCreated) {
      // if a new group had to be created, reflect in the grid
      const transaction = {
        route: [],
        add: [{ portfolio: "Aggressive" }],
      };
      const result =
        gridRef.current.api.applyServerSideTransaction(transaction);
      logResults(transaction, result);
    } else {
      // if the group already existed, add rows to it
      const transaction = {
        route: ["Aggressive"],
        add: [serverResponse.newRecord],
      };
      const result =
        gridRef.current.api.applyServerSideTransaction(transaction);
      logResults(transaction, result);
    }
  }, [createRowOnServer]);

  const updateAggressiveToHybrid = useCallback(() => {
    // NOTE: real applications would be better served listening to a stream of changes from the server instead
    const serverResponse = changePortfolioOnServer("Aggressive", "Hybrid");
    if (!serverResponse.success) {
      console.warn("Nothing has changed on the server");
      return;
    }
    const transaction = {
      remove: [{ portfolio: "Aggressive" }],
    };
    // aggressive group no longer exists, so delete the group
    const result = gridRef.current.api.applyServerSideTransaction(transaction);
    logResults(transaction, result);
    if (serverResponse.newGroupCreated) {
      // hybrid group didn't exist, so just create the new group
      const t = {
        route: [],
        add: [{ portfolio: "Hybrid" }],
      };
      const r = gridRef.current.api.applyServerSideTransaction(t);
      logResults(t, r);
    } else {
      // hybrid group already existed, add rows to it
      const t = {
        route: ["Hybrid"],
        add: serverResponse.updatedRecords,
      };
      const r = gridRef.current.api.applyServerSideTransaction(t);
      logResults(t, r);
    }
  }, [changePortfolioOnServer]);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button onClick={createOneAggressive}>Add new 'Aggressive'</button>
          <button onClick={updateAggressiveToHybrid}>
            Move all 'Aggressive' to 'Hybrid'
          </button>
          <button onClick={deleteAllHybrid}>Remove all 'Hybrid'</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            isServerSideGroupOpenByDefault={isServerSideGroupOpenByDefault}
            getRowId={getRowId}
            rowModelType={"serverSide"}
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

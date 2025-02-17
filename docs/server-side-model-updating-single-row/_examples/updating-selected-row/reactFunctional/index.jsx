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
  HighlightChangesModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  HighlightChangesModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

let versionCounter = 0;

const getServerSideDatasource = (server) => {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      const response = server.getData(params.request);
      const dataWithVersion = response.rows.map((rowData) => {
        return {
          ...rowData,
          version:
            versionCounter + " - " + versionCounter + " - " + versionCounter,
        };
      });
      // adding delay to simulate real server call
      setTimeout(() => {
        if (response.success) {
          // call the success callback
          params.success({
            rowData: dataWithVersion,
            rowCount: response.lastRow,
          });
        } else {
          // inform the grid request failed
          params.fail();
        }
      }, 1000);
    },
  };
};

const GridExample = () => {
  const gridRef = useRef(null);
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete" },
    { field: "country" },
    { field: "date" },
    { field: "version" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      sortable: false,
      enableCellChangeFlash: true,
    };
  }, []);
  const rowSelection = useMemo(() => {
    return { mode: "multiRow", headerCheckbox: false };
  }, []);
  const getRowId = useCallback(
    (params) => `${params.data.athlete}-${params.data.date}`,
    [],
  );

  const updateSelectedRows = useCallback(() => {
    versionCounter += 1;
    const version =
      versionCounter + " - " + versionCounter + " - " + versionCounter;
    const nodesToUpdate = gridRef.current.api.getSelectedNodes();
    nodesToUpdate.forEach((node) => {
      node.updateData({ ...node.data, version });
    });
  }, [versionCounter]);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button onClick={updateSelectedRows}>Update Selected Rows</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowSelection={rowSelection}
            rowModelType={"serverSide"}
            cacheBlockSize={75}
            getRowId={getRowId}
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

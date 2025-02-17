"use client";

import React, { useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, ValidationModule } from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ServerSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const getServerSideDatasource = (server) => {
  return {
    getRows: (params) => {
      // adding delay to simulate real server call
      setTimeout(() => {
        const response = server.getResponse(params.request);
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
      }, 4000);
    },
  };
};

const getFakeServer = (allData) => {
  return {
    getResponse: (request) => {
      console.log(
        "asking for rows: " + request.startRow + " to " + request.endRow,
      );
      // take a slice of the total rows
      const rowsThisPage = allData.slice(request.startRow, request.endRow);
      const lastRow = allData.length;
      return {
        success: true,
        rows: rowsThisPage,
        lastRow: lastRow,
      };
    },
  };
};

const GridExample = () => {
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "country", flex: 4 },
    { field: "sport", flex: 4 },
    { field: "year", flex: 3 },
    { field: "gold", aggFunc: "sum", flex: 2 },
    { field: "silver", aggFunc: "sum", flex: 2 },
    { field: "bronze", aggFunc: "sum", flex: 2 },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      minWidth: 75,
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
          rowModelType={"serverSide"}
          suppressServerSideFullWidthLoadingRow={true}
          cacheBlockSize={5}
          maxBlocksInCache={0}
          rowBuffer={0}
          maxConcurrentDatasourceRequests={1}
          blockLoadDebounceMillis={200}
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

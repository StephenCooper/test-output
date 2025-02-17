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
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  RowApiModule,
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
    { field: "date" },
    { field: "country" },
    { field: "version" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      sortable: false,
      enableCellChangeFlash: true,
    };
  }, []);
  const getRowId = useCallback(
    (params) => `${params.data.athlete}-${params.data.date}`,
    [],
  );

  const updateRows = useCallback(
    (athlete, date) => {
      versionCounter += 1;
      gridRef.current.api.forEachNode((rowNode) => {
        if (athlete != null && rowNode.data.athlete !== athlete) {
          return;
        }
        if (date != null && rowNode.data.date !== date) {
          return;
        }
        // arbitrarily update some data
        const updated = rowNode.data;
        updated.version =
          versionCounter + " - " + versionCounter + " - " + versionCounter;
        // directly update data in rowNode
        rowNode.updateData(updated);
      });
    },
    [versionCounter],
  );

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button onClick={() => updateRows("Michael Phelps")}>
            Update All Michael Phelps Records
          </button>
          <button onClick={() => updateRows("Michael Phelps", "29/08/2004")}>
            Update Michael Phelps, 29/08/2004
          </button>
          <button onClick={() => updateRows("Aleksey Nemov", "01/10/2000")}>
            Update Aleksey Nemov, 01/10/2000
          </button>
          <button onClick={() => updateRows(undefined, "12/08/2012")}>
            Update All Records Dated 12/08/2012
          </button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
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

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
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsRequest,
  ModuleRegistry,
  RowModelType,
  ScrollApiModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ScrollApiModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const createServerSideDatasource: (server: any) => IServerSideDatasource = (
  server: any,
) => {
  return {
    getRows: (params) => {
      console.log(
        "[Datasource] - rows requested by grid: startRow = " +
          params.request.startRow +
          ", endRow = " +
          params.request.endRow,
      );
      // get data for request from our fake server
      const response = server.getData(params.request);
      // simulating real server call with a 500ms delay
      setTimeout(() => {
        if (response.success) {
          // supply rows for requested block to grid
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          params.fail();
        }
      }, 1000);
    },
  };
};

function createFakeServer(allData: any[]) {
  return {
    getData: (request: IServerSideGetRowsRequest) => {
      // in this simplified fake server all rows are contained in an array
      const requestedRows = allData.slice(request.startRow, request.endRow);
      return {
        success: true,
        rows: requestedRows,
        lastRow: allData.length,
      };
    },
  };
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { headerName: "Index", valueGetter: "node.rowIndex", minWidth: 100 },
    { field: "athlete", minWidth: 150 },
    { field: "country", minWidth: 150 },
    { field: "year" },
    { field: "sport", minWidth: 120 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 80,
      sortable: false,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => {
        // setup the fake server with entire dataset
        const fakeServer = createFakeServer(data);
        // create datasource with a reference to the fake server
        const datasource = createServerSideDatasource(fakeServer);
        // register the datasource with the grid
        params.api!.setGridOption("serverSideDatasource", datasource);
        // scroll the grid down until row 5000 is at the top of the viewport
        params.api!.ensureIndexVisible(5000, "top");
      });
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowModelType={"serverSide"}
          serverSideInitialRowCount={5500}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
(window as any).tearDownExample = () => root.unmount();

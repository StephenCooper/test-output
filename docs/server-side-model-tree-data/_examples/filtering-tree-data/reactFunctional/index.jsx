"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ServerSideRowModelModule,
  SetFilterModule,
  TreeDataModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  TreeDataModule,
  ServerSideRowModelModule,
  SetFilterModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);

function valueGetter(params) {
  // server is returning a string, so need to convert to `Date`.
  // could instead do this inside `IServerSideDatasource.getRows`
  return params.data.startDate ? new Date(params.data.startDate) : null;
}

function cellValueFormatter(params) {
  return params.value ? params.value.toLocaleDateString() : null;
}

function floatingFilterValueFormatter(params) {
  return params.value ? params.value.toLocaleDateString() : "(Blanks)";
}

function dateKeyCreator(params) {
  // this is what is being sent in the Filter Model to the server, so want the matching format
  return params.value ? params.value.toISOString() : null;
}

function treeDataKeyCreator(params) {
  // tree data group filter value is a string[], so convert to a unique string
  return params.value ? params.value.join(",") : null;
}

let fakeServer;

const getServerSideDatasource = (server) => {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      // simulating real server call with a 500ms delay
      setTimeout(() => {
        // get data for request from our fake server
        const response = server.getData(params.request);
        if (response.success) {
          // supply rows for requested block to grid
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

function getDatesAsync(params) {
  if (!fakeServer) {
    // wait for init
    setTimeout(() => getDatesAsync(params), 500);
    return;
  }
  let dates = fakeServer.getDates();
  if (dates) {
    // values need to match the cell value (what the `valueGetter` returns)
    dates = dates.map((isoDateString) =>
      isoDateString ? new Date(isoDateString) : isoDateString,
    );
  }
  // simulating real server call with a 500ms delay
  setTimeout(() => {
    params.success(dates);
  }, 500);
}

function getEmployeesAsync(params) {
  if (!fakeServer) {
    // wait for init
    setTimeout(() => getEmployeesAsync(params), 500);
    return;
  }
  const employees = fakeServer.getEmployees();
  // simulating real server call with a 500ms delay
  setTimeout(() => {
    params.success(employees);
  }, 500);
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "employeeId", hide: true },
    { field: "employeeName", hide: true },
    { field: "employmentType" },
    {
      field: "startDate",
      valueGetter: valueGetter,
      valueFormatter: cellValueFormatter,
      filter: "agSetColumnFilter",
      filterParams: {
        treeList: true,
        excelMode: "windows",
        keyCreator: dateKeyCreator,
        valueFormatter: floatingFilterValueFormatter,
        values: getDatesAsync,
      },
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      width: 240,
      filter: "agTextColumnFilter",
      floatingFilter: true,
      flex: 1,
      sortable: false,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      field: "employeeName",
      filter: "agSetColumnFilter",
      filterParams: {
        treeList: true,
        excelMode: "windows",
        keyCreator: treeDataKeyCreator,
        values: getEmployeesAsync,
      },
    };
  }, []);
  const isServerSideGroupOpenByDefault = useCallback((params) => {
    // open first level by default
    return params.rowNode.level === 0;
  }, []);
  const isServerSideGroup = useCallback((dataItem) => {
    // indicate if node is a group
    return dataItem.underlings;
  }, []);
  const getServerSideGroupKey = useCallback((dataItem) => {
    // specify which group key to use
    return dataItem.employeeName;
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/tree-data.json")
      .then((resp) => resp.json())
      .then((data) => {
        // setup the fake server with entire dataset
        fakeServer = new FakeServer(data);
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
          treeData={true}
          isServerSideGroupOpenByDefault={isServerSideGroupOpenByDefault}
          isServerSideGroup={isServerSideGroup}
          getServerSideGroupKey={getServerSideGroupKey}
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

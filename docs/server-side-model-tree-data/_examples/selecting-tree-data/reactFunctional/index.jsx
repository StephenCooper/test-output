"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./styles.css";
import {
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
  TreeDataModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ServerSideRowModelApiModule,
  TextFilterModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  TreeDataModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

let fakeServer;

function createFakeServer(fakeServerData, api) {
  const getDataAtRoute = (route) => {
    let mutableRoute = [...route];
    let target = { underlings: fakeServerData };
    while (mutableRoute.length) {
      const nextRoute = mutableRoute[0];
      mutableRoute = mutableRoute.slice(1);
      target = target.underlings.find((e) => e.employeeName === nextRoute);
    }
    return target;
  };
  const sanitizeRowForGrid = (d) => {
    return {
      group: !!d.underlings && !!d.underlings.length,
      employeeId: d.employeeId,
      employeeName: d.employeeName,
      employmentType: d.employmentType,
      startDate: d.startDate,
    };
  };
  fakeServer = {
    getData: (request) => {
      const extractRowsFromData = (groupKeys, data) => {
        if (groupKeys.length === 0) {
          return data.map(sanitizeRowForGrid);
        }
        const key = groupKeys[0];
        for (let i = 0; i < data.length; i++) {
          if (data[i].employeeName === key) {
            return extractRowsFromData(
              groupKeys.slice(1),
              data[i].underlings.slice(),
            );
          }
        }
      };
      return extractRowsFromData(request.groupKeys, fakeServerData);
    },
    addChildRow: (route, newRow) => {
      const target = getDataAtRoute(route);
      if (!target.underlings || target.underlings.length === 0) {
        target.underlings = [newRow];
        // update the parent row via transaction
        api.applyServerSideTransaction({
          route: route.slice(0, route.length - 1),
          update: [sanitizeRowForGrid(target)],
        });
      } else {
        target.underlings.push(newRow);
        // add the child row via transaction
        api.applyServerSideTransaction({
          route,
          add: [sanitizeRowForGrid(newRow)],
        });
      }
    },
    toggleEmployment: (route) => {
      const target = getDataAtRoute(route);
      // update the data at the source
      target.employmentType =
        target.employmentType === "Contract" ? "Permanent" : "Contract";
      // inform the grid of the changes
      api.applyServerSideTransaction({
        route: route.slice(0, route.length - 1),
        update: [sanitizeRowForGrid(target)],
      });
    },
    removeEmployee: (route) => {
      const target = getDataAtRoute(route);
      const parent = getDataAtRoute(route.slice(0, route.length - 1));
      parent.underlings = parent.underlings.filter(
        (child) => child.employeeName !== target.employeeName,
      );
      if (parent.underlings.length === 0) {
        // update the parent row via transaction, as it's no longer a group
        api.applyServerSideTransaction({
          route: route.slice(0, route.length - 2),
          update: [sanitizeRowForGrid(parent)],
        });
      } else {
        // inform the grid of the changes
        api.applyServerSideTransaction({
          route: route.slice(0, route.length - 1),
          remove: [sanitizeRowForGrid(target)],
        });
      }
    },
    moveEmployee: (route, to) => {
      const target = getDataAtRoute(route);
      // remove employee from old group
      fakeServer.removeEmployee(route);
      // add employee to new group
      fakeServer.addChildRow(to, target);
    },
  };
  return fakeServer;
}

function createServerSideDatasource(fakeServer) {
  const dataSource = {
    getRows: (params) => {
      console.log("ServerSideDatasource.getRows: params = ", params);
      const request = params.request;
      const allRows = fakeServer.getData(request);
      const doingInfinite = request.startRow != null && request.endRow != null;
      const result = doingInfinite
        ? {
            rowData: allRows.slice(request.startRow, request.endRow),
            rowCount: allRows.length,
          }
        : { rowData: allRows };
      console.log("getRows: result = ", result);
      setTimeout(() => {
        params.success(result);
      }, 500);
    },
  };
  return dataSource;
}

const GridExample = () => {
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/tree-data.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const defaultColDef = useMemo(() => {
    return {
      width: 235,
      flex: 1,
      sortable: false,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      field: "employeeName",
    };
  }, []);
  const [columnDefs, setColumnDefs] = useState([
    { field: "employeeId", hide: true },
    { field: "employeeName", hide: true },
    { field: "employmentType" },
    { field: "startDate" },
  ]);
  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
      groupSelects: "descendants",
    };
  }, []);
  const isServerSideGroupOpenByDefault = useCallback((params) => {
    const isKathrynPowers =
      params.rowNode.level == 0 && params.data.employeeName == "Kathryn Powers";
    const isMabelWard =
      params.rowNode.level == 1 && params.data.employeeName == "Mabel Ward";
    return isKathrynPowers || isMabelWard;
  }, []);
  const getRowId = useCallback((row) => String(row.data.employeeId), []);
  const isServerSideGroup = useCallback((dataItem) => dataItem.group, []);
  const getServerSideGroupKey = useCallback(
    (dataItem) => dataItem.employeeName,
    [],
  );

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={gridStyle}>
          <AgGridReact
            rowData={data}
            loading={loading}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            rowModelType={"serverSide"}
            treeData={true}
            columnDefs={columnDefs}
            cacheBlockSize={10}
            rowSelection={rowSelection}
            isServerSideGroupOpenByDefault={isServerSideGroupOpenByDefault}
            getRowId={getRowId}
            isServerSideGroup={isServerSideGroup}
            getServerSideGroupKey={getServerSideGroupKey}
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

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
  TextFilterModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  TreeDataModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  ValidationModule /* Development Only */,
]);

let fakeServer;

const getRouteToNode = (rowNode) => {
  if (!rowNode.parent) {
    return [];
  }
  return [
    ...getRouteToNode(rowNode.parent),
    rowNode.key ? rowNode.key : rowNode.data.employeeName,
  ];
};

let latestId = 100000;

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
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "employeeId", hide: true },
    { field: "employeeName", hide: true },
    { field: "employmentType" },
    { field: "startDate" },
  ]);
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
  const rowSelection = useMemo(() => {
    return { mode: "singleRow" };
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

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/tree-data.json")
      .then((resp) => resp.json())
      .then((data) => {
        const adjustedData = [
          {
            employeeId: -1,
            employeeName: "Robert Peterson",
            employmentType: "Founder",
            startDate: "24/01/1990",
          },
          ...data,
        ];
        const fakeServer = createFakeServer(adjustedData, params.api);
        const datasource = createServerSideDatasource(fakeServer);
        params.api.setGridOption("serverSideDatasource", datasource);
      });
  }, []);

  const addToSelected = useCallback(() => {
    const selected = gridRef.current.api.getSelectedNodes()[0];
    if (!selected) {
      console.warn("No row was selected.");
      return;
    }
    const route = getRouteToNode(selected);
    const newRow = {
      employeeId: ++latestId,
      employeeName: "Bertrand Parker " + latestId,
      employmentType: "Permanent",
      startDate: "20/01/1999",
    };
    fakeServer.addChildRow(route, newRow);
  }, [latestId, fakeServer]);

  const updateSelected = useCallback(() => {
    const selected = gridRef.current.api.getSelectedNodes()[0];
    if (!selected) {
      console.warn("No row was selected.");
      return;
    }
    const route = getRouteToNode(selected);
    fakeServer.toggleEmployment(route);
  }, [fakeServer]);

  const deleteSelected = useCallback(() => {
    const selected = gridRef.current.api.getSelectedNodes()[0];
    if (!selected) {
      console.warn("No row was selected.");
      return;
    }
    const route = getRouteToNode(selected);
    fakeServer.removeEmployee(route);
  }, [fakeServer]);

  const moveSelected = useCallback(() => {
    const selected = gridRef.current.api.getSelectedNodes()[0];
    if (!selected) {
      console.warn("No row was selected.");
      return;
    }
    const route = getRouteToNode(selected);
    fakeServer.moveEmployee(route, ["Robert Peterson"]);
  }, [fakeServer]);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button onClick={addToSelected}>Add Child to Selected</button>
          <button onClick={updateSelected}>Update Selected</button>
          <button onClick={deleteSelected}>Delete Selected</button>
          <button onClick={moveSelected}>
            Move Selected to Robert Peterson
          </button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            rowModelType={"serverSide"}
            treeData={true}
            cacheBlockSize={10}
            rowSelection={rowSelection}
            isServerSideGroupOpenByDefault={isServerSideGroupOpenByDefault}
            getRowId={getRowId}
            isServerSideGroup={isServerSideGroup}
            getServerSideGroupKey={getServerSideGroupKey}
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

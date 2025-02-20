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
  ColDef,
  ColGroupDef,
  GetServerSideGroupKey,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  IServerSideGetRowsRequest,
  IsServerSideGroup,
  IsServerSideGroupOpenByDefaultParams,
  ModuleRegistry,
  RowModelType,
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
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  TreeDataModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  ValidationModule /* Development Only */,
]);

function createFakeServer(fakeServerData: any[]) {
  const fakeServer = {
    getData: (request: IServerSideGetRowsRequest) => {
      const extractRowsFromData: (groupKeys: string[], data: any[]) => any = (
        groupKeys: string[],
        data: any[],
      ) => {
        if (groupKeys.length === 0) {
          return data.map(function (d) {
            return {
              group: !!d.underlings,
              employeeId: d.employeeId + "",
              employeeName: d.employeeName,
              employmentType: d.employmentType,
              startDate: d.startDate,
            };
          });
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
  };
  return fakeServer;
}

function createServerSideDatasource(fakeServer: any) {
  const dataSource: IServerSideDatasource = {
    getRows: (params: IServerSideGetRowsParams) => {
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
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "employeeId", hide: true },
    { field: "employeeName", hide: true },
    { field: "employmentType" },
    { field: "startDate" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      width: 235,
      flex: 1,
      sortable: false,
    };
  }, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      field: "employeeName",
    };
  }, []);
  const isServerSideGroupOpenByDefault = useCallback(
    (params: IsServerSideGroupOpenByDefaultParams) => {
      const isKathrynPowers =
        params.rowNode.level == 0 &&
        params.data.employeeName == "Kathryn Powers";
      const isMabelWard =
        params.rowNode.level == 1 && params.data.employeeName == "Mabel Ward";
      return isKathrynPowers || isMabelWard;
    },
    [],
  );
  const isServerSideGroup = useCallback((dataItem: any) => {
    // indicate if node is a group
    return dataItem.group;
  }, []);
  const getServerSideGroupKey = useCallback((dataItem: any) => {
    // specify which group key to use
    return dataItem.employeeName;
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/tree-data.json")
      .then((resp) => resp.json())
      .then((data: any[]) => {
        const fakeServer = createFakeServer(data);
        const datasource = createServerSideDatasource(fakeServer);
        params.api!.setGridOption("serverSideDatasource", datasource);
      });
  }, []);

  const refreshCache = useCallback((route: string[]) => {
    gridRef.current!.api.refreshServerSide({ route: route, purge: true });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button onClick={() => refreshCache([])}>Refresh Everything</button>
          <button
            onClick={() => refreshCache(["Kathryn Powers", "Mabel Ward"])}
          >
            Refresh ['Kathryn Powers','Mabel Ward']
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
            isServerSideGroupOpenByDefault={isServerSideGroupOpenByDefault}
            isServerSideGroup={isServerSideGroup}
            getServerSideGroupKey={getServerSideGroupKey}
            onGridReady={onGridReady}
          />
        </div>
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

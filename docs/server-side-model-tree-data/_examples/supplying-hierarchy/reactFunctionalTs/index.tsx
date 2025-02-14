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
  GetServerSideGroupKey,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  IsServerSideGroup,
  IsServerSideGroupOpenByDefaultParams,
  ModuleRegistry,
  RowModelType,
  ValidationModule,
  createGrid,
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
  TreeDataModule,
  ColumnMenuModule,
  ContextMenuModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "employeeId", hide: true },
    { field: "employeeName", hide: true },
    { field: "jobTitle" },
    { field: "employmentType" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      width: 240,
      flex: 1,
      sortable: false,
    };
  }, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      field: "employeeName",
      cellRendererParams: {
        innerRenderer: (params: ICellRendererParams) => {
          // display employeeName rather than group key (employeeId)
          return params.data.employeeName;
        },
      },
    };
  }, []);
  const isServerSideGroupOpenByDefault = useCallback(
    (params: IsServerSideGroupOpenByDefaultParams) => {
      // open first two levels by default
      return params.rowNode.level < 2;
    },
    [],
  );
  const isServerSideGroup = useCallback((dataItem: any) => {
    // indicate if node is a group
    return !!dataItem.underlings;
  }, []);
  const getServerSideGroupKey = useCallback((dataItem: any) => {
    // specify which group key to use
    return dataItem.employeeId;
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/tree-data.json")
      .then((resp) => resp.json())
      .then((data: any[]) => {
        const datasource = createServerSideDatasource(data);
        params.api!.setGridOption("serverSideDatasource", datasource);
        function createServerSideDatasource(data: any) {
          const dataSource: IServerSideDatasource = {
            getRows: (params: IServerSideGetRowsParams) => {
              console.log("ServerSideDatasource.getRows: params = ", params);
              const request = params.request;
              if (request.groupKeys.length) {
                // this example doesn't need to support lower levels.
                params.fail();
                return;
              }
              const result = {
                rowData: data.slice(request.startRow, request.endRow),
              };
              console.log("getRows: result = ", result);
              setTimeout(() => {
                params.success(result);
                const recursivelyPopulateHierarchy = (
                  route: string[],
                  node: any,
                ) => {
                  if (node.underlings) {
                    params.api!.applyServerSideRowData({
                      route,
                      successParams: {
                        rowData: node.underlings,
                        rowCount: node.underlings.length,
                      },
                    });
                    node.underlings.forEach((child: any) => {
                      recursivelyPopulateHierarchy(
                        [...route, child.employeeId],
                        child,
                      );
                    });
                  }
                };
                result.rowData.forEach((topLevelNode: any) => {
                  recursivelyPopulateHierarchy(
                    [topLevelNode.employeeId],
                    topLevelNode,
                  );
                });
              }, 200);
            },
          };
          return dataSource;
        }
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

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);

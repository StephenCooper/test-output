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
  ModuleRegistry,
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

  const [columnDefs, setColumnDefs] = useState([
    { field: "employeeId", hide: true },
    { field: "employeeName", hide: true },
    { field: "jobTitle" },
    { field: "employmentType" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      width: 240,
      flex: 1,
      sortable: false,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      field: "employeeName",
      cellRendererParams: {
        innerRenderer: (params) => {
          // display employeeName rather than group key (employeeId)
          return params.data.employeeName;
        },
      },
    };
  }, []);
  const isServerSideGroupOpenByDefault = useCallback((params) => {
    // open first two levels by default
    return params.rowNode.level < 2;
  }, []);
  const isServerSideGroup = useCallback((dataItem) => {
    // indicate if node is a group
    return !!dataItem.underlings;
  }, []);
  const getServerSideGroupKey = useCallback((dataItem) => {
    // specify which group key to use
    return dataItem.employeeId;
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/tree-data.json")
      .then((resp) => resp.json())
      .then((data) => {
        const datasource = createServerSideDatasource(data);
        params.api.setGridOption("serverSideDatasource", datasource);
        function createServerSideDatasource(data) {
          const dataSource = {
            getRows: (params) => {
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
                const recursivelyPopulateHierarchy = (route, node) => {
                  if (node.underlings) {
                    params.api.applyServerSideRowData({
                      route,
                      successParams: {
                        rowData: node.underlings,
                        rowCount: node.underlings.length,
                      },
                    });
                    node.underlings.forEach((child) => {
                      recursivelyPopulateHierarchy(
                        [...route, child.employeeId],
                        child,
                      );
                    });
                  }
                };
                result.rowData.forEach((topLevelNode) => {
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

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
window.tearDownExample = () => root.unmount();

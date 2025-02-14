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
  GetRowIdFunc,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  ModuleRegistry,
  NumberFilterModule,
  PaginationModule,
  RowModelType,
  RowSelectionOptions,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  RowGroupingPanelModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
import { IOlympicDataWithId } from "./interfaces";
ModuleRegistry.registerModules([
  PaginationModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  RowGroupingPanelModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

const getServerSideDatasource: (server: any) => IServerSideDatasource = (
  server: any,
) => {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      const response = server.getData(params.request);
      // adding delay to simulate real server call
      setTimeout(() => {
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
      }, 200);
    },
  };
};

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicDataWithId>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "country", enableRowGroup: true, rowGroup: true, hide: true },
    { field: "year", enableRowGroup: true },
    { field: "sport", enableRowGroup: true, filter: "agTextColumnFilter" },
    { field: "gold", aggFunc: "sum", filter: "agNumberColumnFilter" },
    { field: "silver", aggFunc: "sum", filter: "agNumberColumnFilter" },
    { field: "bronze", aggFunc: "sum", filter: "agNumberColumnFilter" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      floatingFilter: true,
      flex: 1,
      minWidth: 120,
    };
  }, []);
  const getRowId = useCallback((params) => {
    if (params.data.id != null) {
      return "leaf-" + params.data.id;
    }
    const rowGroupCols = params.api.getRowGroupColumns();
    const rowGroupColIds = rowGroupCols.map((col) => col.getId()).join("-");
    const thisGroupCol = rowGroupCols[params.level];
    return (
      "group-" +
      rowGroupColIds +
      "-" +
      (params.parentKeys || []).join("-") +
      params.data[thisGroupCol.getColDef().field as keyof IOlympicDataWithId]
    );
  }, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      field: "athlete",
      flex: 1,
      minWidth: 240,
    };
  }, []);
  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return {
      mode: "multiRow",
      selectAll: "all",
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicDataWithId[]) => {
        // assign a unique ID to each data item
        data.forEach(function (item: any, index: number) {
          item.id = index;
        });
        // setup the fake server with entire dataset
        const fakeServer = new FakeServer(data);
        // create datasource with a reference to the fake server
        const datasource = getServerSideDatasource(fakeServer);
        // register the datasource with the grid
        params.api!.setGridOption("serverSideDatasource", datasource);
      });
  }, []);

  const onSelectAllChanged = useCallback(() => {
    gridRef.current!.api.setGridOption("rowSelection", {
      mode: "multiRow",
      selectAll: document.querySelector<HTMLSelectElement>("#input-select-all")!
        .value as any,
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="example-header">
          <label>
            <span>Select All:</span>
            <select id="input-select-all" onChange={onSelectAllChanged}>
              <option>all</option>
              <option>filtered</option>
              <option>currentPage</option>
            </select>
          </label>
        </div>

        <div style={gridStyle}>
          <AgGridReact<IOlympicDataWithId>
            ref={gridRef}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            getRowId={getRowId}
            autoGroupColumnDef={autoGroupColumnDef}
            rowGroupPanelShow={"always"}
            rowModelType={"serverSide"}
            rowSelection={rowSelection}
            suppressAggFuncInHeader={true}
            pagination={true}
            paginationPageSize={20}
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

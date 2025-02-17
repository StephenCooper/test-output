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
  NumberFilterModule,
  PaginationModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  RowGroupingPanelModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  PaginationModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  RowGroupingPanelModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const getServerSideDatasource = (server) => {
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
  const gridRef = useRef(null);
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "country", enableRowGroup: true, rowGroup: true, hide: true },
    { field: "year", enableRowGroup: true },
    { field: "sport", enableRowGroup: true, filter: "agTextColumnFilter" },
    { field: "gold", aggFunc: "sum", filter: "agNumberColumnFilter" },
    { field: "silver", aggFunc: "sum", filter: "agNumberColumnFilter" },
    { field: "bronze", aggFunc: "sum", filter: "agNumberColumnFilter" },
  ]);
  const defaultColDef = useMemo(() => {
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
      params.data[thisGroupCol.getColDef().field]
    );
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      field: "athlete",
      flex: 1,
      minWidth: 240,
    };
  }, []);
  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
      selectAll: "all",
    };
  }, []);

  const onSelectAllChanged = useCallback(() => {
    gridRef.current.api.setGridOption("rowSelection", {
      mode: "multiRow",
      selectAll: document.querySelector("#input-select-all").value,
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
          <AgGridReact
            ref={gridRef}
            rowData={data}
            loading={loading}
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

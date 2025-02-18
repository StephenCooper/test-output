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
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  PaginationModule,
  RowApiModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  PaginationModule,
  RowApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const gridRef = useRef(null);
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
    100,
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", minWidth: 180 },
    { field: "age" },
    { field: "country", minWidth: 150 },
    { headerName: "Group", valueGetter: "data.country.charAt(0)" },
    { field: "year" },
    { field: "date", minWidth: 150 },
    { field: "sport", minWidth: 180 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      filter: true,
    };
  }, []);

  const getDisplayedRowAtIndex = useCallback(() => {
    const rowNode = gridRef.current.api.getDisplayedRowAtIndex(0);
    console.log(
      "getDisplayedRowAtIndex(0) => " +
        rowNode.data.athlete +
        " " +
        rowNode.data.year,
    );
  }, []);

  const getDisplayedRowCount = useCallback(() => {
    const count = gridRef.current.api.getDisplayedRowCount();
    console.log("getDisplayedRowCount() => " + count);
  }, []);

  const printAllDisplayedRows = useCallback(() => {
    const count = gridRef.current.api.getDisplayedRowCount();
    console.log("## printAllDisplayedRows");
    for (let i = 0; i < count; i++) {
      const rowNode = gridRef.current.api.getDisplayedRowAtIndex(i);
      console.log("row " + i + " is " + rowNode.data.athlete);
    }
  }, []);

  const printPageDisplayedRows = useCallback(() => {
    const rowCount = gridRef.current.api.getDisplayedRowCount();
    const lastGridIndex = rowCount - 1;
    const currentPage = gridRef.current.api.paginationGetCurrentPage();
    const pageSize = gridRef.current.api.paginationGetPageSize();
    const startPageIndex = currentPage * pageSize;
    let endPageIndex = (currentPage + 1) * pageSize - 1;
    if (endPageIndex > lastGridIndex) {
      endPageIndex = lastGridIndex;
    }
    console.log("## printPageDisplayedRows");
    for (let i = startPageIndex; i <= endPageIndex; i++) {
      const rowNode = gridRef.current.api.getDisplayedRowAtIndex(i);
      console.log("row " + i + " is " + rowNode.data.athlete);
    }
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button onClick={getDisplayedRowAtIndex}>Get Displayed Row 0</button>
          <button onClick={getDisplayedRowCount}>
            Get Displayed Row Count
          </button>
          <button onClick={printAllDisplayedRows}>
            Print All Displayed Rows
          </button>
          <button onClick={printPageDisplayedRows}>
            Print Page Displayed Rows
          </button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationAutoPageSize={true}
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

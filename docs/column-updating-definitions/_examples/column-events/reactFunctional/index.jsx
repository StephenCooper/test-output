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
  ColumnApiModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { PivotModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const getColumnDefs = () => {
  return [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ];
};

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const defaultColDef = useMemo(() => {
    return {
      width: 150,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    };
  }, []);
  const [columnDefs, setColumnDefs] = useState(getColumnDefs());

  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  const onSortChanged = useCallback((e) => {
    console.log("Event Sort Changed", e);
  }, []);

  const onColumnResized = useCallback((e) => {
    console.log("Event Column Resized", e);
  }, []);

  const onColumnVisible = useCallback((e) => {
    console.log("Event Column Visible", e);
  }, []);

  const onColumnPivotChanged = useCallback((e) => {
    console.log("Event Pivot Changed", e);
  }, []);

  const onColumnRowGroupChanged = useCallback((e) => {
    console.log("Event Row Group Changed", e);
  }, []);

  const onColumnValueChanged = useCallback((e) => {
    console.log("Event Value Changed", e);
  }, []);

  const onColumnMoved = useCallback((e) => {
    console.log("Event Column Moved", e);
  }, []);

  const onColumnPinned = useCallback((e) => {
    console.log("Event Column Pinned", e);
  }, []);

  const onBtSortOn = useCallback(() => {
    const columnDefs = getColumnDefs();
    columnDefs.forEach((colDef) => {
      if (colDef.field === "age") {
        colDef.sort = "desc";
      }
      if (colDef.field === "athlete") {
        colDef.sort = "asc";
      }
    });
    gridRef.current.api.setGridOption("columnDefs", columnDefs);
  }, []);

  const onBtSortOff = useCallback(() => {
    const columnDefs = getColumnDefs();
    columnDefs.forEach((colDef) => {
      colDef.sort = null;
    });
    gridRef.current.api.setGridOption("columnDefs", columnDefs);
  }, []);

  const onBtWidthNarrow = useCallback(() => {
    const columnDefs = getColumnDefs();
    columnDefs.forEach((colDef) => {
      if (colDef.field === "age" || colDef.field === "athlete") {
        colDef.width = 100;
      }
    });
    gridRef.current.api.setGridOption("columnDefs", columnDefs);
  }, []);

  const onBtWidthNormal = useCallback(() => {
    const columnDefs = getColumnDefs();
    columnDefs.forEach((colDef) => {
      colDef.width = 200;
    });
    gridRef.current.api.setGridOption("columnDefs", columnDefs);
  }, []);

  const onBtHide = useCallback(() => {
    const columnDefs = getColumnDefs();
    columnDefs.forEach((colDef) => {
      if (colDef.field === "age" || colDef.field === "athlete") {
        colDef.hide = true;
      }
    });
    gridRef.current.api.setGridOption("columnDefs", columnDefs);
  }, []);

  const onBtShow = useCallback(() => {
    const columnDefs = getColumnDefs();
    columnDefs.forEach((colDef) => {
      colDef.hide = false;
    });
    gridRef.current.api.setGridOption("columnDefs", columnDefs);
  }, []);

  const onBtPivotOn = useCallback(() => {
    gridRef.current.api.setGridOption("pivotMode", true);
    const columnDefs = getColumnDefs();
    columnDefs.forEach((colDef) => {
      if (colDef.field === "country") {
        colDef.pivot = true;
      }
    });
    gridRef.current.api.setGridOption("columnDefs", columnDefs);
  }, []);

  const onBtPivotOff = useCallback(() => {
    gridRef.current.api.setGridOption("pivotMode", false);
    const columnDefs = getColumnDefs();
    columnDefs.forEach((colDef) => {
      colDef.pivot = false;
    });
    gridRef.current.api.setGridOption("columnDefs", columnDefs);
  }, []);

  const onBtRowGroupOn = useCallback(() => {
    const columnDefs = getColumnDefs();
    columnDefs.forEach((colDef) => {
      if (colDef.field === "sport") {
        colDef.rowGroup = true;
      }
    });
    gridRef.current.api.setGridOption("columnDefs", columnDefs);
  }, []);

  const onBtRowGroupOff = useCallback(() => {
    const columnDefs = getColumnDefs();
    columnDefs.forEach((colDef) => {
      colDef.rowGroup = false;
    });
    gridRef.current.api.setGridOption("columnDefs", columnDefs);
  }, []);

  const onBtAggFuncOn = useCallback(() => {
    const columnDefs = getColumnDefs();
    columnDefs.forEach((colDef) => {
      if (
        colDef.field === "gold" ||
        colDef.field === "silver" ||
        colDef.field === "bronze"
      ) {
        colDef.aggFunc = "sum";
      }
    });
    gridRef.current.api.setGridOption("columnDefs", columnDefs);
  }, []);

  const onBtAggFuncOff = useCallback(() => {
    const columnDefs = getColumnDefs();
    columnDefs.forEach((colDef) => {
      colDef.aggFunc = null;
    });
    gridRef.current.api.setGridOption("columnDefs", columnDefs);
  }, []);

  const onBtPinnedOn = useCallback(() => {
    const columnDefs = getColumnDefs();
    columnDefs.forEach((colDef) => {
      if (colDef.field === "athlete") {
        colDef.pinned = "left";
      }
      if (colDef.field === "age") {
        colDef.pinned = "right";
      }
    });
    gridRef.current.api.setGridOption("columnDefs", columnDefs);
  }, []);

  const onBtPinnedOff = useCallback(() => {
    const columnDefs = getColumnDefs();
    columnDefs.forEach((colDef) => {
      colDef.pinned = null;
    });
    gridRef.current.api.setGridOption("columnDefs", columnDefs);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          <div className="test-button-row">
            <div className="test-button-group">
              <button onClick={onBtSortOn}>Sort On</button>
              <br />
              <button onClick={onBtSortOff}>Sort Off</button>
            </div>
            <div className="test-button-group">
              <button onClick={onBtWidthNarrow}>Width Narrow</button>
              <br />
              <button onClick={onBtWidthNormal}>Width Normal</button>
            </div>
            <div className="test-button-group">
              <button onClick={onBtHide}>Hide Cols</button>
              <br />
              <button onClick={onBtShow}>Show Cols</button>
            </div>
            <div className="test-button-group">
              <button onClick={onBtPivotOn}>Pivot On</button>
              <br />
              <button onClick={onBtPivotOff}>Pivot Off</button>
            </div>
            <div className="test-button-group">
              <button onClick={onBtRowGroupOn}>Row Group On</button>
              <br />
              <button onClick={onBtRowGroupOff}>Row Group Off</button>
            </div>
            <div className="test-button-group">
              <button onClick={onBtAggFuncOn}>Agg Func On</button>
              <br />
              <button onClick={onBtAggFuncOff}>Agg Func Off</button>
            </div>
            <div className="test-button-group">
              <button onClick={onBtPinnedOn}>Pinned On</button>
              <br />
              <button onClick={onBtPinnedOff}>Pinned Off</button>
            </div>
          </div>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={data}
            loading={loading}
            defaultColDef={defaultColDef}
            columnDefs={columnDefs}
            onSortChanged={onSortChanged}
            onColumnResized={onColumnResized}
            onColumnVisible={onColumnVisible}
            onColumnPivotChanged={onColumnPivotChanged}
            onColumnRowGroupChanged={onColumnRowGroupChanged}
            onColumnValueChanged={onColumnValueChanged}
            onColumnMoved={onColumnMoved}
            onColumnPinned={onColumnPinned}
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

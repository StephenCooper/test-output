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
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Athlete",
      children: [
        { field: "athlete" },
        { field: "country", columnGroupShow: "open" },
        { field: "sport", columnGroupShow: "open" },
        { field: "year", columnGroupShow: "open" },
        { field: "date", columnGroupShow: "open" },
      ],
    },
    {
      headerName: "Medals",
      children: [
        { field: "total", columnGroupShow: "closed" },
        { field: "gold", columnGroupShow: "open" },
        { field: "silver", columnGroupShow: "open" },
        { field: "bronze", columnGroupShow: "open" },
      ],
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      width: 150,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  const saveState = useCallback(() => {
    window.groupState = gridRef.current.api.getColumnGroupState();
    console.log("group state saved", window.groupState);
    console.log("column state saved");
  }, [window]);

  const restoreState = useCallback(() => {
    if (!window.groupState) {
      console.log("no columns state to restore by, you must save state first");
      return;
    }
    gridRef.current.api.setColumnGroupState(window.groupState);
    console.log("column state restored");
  }, [window]);

  const resetState = useCallback(() => {
    gridRef.current.api.resetColumnGroupState();
    console.log("column state reset");
  }, []);

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          <div className="example-section">
            Column State:
            <button onClick={saveState}>Save State</button>
            <button onClick={restoreState}>Restore State</button>
            <button onClick={resetState}>Reset State</button>
          </div>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
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

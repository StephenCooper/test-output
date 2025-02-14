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
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberEditorModule,
  ScrollApiModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ScrollApiModule,
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", width: 150, rowGroupIndex: 0 },
    { field: "age", width: 90, rowGroupIndex: 1 },
    { field: "country", width: 120, rowGroupIndex: 2 },
    { field: "year", width: 90 },
    { field: "date", width: 110, rowGroupIndex: 2 },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  const onRowGroupOpened = useCallback((event) => {
    if (event.expanded) {
      const rowNodeIndex = event.node.rowIndex;
      // factor in child nodes so we can scroll to correct position
      const childCount = event.node.childrenAfterSort
        ? event.node.childrenAfterSort.length
        : 0;
      const newIndex = rowNodeIndex + childCount;
      gridRef.current.api.ensureIndexVisible(newIndex);
    }
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          animateRows={false}
          groupDisplayType={"groupRows"}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          onRowGroupOpened={onRowGroupOpened}
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

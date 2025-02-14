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
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  ModuleRegistry,
  NumberFilterModule,
  RowApiModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule, SetFilterModule } from "ag-grid-enterprise";
import { createDataItem, getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  TextFilterModule,
  SetFilterModule,
  RowApiModule,
  HighlightChangesModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "name" },
    { field: "laptop" },
    {
      field: "fixed",
      enableCellChangeFlash: true,
    },
    {
      field: "value",
      enableCellChangeFlash: true,
      sort: "desc",
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      filter: true,
      floatingFilter: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api
      .setColumnFilterModel("fixed", {
        filterType: "set",
        values: ["true"],
      })
      .then(() => {
        params.api.onFilterChanged();
      });
    params.api.setGridOption("rowData", getData());
  }, []);

  const onBtnApply = useCallback(() => {
    const updatedItems: any[] = [];
    gridRef.current!.api.forEachNode((rowNode) => {
      const newValue = Math.floor(Math.random() * 100) + 10;
      const newBoolean = Boolean(Math.round(Math.random()));
      const newItem = createDataItem(
        rowNode.data.name,
        rowNode.data.laptop,
        newBoolean,
        newValue,
        rowNode.data.id,
      );
      updatedItems.push(newItem);
    });
    gridRef.current!.api.applyTransaction({ update: updatedItems });
  }, [createDataItem]);

  const onBtnRefreshModel = useCallback(() => {
    gridRef.current!.api.refreshClientSideRowModel("filter");
  }, []);

  const getRowId = useCallback((params) => {
    return String(params.data.id);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          <button onClick={onBtnApply}>Apply Transaction</button>
          <button onClick={onBtnRefreshModel}>Refresh Model</button>
        </div>

        <div style={gridStyle} className="test-grid">
          <AgGridReact
            ref={gridRef}
            getRowId={getRowId}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            suppressModelUpdateAfterUpdateTransaction={true}
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

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
  CellEditRequestEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { IOlympicDataWithId } from "./interfaces";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let rowImmutableStore: any[];

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicDataWithId[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 160 },
    { field: "age" },
    { field: "country", minWidth: 140 },
    { field: "year" },
    { field: "date", minWidth: 140 },
    { field: "sport", minWidth: 160 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
      editable: true,
    };
  }, []);
  const getRowId = useCallback(
    (params: GetRowIdParams) => String(params.data.id),
    [],
  );

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicDataWithId[]) => {
        data.forEach((item, index) => (item.id = index));
        rowImmutableStore = data;
        setRowData(rowImmutableStore);
      });
  }, []);

  const onCellEditRequest = useCallback(
    (event: CellEditRequestEvent) => {
      const data = event.data;
      const field = event.colDef.field;
      const newValue = event.newValue;
      const oldItem = rowImmutableStore.find((row) => row.id === data.id);
      if (!oldItem || !field) {
        return;
      }
      const newItem = { ...oldItem };
      newItem[field] = newValue;
      console.log("onCellEditRequest, updating " + field + " to " + newValue);
      rowImmutableStore = rowImmutableStore.map((oldItem) =>
        oldItem.id == newItem.id ? newItem : oldItem,
      );
      setRowData(rowImmutableStore);
    },
    [rowImmutableStore],
  );

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicDataWithId>
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          getRowId={getRowId}
          readOnlyEdit={true}
          onGridReady={onGridReady}
          onCellEditRequest={onCellEditRequest}
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
(window as any).tearDownExample = () => root.unmount();

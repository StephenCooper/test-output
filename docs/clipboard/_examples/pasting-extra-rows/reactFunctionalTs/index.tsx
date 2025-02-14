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
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  ProcessDataFromClipboardParams,
  RowApiModule,
  RowSelectionModule,
  RowSelectionOptions,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ColumnApiModule,
  RowApiModule,
  ClientSideRowModelApiModule,
  NumberEditorModule,
  TextEditorModule,
  RowSelectionModule,
  ClientSideRowModelModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { headerName: "Athlete", field: "athlete", width: 150 },
    { headerName: "Age", field: "age", width: 90 },
    { headerName: "Country", field: "country", width: 120 },
    { headerName: "Year", field: "year", width: 90 },
    { headerName: "Date", field: "date", width: 110 },
    { headerName: "Sport", field: "sport", width: 110 },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
    };
  }, []);
  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return {
      mode: "multiRow",
      checkboxes: false,
      headerCheckbox: false,
      enableClickSelection: true,
      copySelectedRows: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: any[]) => setRowData(data.slice(0, 8)));
  }, []);

  const processDataFromClipboard = useCallback(
    (params: ProcessDataFromClipboardParams): string[][] | null => {
      const data = [...params.data];
      const emptyLastRow =
        data[data.length - 1][0] === "" && data[data.length - 1].length === 1;
      if (emptyLastRow) {
        data.splice(data.length - 1, 1);
      }
      const lastIndex = params.api!.getDisplayedRowCount() - 1;
      const focusedCell = params.api!.getFocusedCell();
      const focusedIndex = focusedCell!.rowIndex;
      if (focusedIndex + data.length - 1 > lastIndex) {
        const resultLastIndex = focusedIndex + (data.length - 1);
        const numRowsToAdd = resultLastIndex - lastIndex;
        const rowsToAdd: any[] = [];
        for (let i = 0; i < numRowsToAdd; i++) {
          const index = data.length - 1;
          const row = data.slice(index, index + 1)[0];
          // Create row object
          const rowObject: any = {};
          let currentColumn: any = focusedCell!.column;
          row.forEach((item) => {
            if (!currentColumn) {
              return;
            }
            rowObject[currentColumn.colDef.field] = item;
            currentColumn = params.api!.getDisplayedColAfter(currentColumn);
          });
          rowsToAdd.push(rowObject);
        }
        params.api!.applyTransaction({ add: rowsToAdd });
      }
      return data;
    },
    [],
  );

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection={rowSelection}
          processDataFromClipboard={processDataFromClipboard}
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
(window as any).tearDownExample = () => root.unmount();

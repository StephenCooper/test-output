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
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  IDatasource,
  IGetRowsParams,
  InfiniteRowModelModule,
  ModuleRegistry,
  RowModelType,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ColumnApiModule,
  RowSelectionModule,
  InfiniteRowModelModule,
  ValidationModule /* Development Only */,
]);

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

function getColumnDefs() {
  const columnDefs: ColDef[] = [
    { headerName: "#", width: 80, valueGetter: "node.rowIndex" },
  ];
  ALPHABET.forEach((letter) => {
    columnDefs.push({
      headerName: letter.toUpperCase(),
      field: letter,
      width: 150,
    });
  });
  return columnDefs;
}

function getDataSource(count: number) {
  const dataSource: IDatasource = {
    rowCount: count,
    getRows: (params: IGetRowsParams) => {
      const rowsThisPage: any[] = [];
      for (
        var rowIndex = params.startRow;
        rowIndex < params.endRow;
        rowIndex++
      ) {
        var record: Record<string, string> = {};
        ALPHABET.forEach(function (letter, colIndex) {
          const randomNumber = 17 + rowIndex + colIndex;
          const cellKey = letter.toUpperCase() + (rowIndex + 1);
          record[letter] = cellKey + " = " + randomNumber;
        });
        rowsThisPage.push(record);
      }
      // to mimic server call, we reply after a short delay
      setTimeout(() => {
        // no need to pass the second 'rowCount' parameter as we have already provided it
        params.successCallback(rowsThisPage);
      }, 100);
    },
  };
  return dataSource;
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>(getColumnDefs());
  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return { mode: "multiRow", headerCheckbox: false };
  }, []);
  const getRowId = useCallback((params: GetRowIdParams) => {
    return params.data.a;
  }, []);
  const datasource = useMemo<IDatasource>(() => {
    return getDataSource(100);
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      sortable: false,
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          columnDefs={columnDefs}
          rowModelType={"infinite"}
          rowSelection={rowSelection}
          maxBlocksInCache={2}
          getRowId={getRowId}
          datasource={datasource}
          defaultColDef={defaultColDef}
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

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
  ColumnApiModule,
  InfiniteRowModelModule,
  ModuleRegistry,
  RowSelectionModule,
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

const getColumnDefs = () => {
  const columnDefs = [
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
};

const getDataSource = (count) => {
  const dataSource = {
    rowCount: count,
    getRows: (params) => {
      const rowsThisPage = [];
      for (
        var rowIndex = params.startRow;
        rowIndex < params.endRow;
        rowIndex++
      ) {
        var record = {};
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
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState(getColumnDefs());
  const rowSelection = useMemo(() => {
    return { mode: "multiRow", headerCheckbox: false };
  }, []);
  const getRowId = useCallback((params) => {
    return params.data.a;
  }, []);
  const datasource = useMemo(() => {
    return getDataSource(100);
  }, []);
  const defaultColDef = useMemo(() => {
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

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
window.tearDownExample = () => root.unmount();

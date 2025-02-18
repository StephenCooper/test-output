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
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColTypeDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  HighlightChangesModule,
  ModuleRegistry,
  NumberEditorModule,
  RenderApiModule,
  RowApiModule,
  TextEditorModule,
  ValidationModule,
  ValueCacheModule,
  ValueFormatterParams,
  ValueGetterParams,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  RowApiModule,
  RenderApiModule,
  NumberEditorModule,
  TextEditorModule,
  ValueCacheModule,
  HighlightChangesModule,
  CellStyleModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let callCount = 1;

const totalValueGetter = function (params: ValueGetterParams) {
  const q1 = params.getValue("q1");
  const q2 = params.getValue("q2");
  const q3 = params.getValue("q3");
  const q4 = params.getValue("q4");
  const result = q1 + q2 + q3 + q4;
  console.log(
    `Total Value Getter (${callCount}, ${params.column.getId()}): ${[q1, q2, q3, q4].join(", ")} = ${result}`,
  );
  callCount++;
  return result;
};

const total10ValueGetter = function (params: ValueGetterParams) {
  const total = params.getValue("total");
  return total * 10;
};

function formatNumber(params: ValueFormatterParams) {
  const number = params.value;
  return Math.floor(number).toLocaleString();
}

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(getData());
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "q1", type: "quarterFigure" },
    { field: "q2", type: "quarterFigure" },
    { field: "q3", type: "quarterFigure" },
    { field: "q4", type: "quarterFigure" },
    { field: "year", rowGroup: true, hide: true },
    {
      headerName: "Total",
      colId: "total",
      cellClass: ["number-cell", "total-col"],
      aggFunc: "sum",
      valueFormatter: formatNumber,
      valueGetter: totalValueGetter,
    },
    {
      headerName: "Total x 10",
      cellClass: ["number-cell", "total-col"],
      aggFunc: "sum",
      minWidth: 120,
      valueFormatter: formatNumber,
      valueGetter: total10ValueGetter,
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      enableCellChangeFlash: true,
    };
  }, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      minWidth: 130,
    };
  }, []);
  const columnTypes = useMemo<{
    [key: string]: ColTypeDef;
  }>(() => {
    return {
      quarterFigure: {
        editable: true,
        cellClass: "number-cell",
        aggFunc: "sum",
        valueFormatter: formatNumber,
        valueParser: function numberParser(params) {
          return Number(params.newValue);
        },
      },
    };
  }, []);
  const getRowId = useCallback((params: GetRowIdParams) => {
    return String(params.data.id);
  }, []);

  const onCellValueChanged = useCallback(() => {
    console.log("onCellValueChanged");
  }, []);

  const onExpireValueCache = useCallback(() => {
    console.log("onInvalidateValueCache -> start");
    gridRef.current!.api.expireValueCache();
    console.log("onInvalidateValueCache -> end");
  }, []);

  const onRefreshCells = useCallback(() => {
    console.log("onRefreshCells -> start");
    gridRef.current!.api.refreshCells();
    console.log("onRefreshCells -> end");
  }, []);

  const onUpdateOneValue = useCallback(() => {
    const randomId = Math.floor(Math.random() * 10) + "";
    const rowNode = gridRef.current!.api.getRowNode(randomId);
    if (rowNode) {
      const randomCol = ["q1", "q2", "q3", "q4"][Math.floor(Math.random() * 4)];
      const newValue = Math.floor(Math.random() * 1000);
      console.log("onUpdateOneValue -> start");
      rowNode.setDataValue(randomCol, newValue);
      console.log("onUpdateOneValue -> end");
    }
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button onClick={onExpireValueCache}>Invalidate Value Cache</button>
          <button onClick={onRefreshCells}>Refresh Cells</button>
          <button onClick={onUpdateOneValue}>Update One Value</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            columnTypes={columnTypes}
            suppressAggFuncInHeader={true}
            groupDefaultExpanded={1}
            valueCache={true}
            getRowId={getRowId}
            onCellValueChanged={onCellValueChanged}
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

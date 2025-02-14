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
  GridApi,
  GridOptions,
  IViewportDatasource,
  IViewportDatasourceParams,
  ModuleRegistry,
  RowModelType,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { ViewportRowModelModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ViewportRowModelModule,
  ValidationModule /* Development Only */,
]);

const createViewportDatasource: () => IViewportDatasource = () => {
  let initParams: IViewportDatasourceParams;
  return {
    init: (params: IViewportDatasourceParams) => {
      initParams = params;
      const oneMillion = 1000 * 1000;
      params.setRowCount(oneMillion);
    },
    setViewportRange(firstRow: number, lastRow: number) {
      const rowData: any = {};
      for (let rowIndex = firstRow; rowIndex <= lastRow; rowIndex++) {
        const item: any = {};
        item.id = rowIndex;
        item.a = "A-" + rowIndex;
        item.b = "B-" + rowIndex;
        item.c = "C-" + rowIndex;
        rowData[rowIndex] = item;
      }
      initParams.setRowData(rowData);
    },
    destroy: () => {},
  };
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      headerName: "ID",
      field: "id",
    },
    {
      headerName: "Expected Position",
      valueGetter: '"translateY(" + node.rowIndex * 100 + "px)"',
    },
    {
      field: "a",
    },
    {
      field: "b",
    },
    {
      field: "c",
    },
  ]);
  const viewportDatasource = useMemo<IViewportDatasource>(() => {
    return createViewportDatasource();
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          rowHeight={100}
          rowModelType={"viewport"}
          viewportDatasource={viewportDatasource}
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

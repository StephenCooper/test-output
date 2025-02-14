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
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HeaderValueGetterParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  ValueGetterParams,
  createGrid,
} from "ag-grid-community";
import {
  AdvancedFilterModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  AdvancedFilterModule,
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

function valueGetter(params: ValueGetterParams<IOlympicData, number>) {
  return params.data ? params.data[params.colDef.field!] * -1 : null;
}

let includeHiddenColumns = false;

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<(ColDef | ColGroupDef)[]>([
    {
      field: "athlete",
      filterParams: {
        caseSensitive: true,
        filterOptions: ["contains"],
      },
    },
    { field: "country", rowGroup: true, hide: true },
    { field: "sport", hide: true },
    { field: "age", minWidth: 100, filter: false },
    {
      headerName: "Medals (+)",
      children: [
        { field: "gold", minWidth: 100 },
        { field: "silver", minWidth: 100 },
        { field: "bronze", minWidth: 100 },
      ],
    },
    {
      headerName: "Medals (-)",
      children: [
        {
          field: "gold",
          headerValueGetter: (
            params: HeaderValueGetterParams<IOlympicData, number>,
          ) => (params.location === "advancedFilter" ? "Gold (-)" : "Gold"),
          valueGetter: valueGetter,
          cellDataType: "number",
          minWidth: 100,
        },
        {
          field: "silver",
          headerValueGetter: (
            params: HeaderValueGetterParams<IOlympicData, number>,
          ) => (params.location === "advancedFilter" ? "Silver (-)" : "Silver"),
          valueGetter: valueGetter,
          cellDataType: "number",
          minWidth: 100,
        },
        {
          field: "bronze",
          headerValueGetter: (
            params: HeaderValueGetterParams<IOlympicData, number>,
          ) => (params.location === "advancedFilter" ? "Bronze (-)" : "Bronze"),
          valueGetter: valueGetter,
          cellDataType: "number",
          minWidth: 100,
        },
      ],
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 180,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  const onIncludeHiddenColumnsToggled = useCallback(() => {
    includeHiddenColumns = !includeHiddenColumns;
    gridRef.current!.api.setGridOption(
      "includeHiddenColumnsInAdvancedFilter",
      includeHiddenColumns,
    );
    document.querySelector("#includeHiddenColumns")!.textContent =
      `${includeHiddenColumns ? "Exclude" : "Include"} Hidden Columns`;
  }, [includeHiddenColumns]);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="example-header">
          <button
            id="includeHiddenColumns"
            onClick={onIncludeHiddenColumnsToggled}
          >
            Include Hidden Columns
          </button>
        </div>

        <div style={gridStyle}>
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            groupDefaultExpanded={1}
            enableAdvancedFilter={true}
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

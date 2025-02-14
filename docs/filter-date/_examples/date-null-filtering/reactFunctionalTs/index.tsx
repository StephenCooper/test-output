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
  CellApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DateFilterModule,
  GridApi,
  GridOptions,
  IDateFilterParams,
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
  ValueGetterParams,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  CellApiModule,
  TextFilterModule,
  ClientSideRowModelModule,
  DateFilterModule,
  ValidationModule /* Development Only */,
]);

const originalColumnDefs: ColDef[] = [
  { field: "athlete" },
  {
    field: "date",
    cellDataType: "date",
    filter: "agDateColumnFilter",
    filterParams: {
      includeBlanksInEquals: false,
      includeBlanksInNotEqual: false,
      includeBlanksInLessThan: false,
      includeBlanksInGreaterThan: false,
      includeBlanksInRange: false,
    } as IDateFilterParams,
  },
  {
    headerName: "Description",
    valueGetter: (params: ValueGetterParams) => {
      let date = params.data.date;
      if (date != null) {
        date = params.api.getCellValue({
          rowNode: params.node!,
          colKey: "date",
          useFormatter: true,
        });
      }
      return `Date is ${date}`;
    },
    minWidth: 340,
  },
];

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>([
    {
      athlete: "Alberto Gutierrez",
      date: null,
    },
    {
      athlete: "Niall Crosby",
      date: undefined,
    },
    {
      athlete: "Sean Landsman",
      date: new Date(2016, 9, 25),
    },
    {
      athlete: "Robert Clarke",
      date: new Date(2016, 9, 25),
    },
  ]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>(originalColumnDefs);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const updateParams = useCallback(
    (toChange: string) => {
      const value: boolean = (
        document.getElementById(`checkbox${toChange}`) as HTMLInputElement
      ).checked;
      originalColumnDefs[1].filterParams[`includeBlanksIn${toChange}`] = value;
      gridRef.current!.api.setGridOption("columnDefs", originalColumnDefs);
    },
    [originalColumnDefs],
  );

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          <div className="test-label">
            Include NULL
            <br />
            in date:
          </div>
          <label>
            <input
              type="checkbox"
              id="checkboxEquals"
              onChange={() => updateParams("Equals")}
            />
            &nbsp;equals
          </label>
          <label>
            <input
              type="checkbox"
              id="checkboxNotEqual"
              onChange={() => updateParams("NotEqual")}
            />
            &nbsp;notEqual
          </label>
          <label>
            <input
              type="checkbox"
              id="checkboxLessThan"
              onChange={() => updateParams("LessThan")}
            />
            &nbsp;lessThan
          </label>
          <label>
            <input
              type="checkbox"
              id="checkboxGreaterThan"
              onChange={() => updateParams("GreaterThan")}
            />
            &nbsp;greaterThan
          </label>
          <label>
            <input
              type="checkbox"
              id="checkboxRange"
              onChange={() => updateParams("Range")}
            />
            &nbsp;inRange
          </label>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
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

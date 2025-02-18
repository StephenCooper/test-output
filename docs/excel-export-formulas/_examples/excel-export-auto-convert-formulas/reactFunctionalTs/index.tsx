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
  ExcelExportParams,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>([
    { firstName: "Mair", lastName: "Inworth", age: 23, company: "Rhyzio" },
    { firstName: "Clair", lastName: "Cockland", age: 38, company: "Vitz" },
    { firstName: "Sonni", lastName: "Jellings", age: 24, company: "Kimia" },
    { firstName: "Kit", lastName: "Clarage", age: 27, company: "Skynoodle" },
    { firstName: "Tod", lastName: "de Mendoza", age: 29, company: "Teklist" },
    { firstName: "Herold", lastName: "Pelman", age: 23, company: "Divavu" },
    { firstName: "Paula", lastName: "Gleave", age: 37, company: "Demimbu" },
    {
      firstName: "Kendrick",
      lastName: "Clayill",
      age: 26,
      company: "Brainlounge",
    },
    {
      firstName: "Korrie",
      lastName: "Blowing",
      age: 32,
      company: "Twitternation",
    },
    { firstName: "Ferrell", lastName: "Towhey", age: 40, company: "Nlounge" },
    { firstName: "Anders", lastName: "Negri", age: 30, company: "Flipstorm" },
    { firstName: "Douglas", lastName: "Dalmon", age: 25, company: "Feedbug" },
    { firstName: "Roxanna", lastName: "Schukraft", age: 26, company: "Skinte" },
    { firstName: "Seumas", lastName: "Pouck", age: 34, company: "Aimbu" },
    { firstName: "Launce", lastName: "Welldrake", age: 25, company: "Twinte" },
    { firstName: "Siegfried", lastName: "Grady", age: 34, company: "Vimbo" },
    { firstName: "Vinson", lastName: "Hyams", age: 20, company: "Tanoodle" },
    { firstName: "Cayla", lastName: "Duckerin", age: 21, company: "Livepath" },
    { firstName: "Luigi", lastName: "Rive", age: 25, company: "Quatz" },
    { firstName: "Carolyn", lastName: "Blouet", age: 29, company: "Eamia" },
  ]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "firstName" },
    { field: "lastName" },
    {
      headerName: "Full Name",
      valueGetter: (params) => {
        return `${params.data.firstName} ${params.data.lastName}`;
      },
    },
    { field: "age" },
    { field: "company" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);
  const defaultExcelExportParams = useMemo<ExcelExportParams>(() => {
    return {
      autoConvertFormulas: true,
      processCellCallback: (params) => {
        const rowIndex = params.accumulatedRowIndex;
        const valueGetter = params.column.getColDef().valueGetter;
        return valueGetter
          ? `=CONCATENATE(A${rowIndex}, " ", B${rowIndex})`
          : params.value;
      },
    };
  }, []);

  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel();
  }, []);

  return (
    <div style={containerStyle}>
      <div className="container">
        <div>
          <button
            onClick={onBtExport}
            style={{ marginBottom: "5px", fontWeight: "bold" }}
          >
            Export to Excel
          </button>
        </div>
        <div className="grid-wrapper">
          <div style={gridStyle}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              defaultExcelExportParams={defaultExcelExportParams}
            />
          </div>
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

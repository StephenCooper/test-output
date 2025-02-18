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
  CellClassParams,
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ExcelStyle,
  GridApi,
  GridOptions,
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  CellStyleModule,
  ClientSideRowModelModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 200 },
    {
      field: "age",
      cellClassRules: {
        greenBackground: (params) => {
          return params.value < 23;
        },
        redFont: (params) => {
          return params.value < 20;
        },
      },
    },
    {
      field: "country",
      minWidth: 200,
      cellClassRules: {
        redFont: (params) => {
          return params.value === "United States";
        },
      },
    },
    {
      headerName: "Group",
      valueGetter: "data.country.charAt(0)",
      cellClass: ["redFont", "greenBackground"],
    },
    {
      field: "year",
      cellClassRules: {
        notInExcel: (params) => {
          return true;
        },
      },
    },
    { field: "sport", minWidth: 150 },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      cellClassRules: {
        darkGreyBackground: (params: CellClassParams) => {
          return (params.node.rowIndex || 0) % 2 == 0;
        },
      },
      filter: true,
      minWidth: 100,
      flex: 1,
    };
  }, []);
  const excelStyles = useMemo<ExcelStyle[]>(() => {
    return [
      {
        id: "cell",
        alignment: {
          vertical: "Center",
        },
      },
      {
        id: "greenBackground",
        interior: {
          color: "#b5e6b5",
          pattern: "Solid",
        },
      },
      {
        id: "redFont",
        font: {
          fontName: "Calibri Light",
          underline: "Single",
          italic: true,
          color: "#BB0000",
        },
      },
      {
        id: "darkGreyBackground",
        interior: {
          color: "#888888",
          pattern: "Solid",
        },
        font: {
          fontName: "Calibri Light",
          color: "#ffffff",
        },
      },
    ];
  }, []);

  const { data, loading } = useFetchJson<IOlympicData>(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  const onBtnExportDataAsExcel = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel();
  }, []);

  return (
    <div style={containerStyle}>
      <div className="page-wrapper">
        <div>
          <button
            onClick={onBtnExportDataAsExcel}
            style={{ marginBottom: "5px", fontWeight: "bold" }}
          >
            Export to Excel
          </button>
        </div>

        <div className="grid-wrapper">
          <div style={gridStyle}>
            <AgGridReact<IOlympicData>
              ref={gridRef}
              rowData={data}
              loading={loading}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              excelStyles={excelStyles}
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

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
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import CompanyLogoRenderer from "./companyLogoRenderer.tsx";
import CompanyRenderer from "./companyRenderer.tsx";
import CustomButtonComponent from "./customButtonComponent.tsx";
import MissionResultRenderer from "./missionResultRenderer.tsx";
import PriceRenderer from "./priceRenderer.tsx";
ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

interface IRow {
  company: string;
  website: string;
  revenue: number;
  hardware: boolean;
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IRow[]>([]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 10,
    };
  }, []);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "company",
      flex: 6,
    },
    {
      field: "website",
      cellRenderer: CompanyRenderer,
    },
    {
      headerName: "Logo",
      field: "company",
      cellRenderer: CompanyLogoRenderer,
      cellClass: "logoCell",
      minWidth: 100,
    },
    {
      field: "revenue",
      cellRenderer: PriceRenderer,
    },
    {
      field: "hardware",
      cellRenderer: MissionResultRenderer,
    },
    {
      colId: "actions",
      headerName: "Actions",
      cellRenderer: CustomButtonComponent,
    },
  ]);

  const { data, loading } = useFetchJson<IRow>(
    "https://www.ag-grid.com/example-assets/small-company-data.json",
  );

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IRow>
          rowData={rowData}
          rowData={data}
          loading={loading}
          defaultColDef={defaultColDef}
          columnDefs={columnDefs}
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

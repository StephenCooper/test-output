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
import CustomHeader from "./customHeader.jsx";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  TextEditorModule,
  TextFilterModule,
  TooltipModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  TooltipModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "athlete",
      headerName: "Athlete's Full Name",
      suppressHeaderFilterButton: true,
      minWidth: 120,
    },
    {
      field: "age",
      headerName: "Athlete's Age",
      sortable: false,
      headerComponentParams: { menuIcon: "fa-external-link-alt" },
    },
    {
      field: "country",
      headerName: "Athlete's Country",
      suppressHeaderFilterButton: true,
      minWidth: 120,
    },
    { field: "year", headerName: "Event Year", sortable: false },
    {
      field: "date",
      headerName: "Event Date",
      suppressHeaderFilterButton: true,
    },
    { field: "sport", sortable: false },
    {
      field: "gold",
      headerName: "Gold Medals",
      headerComponentParams: { menuIcon: "fa-cog" },
      minWidth: 120,
    },
    { field: "silver", headerName: "Silver Medals", sortable: false },
    {
      field: "bronze",
      headerName: "Bronze Medals",
      suppressHeaderFilterButton: true,
      minWidth: 120,
    },
    { field: "total", headerName: "Total Medals", sortable: false },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      filter: true,
      width: 120,
      headerComponent: CustomHeader,
      headerComponentParams: {
        menuIcon: "fa-bars",
      },
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => {
        setRowData(data);
      });
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
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

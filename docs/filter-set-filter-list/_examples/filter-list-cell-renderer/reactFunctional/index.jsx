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
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import CountryCellRenderer from "./countryCellRenderer.jsx";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const COUNTRY_CODES = {
  Ireland: "ie",
  Luxembourg: "lu",
  Belgium: "be",
  Spain: "es",
  France: "fr",
  Germany: "de",
  Sweden: "se",
  Italy: "it",
  Greece: "gr",
  Iceland: "is",
  Portugal: "pt",
  Malta: "mt",
  Norway: "no",
  Brazil: "br",
  Argentina: "ar",
  Colombia: "co",
  Peru: "pe",
  Venezuela: "ve",
  Uruguay: "uy",
};

const GridExample = () => {
  const gridRef = useRef(null);
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "No Cell Renderer",
      field: "country",
      cellRenderer: CountryCellRenderer,
      filter: "agSetColumnFilter",
      filterParams: {
        // no cell renderer!
      },
    },
    {
      headerName: "With Cell Renderers",
      field: "country",
      cellRenderer: CountryCellRenderer,
      filter: "agSetColumnFilter",
      filterParams: {
        cellRenderer: CountryCellRenderer,
        cellRendererParams: { isFilterRenderer: true },
      },
    },
  ]);
  const context = useMemo(() => {
    return {
      COUNTRY_CODES: COUNTRY_CODES,
    };
  }, []);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 225,
      floatingFilter: true,
    };
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    params.api.getToolPanelInstance("filters").expandFilters();
  }, []);

  const printFilterModel = useCallback(() => {
    const filterModel = gridRef.current.api.getFilterModel();
    console.log(filterModel);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button onClick={printFilterModel}>Print Filter Model</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            context={context}
            defaultColDef={defaultColDef}
            sideBar={"filters"}
            onFirstDataRendered={onFirstDataRendered}
          />
        </div>
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

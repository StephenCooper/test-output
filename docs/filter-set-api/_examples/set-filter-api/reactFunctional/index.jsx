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
  NumberFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

const countryKeyCreator = (params) => {
  return params.value.name;
};

const patchData = (data) => {
  // hack the data, replace each country with an object of country name and code
  data.forEach((row) => {
    const countryName = row.country;
    const countryCode = countryName.substring(0, 2).toUpperCase();
    row.country = {
      name: countryName,
      code: countryCode,
    };
  });
};

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "athlete",
      filter: "agSetColumnFilter",
    },
    {
      field: "country",
      valueFormatter: (params) => {
        return `${params.value.name} (${params.value.code})`;
      },
      keyCreator: countryKeyCreator,
      filterParams: { valueFormatter: (params) => params.value.name },
    },
    { field: "age", maxWidth: 120, filter: "agNumberColumnFilter" },
    { field: "year", maxWidth: 120 },
    { field: "date" },
    { field: "sport" },
    { field: "gold", filter: "agNumberColumnFilter" },
    { field: "silver", filter: "agNumberColumnFilter" },
    { field: "bronze", filter: "agNumberColumnFilter" },
    { field: "total", filter: "agNumberColumnFilter" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 160,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => {
        patchData(data);
        setRowData(data);
      });
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    params.api.getToolPanelInstance("filters").expandFilters();
  }, []);

  const selectJohnAndKenny = useCallback(() => {
    gridRef.current.api
      .setColumnFilterModel("athlete", {
        values: ["John Joe Nevin", "Kenny Egan"],
      })
      .then(() => {
        gridRef.current.api.onFilterChanged();
      });
  }, []);

  const selectEverything = useCallback(() => {
    gridRef.current.api.setColumnFilterModel("athlete", null).then(() => {
      gridRef.current.api.onFilterChanged();
    });
  }, []);

  const selectNothing = useCallback(() => {
    gridRef.current.api
      .setColumnFilterModel("athlete", { values: [] })
      .then(() => {
        gridRef.current.api.onFilterChanged();
      });
  }, []);

  const setCountriesToFranceAustralia = useCallback(() => {
    gridRef.current.api.getColumnFilterInstance("country").then((instance) => {
      instance.setFilterValues([
        {
          name: "France",
          code: "FR",
        },
        {
          name: "Australia",
          code: "AU",
        },
      ]);
      instance.applyModel();
      gridRef.current.api.onFilterChanged();
    });
  }, []);

  const setCountriesToAll = useCallback(() => {
    gridRef.current.api.getColumnFilterInstance("country").then((instance) => {
      instance.resetFilterValues();
      instance.applyModel();
      gridRef.current.api.onFilterChanged();
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="example-header">
          <div>
            Athlete:
            <button onClick={selectNothing}>API: Filter empty set</button>
            <button onClick={selectJohnAndKenny}>
              API: Filter only John Joe Nevin and Kenny Egan
            </button>
            <button onClick={selectEverything}>API: Remove filter</button>
          </div>
          <div style={{ paddingTop: "10px" }}>
            Country - available filter values
            <button onClick={setCountriesToFranceAustralia}>
              Filter values restricted to France and Australia
            </button>
            <button onClick={setCountriesToAll}>
              Make all countries available
            </button>
          </div>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            sideBar={"filters"}
            onGridReady={onGridReady}
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

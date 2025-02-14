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
  GridStateModule,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  AdvancedFilterModule,
  ColumnMenuModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  GridStateModule,
  AdvancedFilterModule,
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const initialAdvancedFilterModel = {
  filterType: "join",
  type: "AND",
  conditions: [
    {
      filterType: "join",
      type: "OR",
      conditions: [
        {
          filterType: "number",
          colId: "age",
          type: "greaterThan",
          filter: 23,
        },
        {
          filterType: "text",
          colId: "sport",
          type: "endsWith",
          filter: "ing",
        },
      ],
    },
    {
      filterType: "text",
      colId: "country",
      type: "contains",
      filter: "united",
    },
  ],
};

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const advancedFilterBuilderParams = useMemo(() => {
    return {
      showMoveButtons: true,
    };
  }, []);
  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete" },
    { field: "country" },
    { field: "sport" },
    { field: "age", minWidth: 100 },
    { field: "gold", minWidth: 100 },
    { field: "silver", minWidth: 100 },
    { field: "bronze", minWidth: 100 },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 180,
      filter: true,
    };
  }, []);
  const popupParent = useMemo(() => {
    return document.getElementById("wrapper");
  }, []);
  const initialState = useMemo(() => {
    return {
      filter: {
        advancedFilterModel: initialAdvancedFilterModel,
      },
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));

    // Could also be provided via grid option `advancedFilterParent`.
    // Setting the parent removes the Advanced Filter input from the grid,
    // allowing the Advanced Filter to be edited only via the Builder, launched via the API.
    params.api.setGridOption(
      "advancedFilterParent",
      document.getElementById("advancedFilterParent"),
    );
  }, []);

  const onAdvancedFilterBuilderVisibleChanged = useCallback((event) => {
    const eButton = document.getElementById("advancedFilterBuilderButton");
    if (event.visible) {
      eButton.setAttribute("disabled", "");
    } else {
      eButton.removeAttribute("disabled");
    }
  }, []);

  const onFilterChanged = useCallback(() => {
    const advancedFilterApplied =
      !!gridRef.current.api.getAdvancedFilterModel();
    document
      .getElementById("advancedFilterIcon")
      .classList.toggle("filter-icon-disabled", !advancedFilterApplied);
  }, []);

  const showBuilder = useCallback(() => {
    gridRef.current.api.showAdvancedFilterBuilder();
  }, []);

  return (
    <div style={containerStyle}>
      <div id="wrapper" className="example-wrapper">
        <div className="example-header">
          <div id="advancedFilterParent" className="parent"></div>
          <button id="advancedFilterBuilderButton" onClick={showBuilder}>
            Advanced Filter Builder
          </button>
          <i id="advancedFilterIcon" className="fa fa-filter filter-icon"></i>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            advancedFilterBuilderParams={advancedFilterBuilderParams}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            enableAdvancedFilter={true}
            popupParent={popupParent}
            initialState={initialState}
            onGridReady={onGridReady}
            onAdvancedFilterBuilderVisibleChanged={
              onAdvancedFilterBuilderVisibleChanged
            }
            onFilterChanged={onFilterChanged}
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

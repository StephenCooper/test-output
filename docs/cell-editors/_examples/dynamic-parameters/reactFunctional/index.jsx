"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  LargeTextEditorModule,
  ModuleRegistry,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RichSelectModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
import GenderCellRenderer from "./genderCellRenderer.jsx";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RichSelectModule,
  TextEditorModule,
  LargeTextEditorModule,
  ValidationModule /* Development Only */,
]);

const cellCellEditorParams = (params) => {
  const selectedCountry = params.data.country;
  const allowedCities = countyToCityMap(selectedCountry);
  return {
    values: allowedCities,
    formatValue: (value) => `${value} (${selectedCountry})`,
  };
};

const countyToCityMap = (match) => {
  const map = {
    Ireland: ["Dublin", "Cork", "Galway"],
    USA: ["New York", "Los Angeles", "Chicago", "Houston"],
  };
  return map[match];
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(getData());
  const [columnDefs, setColumnDefs] = useState([
    { field: "name" },
    {
      field: "gender",
      cellRenderer: GenderCellRenderer,
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: {
        values: ["Male", "Female"],
        cellRenderer: GenderCellRenderer,
      },
    },
    {
      field: "country",
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: {
        cellHeight: 50,
        values: ["Ireland", "USA"],
      },
    },
    {
      field: "city",
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: cellCellEditorParams,
    },
    {
      field: "address",
      cellEditor: "agLargeTextCellEditor",
      cellEditorPopup: true,
      minWidth: 550,
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 130,
      editable: true,
    };
  }, []);

  const onCellValueChanged = useCallback((params) => {
    const colId = params.column.getId();
    if (colId === "country") {
      const selectedCountry = params.data.country;
      const selectedCity = params.data.city;
      const allowedCities = countyToCityMap(selectedCountry) || [];
      const cityMismatch = allowedCities.indexOf(selectedCity) < 0;
      if (cityMismatch) {
        params.node.setDataValue("city", null);
      }
    }
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onCellValueChanged={onCellValueChanged}
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

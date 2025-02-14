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
import {
  CellValueChangedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  SelectEditorModule,
  TextEditorModule,
  ValidationModule,
  ValueFormatterParams,
  ValueSetterParams,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RichSelectModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
import ColourCellRenderer from "./colourCellRenderer.tsx";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RichSelectModule,
  SetFilterModule,
  SelectEditorModule,
  TextEditorModule,
  ValidationModule /* Development Only */,
]);

const carMappings = {
  tyt: "Toyota",
  frd: "Ford",
  prs: "Porsche",
  nss: "Nissan",
};

const colourMappings = {
  cb: "Cadet Blue",
  bw: "Burlywood",
  fg: "Forest Green",
};

function extractKeys(mappings: Record<string, string>) {
  return Object.keys(mappings);
}

const carCodes = extractKeys(carMappings);

const colourCodes = extractKeys(colourMappings);

function currencyFormatter(params: ValueFormatterParams) {
  const value = Math.floor(params.value);
  if (isNaN(value)) {
    return "";
  }
  return "£" + value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function numberValueSetter(params: ValueSetterParams) {
  const valueAsNumber = parseFloat(params.newValue);
  if (isNaN(valueAsNumber) || !isFinite(params.newValue)) {
    return false; // don't set invalid numbers!
  }
  params.data.price = valueAsNumber;
  return true;
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(getData());
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "make",
      minWidth: 100,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: carCodes,
      },
      filter: "agSetColumnFilter",
      refData: carMappings,
    },
    {
      field: "exteriorColour",
      minWidth: 150,
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: {
        values: colourCodes,
        cellRenderer: ColourCellRenderer,
      },
      filter: "agSetColumnFilter",
      filterParams: {
        cellRenderer: ColourCellRenderer,
      },
      refData: colourMappings,
      cellRenderer: ColourCellRenderer,
    },
    {
      field: "interiorColour",
      minWidth: 150,
      filter: "agSetColumnFilter",
      filterParams: {
        cellRenderer: ColourCellRenderer,
      },
      refData: colourMappings,
      cellRenderer: ColourCellRenderer,
    },
    {
      headerName: "Retail Price",
      field: "price",
      minWidth: 120,
      colId: "retailPrice",
      valueGetter: (params) => {
        return params.data.price;
      },
      valueFormatter: currencyFormatter,
      valueSetter: numberValueSetter,
    },
    {
      headerName: "Retail Price (incl Taxes)",
      minWidth: 120,
      editable: false,
      valueGetter: (params) => {
        // example of chaining value getters
        return params.getValue("retailPrice") * 1.2;
      },
      valueFormatter: currencyFormatter,
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      filter: true,
      editable: true,
    };
  }, []);

  const onCellValueChanged = useCallback((params: CellValueChangedEvent) => {
    // notice that the data always contains the keys rather than values after editing
    console.log("onCellValueChanged Data: ", params.data);
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

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
(window as any).tearDownExample = () => root.unmount();

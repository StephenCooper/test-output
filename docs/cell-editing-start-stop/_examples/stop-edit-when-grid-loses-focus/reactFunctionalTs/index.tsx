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
  CustomEditorModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellEditorComp,
  ICellEditorParams,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  NumberFilterModule,
  CustomEditorModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

class YearCellEditor implements ICellEditorComp {
  eGui: any;
  value: any;

  getGui() {
    return this.eGui;
  }

  getValue() {
    return this.value;
  }

  isPopup() {
    return true;
  }

  init(params: ICellEditorParams) {
    this.value = params.value;
    const tempElement = document.createElement("div");
    tempElement.innerHTML =
      '<div class="yearSelect">' +
      "<div>Clicking here does not close the popup!</div>" +
      '<button id="bt2006" class="yearButton">2006</button>' +
      '<button id="bt2008" class="yearButton">2008</button>' +
      '<button id="bt2010" class="yearButton">2010</button>' +
      '<button id="bt2012" class="yearButton">2012</button>' +
      "<div>" +
      '<input type="text" style="width: 100%;" placeholder="clicking on this text field does not close"/>' +
      "</div>" +
      "</div>";

    [2006, 2008, 2010, 2012].forEach((year) => {
      tempElement.querySelector("#bt" + year)!.addEventListener("click", () => {
        this.value = year;
        params.stopEditing();
      });
    });

    this.eGui = tempElement.firstChild;
  }
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 160 },
    { field: "age" },
    { field: "country", minWidth: 140 },
    { field: "year", cellEditor: YearCellEditor, cellEditorPopup: true },
    { field: "date", minWidth: 140 },
    { field: "sport", minWidth: 160 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
      filter: true,
      editable: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="example-header">
          Clicking outside the grid will stop the editing{" "}
          <button style={{ fontSize: "12px" }}>Dummy Save</button>
          <input placeholder="click here, editing stops" />
        </div>

        <div style={gridStyle}>
          <AgGridReact<IOlympicData>
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            stopEditingWhenCellsLoseFocus={true}
            onGridReady={onGridReady}
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
(window as any).tearDownExample = () => root.unmount();

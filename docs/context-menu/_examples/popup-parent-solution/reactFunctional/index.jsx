"use client";

import React, { useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ClipboardModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100px", width: "100%" }), []);
  const [rowData, setRowData] = useState([
    { a: 1, b: 1, c: 1, d: 1, e: 1 },
    { a: 2, b: 2, c: 2, d: 2, e: 2 },
  ]);
  const [columnDefs, setColumnDefs] = useState([
    { field: "a" },
    { field: "b" },
    { field: "c" },
    { field: "d" },
    { field: "e" },
  ]);
  const popupParent = useMemo(() => {
    return document.querySelector("body");
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          popupParent={popupParent}
        />
      </div>

      <div style={{ padding: "10px" }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc posuere
        lobortis est, sit amet molestie justo mattis et. Suspendisse congue
        condimentum tristique. Cras et purus vehicula, rhoncus ante sit amet,
        tempus nulla. Morbi vitae turpis id diam tincidunt luctus aliquet non
        ante. Ut elementum odio risus, eu condimentum lectus varius vitae.
        Praesent faucibus id ex commodo mattis. Duis egestas nibh ut libero
        accumsan blandit. Nunc mollis elit non sem tempor, sit amet posuere
        velit commodo. Cras convallis sem mattis, scelerisque turpis sed,
        scelerisque arcu. Mauris ac nunc purus. Aenean sit amet dapibus augue.
      </div>

      <div style={{ padding: "10px" }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc posuere
        lobortis est, sit amet molestie justo mattis et. Suspendisse congue
        condimentum tristique. Cras et purus vehicula, rhoncus ante sit amet,
        tempus nulla. Morbi vitae turpis id diam tincidunt luctus aliquet non
        ante. Ut elementum odio risus, eu condimentum lectus varius vitae.
        Praesent faucibus id ex commodo mattis. Duis egestas nibh ut libero
        accumsan blandit. Nunc mollis elit non sem tempor, sit amet posuere
        velit commodo. Cras convallis sem mattis, scelerisque turpis sed,
        scelerisque arcu. Mauris ac nunc purus. Aenean sit amet dapibus augue.
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

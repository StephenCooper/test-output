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
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "200px", width: "400px" }), []);
  const [rowData, setRowData] = useState<any[]>(getData());
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { headerName: "ID", valueGetter: "node.rowIndex + 1", width: 70 },
    { field: "model", width: 150 },
    { field: "color" },
    { field: "price", valueFormatter: '"$" + value.toLocaleString()' },
    { field: "year" },
    { field: "country" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      width: 100,
    };
  }, []);

  const onBtPrinterFriendly = useCallback(() => {
    const eGridDiv = document.querySelector<HTMLElement>("#myGrid")! as any;
    eGridDiv.style.width = "";
    eGridDiv.style.height = "";
    gridRef.current!.api.setGridOption("domLayout", "print");
  }, []);

  const onBtNormal = useCallback(() => {
    const eGridDiv = document.querySelector<HTMLElement>("#myGrid")! as any;
    eGridDiv.style.width = "400px";
    eGridDiv.style.height = "200px";
    // Same as setting to 'normal' as it is the default
    gridRef.current!.api.setGridOption("domLayout", undefined);
  }, []);

  return (
    <div style={containerStyle}>
      <button onClick={onBtPrinterFriendly}>Printer Friendly Layout</button>
      <button onClick={onBtNormal}>Normal Layout</button>

      <h3>Latin Text</h3>

      <p>
        Lorem ipsum dolor sit amet, ne cum repudiare abhorreant. Atqui molestiae
        neglegentur ad nam, mei amet eros ea, populo deleniti scaevola et pri.
        Pro no ubique explicari, his reque nulla consequuntur in. His soleat
        doctus constituam te, sed at alterum repudiandae. Suas ludus electram te
        ius.
      </p>

      <div id="myGrid" style={gridStyle}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
        />
      </div>

      <h3>More Latin Text</h3>

      <p>
        Lorem ipsum dolor sit amet, ne cum repudiare abhorreant. Atqui molestiae
        neglegentur ad nam, mei amet eros ea, populo deleniti scaevola et pri.
        Pro no ubique explicari, his reque nulla consequuntur in. His soleat
        doctus constituam te, sed at alterum repudiandae. Suas ludus electram te
        ius.
      </p>
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

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
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ClientSideRowModelApiModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

function setPrinterFriendly(api) {
  const eGridDiv = document.querySelector("#myGrid");
  eGridDiv.style.width = "";
  eGridDiv.style.height = "";
  api.setGridOption("domLayout", "print");
}

function setNormal(api) {
  const eGridDiv = document.querySelector("#myGrid");
  eGridDiv.style.width = "700px";
  eGridDiv.style.height = "200px";
  api.setGridOption("domLayout", undefined);
}

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "200px", width: "700px" }), []);
  const [rowData, setRowData] = useState(getData());
  const [columnDefs, setColumnDefs] = useState([
    { field: "group", rowGroup: true, hide: true },
    { field: "id", pinned: "left", width: 70 },
    { field: "model", width: 180 },
    { field: "color", width: 100 },
    {
      field: "price",
      valueFormatter: "'$' + value.toLocaleString()",
      width: 100,
    },
    { field: "year", width: 100 },
    { field: "country", width: 120 },
  ]);

  const onFirstDataRendered = useCallback((params) => {
    params.api.expandAll();
  }, []);

  const onBtPrint = useCallback(() => {
    setPrinterFriendly(gridRef.current.api);
    setTimeout(() => {
      print();
      setNormal(gridRef.current.api);
    }, 2000);
  }, [print]);

  return (
    <div style={containerStyle}>
      <button onClick={onBtPrint}>Print</button>

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
          groupDisplayType={"groupRows"}
          onFirstDataRendered={onFirstDataRendered}
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

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
window.tearDownExample = () => root.unmount();

"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./style.css";
import {
  ClientSideRowModelModule,
  DragAndDropModule,
  ModuleRegistry,
  RowDragModule,
  RowStyleModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  DragAndDropModule,
  TextFilterModule,
  RowDragModule,
  RowStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(getData());
  const [columnDefs, setColumnDefs] = useState([
    { valueGetter: "'Drag'", dndSource: true },
    { field: "id" },
    { field: "color" },
    { field: "value1" },
    { field: "value2" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      width: 80,
      filter: true,
    };
  }, []);
  const rowClassRules = useMemo(() => {
    return {
      "red-row": 'data.color == "Red"',
      "green-row": 'data.color == "Green"',
      "blue-row": 'data.color == "Blue"',
    };
  }, []);

  const onDragOver = useCallback((event) => {
    const dragSupported = event.dataTransfer.length;
    if (dragSupported) {
      event.dataTransfer.dropEffect = "move";
    }
    event.preventDefault();
  }, []);

  const onDrop = useCallback((event) => {
    const jsonData = event.dataTransfer.getData("application/json");
    const eJsonRow = document.createElement("div");
    eJsonRow.classList.add("json-row");
    eJsonRow.innerText = jsonData;
    const eJsonDisplay = document.querySelector("#eJsonDisplay");
    eJsonDisplay.appendChild(eJsonRow);
    event.preventDefault();
  }, []);

  return (
    <div style={containerStyle}>
      <div className="outer">
        <div className="grid-col">
          <div style={gridStyle}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowClassRules={rowClassRules}
              rowDragManaged={true}
            />
          </div>
        </div>

        <div
          className="drop-col"
          onDragOver={() => onDragOver(event)}
          onDrop={() => onDrop(event)}
        >
          <span id="eDropTarget" className="drop-target">
            {" "}
            ==&gt; Drop to here{" "}
          </span>
          <div id="eJsonDisplay" className="json-display"></div>
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

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
  RowClassRules,
  RowDragModule,
  RowStyleModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { getData } from "./data";
import DragSourceRenderer from "./dragSourceRenderer.tsx";
ModuleRegistry.registerModules([
  TextFilterModule,
  RowDragModule,
  RowStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(getData());
  const rowClassRules = useMemo<RowClassRules>(() => {
    return {
      "red-row": 'data.color == "Red"',
      "green-row": 'data.color == "Green"',
      "blue-row": 'data.color == "Blue"',
    };
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      width: 80,
      filter: true,
    };
  }, []);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { cellRenderer: DragSourceRenderer, minWidth: 100 },
    { field: "id" },
    { field: "color" },
    { field: "value1" },
    { field: "value2" },
  ]);

  const onDragOver = useCallback((event: any) => {
    const types = event.dataTransfer.types;
    const dragSupported = types.length;
    if (dragSupported) {
      event.dataTransfer.dropEffect = "move";
    }
    event.preventDefault();
  }, []);

  const onDrop = useCallback((event: any) => {
    event.preventDefault();
    const textData = event.dataTransfer.getData("text/plain");
    const eJsonRow = document.createElement("div");
    eJsonRow.classList.add("json-row");
    eJsonRow.innerText = textData;
    const eJsonDisplay = document.querySelector("#eJsonDisplay")!;
    eJsonDisplay.appendChild(eJsonRow);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="outer">
        <div className="grid-col">
          <div style={gridStyle}>
            <AgGridReact
              rowData={rowData}
              rowClassRules={rowClassRules}
              defaultColDef={defaultColDef}
              rowDragManaged={true}
              columnDefs={columnDefs}
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

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
(window as any).tearDownExample = () => root.unmount();

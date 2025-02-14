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
  ModuleRegistry,
  RowDragModule,
  RowStyleModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextFilterModule,
  RowDragModule,
  RowStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let rowIdSequence = 100;

const addCheckboxListener = (params) => {
  const checkbox = document.querySelector("input[type=checkbox]");
  checkbox.addEventListener("change", () => {
    params.api.setGridOption("suppressMoveWhenRowDragging", checkbox.checked);
  });
};

const createRowData = () => {
  const data = [];
  [
    "Red",
    "Green",
    "Blue",
    "Red",
    "Green",
    "Blue",
    "Red",
    "Green",
    "Blue",
  ].forEach((color) => {
    const newDataItem = {
      id: rowIdSequence++,
      color: color,
      value1: Math.floor(Math.random() * 100),
      value2: Math.floor(Math.random() * 100),
    };
    data.push(newDataItem);
  });
  return data;
};

const createTile = (data) => {
  const el = document.createElement("div");
  el.classList.add("tile");
  el.classList.add(data.color.toLowerCase());
  el.innerHTML =
    '<div class="id">' +
    data.id +
    "</div>" +
    '<div class="value">' +
    data.value1 +
    "</div>" +
    '<div class="value">' +
    data.value2 +
    "</div>";
  return el;
};

const addDropZones = (params) => {
  const tileContainer = document.querySelector(".tile-container");
  const dropZone = {
    getContainer: () => {
      return tileContainer;
    },
    onDragStop: (params) => {
      const tile = createTile(params.node.data);
      tileContainer.appendChild(tile);
    },
  };
  params.api.addRowDropZone(dropZone);
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(createRowData());
  const [columnDefs, setColumnDefs] = useState([
    { field: "id", rowDrag: true },
    { field: "color" },
    { field: "value1" },
    { field: "value2" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      filter: true,
      flex: 1,
    };
  }, []);
  const rowClassRules = useMemo(() => {
    return {
      "red-row": 'data.color == "Red"',
      "green-row": 'data.color == "Green"',
      "blue-row": 'data.color == "Blue"',
    };
  }, []);

  const onGridReady = useCallback((params) => {
    addDropZones(params);
    addCheckboxListener(params);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="toolbar">
          <label>
            <input type="checkbox" /> Enable suppressMoveWhenRowDragging
          </label>
        </div>
        <div className="drop-containers">
          <div className="grid-wrapper">
            <div style={gridStyle}>
              <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                rowClassRules={rowClassRules}
                rowDragManaged={true}
                onGridReady={onGridReady}
              />
            </div>
          </div>
          <div className="drop-col">
            <span id="eDropTarget" className="drop-target">
              ==&gt; Drop to here
            </span>
            <div className="tile-container"></div>
          </div>
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

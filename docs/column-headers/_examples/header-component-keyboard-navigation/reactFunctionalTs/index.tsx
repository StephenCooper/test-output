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
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SuppressHeaderKeyboardEventParams,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import CustomHeader from "./customHeader.tsx";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const GRID_CELL_CLASSNAME = "ag-header-cell";

function getAllFocusableElementsOf(el: HTMLElement) {
  return Array.from<HTMLElement>(
    el.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((focusableEl) => {
    return focusableEl.tabIndex !== -1;
  });
}

const getEventPath: (event: Event) => HTMLElement[] = (event: Event) => {
  const path: HTMLElement[] = [];
  let currentTarget: any = event.target;
  while (currentTarget) {
    path.push(currentTarget);
    currentTarget = currentTarget.parentElement;
  }
  return path;
};

/**
 * Capture whether the user is tabbing forwards or backwards and suppress keyboard event if tabbing
 * outside of the children
 */
function suppressHeaderKeyboardEvent({
  event,
}: SuppressHeaderKeyboardEventParams) {
  const { key, shiftKey } = event;
  const path = getEventPath(event);
  const isTabForward = key === "Tab" && shiftKey === false;
  const isTabBackward = key === "Tab" && shiftKey === true;
  let suppressEvent = false;
  // Handle cell children tabbing
  if (isTabForward || isTabBackward) {
    const eGridCell = path.find((el) => {
      if (el.classList === undefined) return false;
      return el.classList.contains(GRID_CELL_CLASSNAME);
    });
    if (!eGridCell) {
      return suppressEvent;
    }
    const focusableChildrenElements = getAllFocusableElementsOf(eGridCell);
    const lastCellChildEl =
      focusableChildrenElements[focusableChildrenElements.length - 1];
    const firstCellChildEl = focusableChildrenElements[0];
    // Suppress keyboard event if tabbing forward within the cell and the current focused element is not the last child
    if (isTabForward && focusableChildrenElements.length > 0) {
      const isLastChildFocused =
        lastCellChildEl && document.activeElement === lastCellChildEl;
      if (!isLastChildFocused) {
        suppressEvent = true;
      }
    }
    // Suppress keyboard event if tabbing backwards within the cell, and the current focused element is not the first child
    else if (isTabBackward && focusableChildrenElements.length > 0) {
      const cellHasFocusedChildren =
        eGridCell.contains(document.activeElement) &&
        eGridCell !== document.activeElement;
      // Manually set focus to the last child element if cell doesn't have focused children
      if (!cellHasFocusedChildren) {
        lastCellChildEl.focus();
        // Cancel keyboard press, so that it doesn't focus on the last child and then pass through the keyboard press to
        // move to the 2nd last child element
        event.preventDefault();
      }
      const isFirstChildFocused =
        firstCellChildEl && document.activeElement === firstCellChildEl;
      if (!isFirstChildFocused) {
        suppressEvent = true;
      }
    }
  }
  return suppressEvent;
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "athlete",
      sortable: false,
    },
    {
      field: "country",
      headerComponent: CustomHeader,
      minWidth: 270,
      flex: 1,
      sortable: false,
    },
    {
      field: "age",
      sortable: false,
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      minWidth: 130,
      flex: 1,
      suppressHeaderKeyboardEvent,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => {
        setRowData(data);
      });
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
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

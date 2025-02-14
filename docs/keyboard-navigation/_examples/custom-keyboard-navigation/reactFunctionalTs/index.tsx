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
  CellPosition,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  Column,
  ColumnGroup,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HeaderPosition,
  ModuleRegistry,
  NavigateToNextCellParams,
  NavigateToNextHeaderParams,
  NumberEditorModule,
  NumberFilterModule,
  RowApiModule,
  TabToNextCellParams,
  TabToNextHeaderParams,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  RowApiModule,
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

// define some handy keycode constants
const KEY_LEFT = "ArrowLeft";

const KEY_UP = "ArrowUp";

const KEY_RIGHT = "ArrowRight";

const KEY_DOWN = "ArrowDown";

const moveHeaderFocusUpDown: (
  previousHeader: HeaderPosition,
  headerRowCount: number,
  isUp: boolean,
) => HeaderPosition = (
  previousHeader: HeaderPosition,
  headerRowCount: number,
  isUp: boolean,
) => {
  const previousColumn = previousHeader.column;
  const isSpanHeaderHeight =
    !!(previousColumn as Column).isSpanHeaderHeight &&
    (previousColumn as Column).isSpanHeaderHeight();
  const lastRowIndex = previousHeader.headerRowIndex;
  let nextRowIndex = isUp ? lastRowIndex - 1 : lastRowIndex + 1;
  let nextColumn;
  if (nextRowIndex === -1) {
    return previousHeader;
  }
  if (nextRowIndex === headerRowCount) {
    nextRowIndex = -1;
  }
  let parentColumn = previousColumn.getParent();
  if (isUp) {
    if (isSpanHeaderHeight) {
      while (parentColumn && parentColumn.isPadding()) {
        parentColumn = parentColumn.getParent();
      }
    }
    if (!parentColumn) {
      return previousHeader;
    }
    nextColumn = parentColumn;
  } else {
    const children =
      ((previousColumn as ColumnGroup).getChildren &&
        (previousColumn as ColumnGroup).getChildren()) ||
      [];
    nextColumn = children.length > 0 ? children[0] : previousColumn;
  }
  return {
    headerRowIndex: nextRowIndex,
    column: nextColumn as Column,
  };
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<(ColDef | ColGroupDef)[]>([
    {
      headerName: "Athlete",
      children: [
        { field: "athlete", headerName: "Name", minWidth: 170 },
        { field: "age" },
        { field: "country" },
      ],
    },
    { field: "year" },
    { field: "sport" },
    {
      headerName: "Medals",
      children: [
        { field: "gold" },
        { field: "silver" },
        { field: "bronze" },
        { field: "total" },
      ],
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  const navigateToNextHeader = useCallback(
    (params: NavigateToNextHeaderParams): HeaderPosition | null => {
      const nextHeader = params.nextHeaderPosition;
      if (params.key !== "ArrowDown" && params.key !== "ArrowUp") {
        return nextHeader;
      }
      const processedNextHeader = moveHeaderFocusUpDown(
        params.previousHeaderPosition!,
        params.headerRowCount,
        params.key === "ArrowDown",
      );
      return processedNextHeader;
    },
    [],
  );

  const tabToNextHeader = useCallback(
    (params: TabToNextHeaderParams): HeaderPosition | null => {
      return moveHeaderFocusUpDown(
        params.previousHeaderPosition!,
        params.headerRowCount,
        params.backwards,
      );
    },
    [],
  );

  const tabToNextCell = useCallback(
    (params: TabToNextCellParams): CellPosition | null => {
      const previousCell = params.previousCellPosition;
      const renderedRowCount = params.api!.getDisplayedRowCount();
      const lastRowIndex = previousCell.rowIndex;
      let nextRowIndex = params.backwards ? lastRowIndex - 1 : lastRowIndex + 1;
      if (nextRowIndex < 0) {
        nextRowIndex = -1;
      }
      if (nextRowIndex >= renderedRowCount) {
        nextRowIndex = renderedRowCount - 1;
      }
      const result = {
        rowIndex: nextRowIndex,
        column: previousCell.column,
        rowPinned: previousCell.rowPinned,
      };
      return result;
    },
    [],
  );

  const navigateToNextCell = useCallback(
    (params: NavigateToNextCellParams): CellPosition | null => {
      const previousCell = params.previousCellPosition,
        suggestedNextCell = params.nextCellPosition;
      let nextRowIndex, renderedRowCount;
      switch (params.key) {
        case KEY_DOWN:
          // return the cell above
          nextRowIndex = previousCell.rowIndex - 1;
          if (nextRowIndex < -1) {
            return null;
          } // returning null means don't navigate
          return {
            rowIndex: nextRowIndex,
            column: previousCell.column,
            rowPinned: previousCell.rowPinned,
          };
        case KEY_UP:
          // return the cell below
          nextRowIndex = previousCell.rowIndex + 1;
          renderedRowCount = params.api!.getDisplayedRowCount();
          if (nextRowIndex >= renderedRowCount) {
            return null;
          } // returning null means don't navigate
          return {
            rowIndex: nextRowIndex,
            column: previousCell.column,
            rowPinned: previousCell.rowPinned,
          };
        case KEY_LEFT:
        case KEY_RIGHT:
          return suggestedNextCell;
        default:
          throw Error(
            "this will never happen, navigation is always one of the 4 keys above",
          );
      }
    },
    [],
  );

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          navigateToNextHeader={navigateToNextHeader}
          tabToNextHeader={tabToNextHeader}
          tabToNextCell={tabToNextCell}
          navigateToNextCell={navigateToNextCell}
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

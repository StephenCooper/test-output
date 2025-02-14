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
  ICellRendererParams,
  ModuleRegistry,
  NumberEditorModule,
  QuickFilterModule,
  RowApiModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  RowApiModule,
  QuickFilterModule,
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const getMedalString = function ({
  gold,
  silver,
  bronze,
}: {
  gold: number;
  silver: number;
  bronze: number;
}) {
  const goldStr = gold > 0 ? `Gold: ${gold} ` : "";
  const silverStr = silver > 0 ? `Silver: ${silver} ` : "";
  const bronzeStr = bronze > 0 ? `Bronze: ${bronze}` : "";
  return goldStr + silverStr + bronzeStr;
};

const MedalRenderer = function (params: ICellRendererParams) {
  return getMedalString(params.value);
};

let includeHiddenColumns = false;

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(getData());
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    // simple column, easy to understand
    { field: "name" },
    // the grid works with embedded fields
    { headerName: "Age", field: "person.age" },
    // or use value getter, all works with quick filter
    { headerName: "Country", valueGetter: "data.person.country" },
    // or use the object value, so value passed around is an object
    {
      headerName: "Results",
      field: "medals",
      cellRenderer: MedalRenderer,
      // this is needed to avoid toString=[object,object] result with objects
      getQuickFilterText: (params) => {
        return getMedalString(params.value);
      },
      cellDataType: false,
    },
    {
      headerName: "Hidden",
      field: "hidden",
      hide: true,
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      editable: true,
    };
  }, []);

  const onIncludeHiddenColumnsToggled = useCallback(() => {
    includeHiddenColumns = !includeHiddenColumns;
    gridRef.current!.api.setGridOption(
      "includeHiddenColumnsInQuickFilter",
      includeHiddenColumns,
    );
    document.querySelector("#includeHiddenColumns")!.textContent =
      `${includeHiddenColumns ? "Exclude" : "Include"} Hidden Columns`;
  }, [includeHiddenColumns]);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current!.api.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value,
    );
  }, []);

  const onPrintQuickFilterTexts = useCallback(() => {
    gridRef.current!.api.forEachNode(function (rowNode, index) {
      console.log(
        "Row " +
          index +
          " quick filter text is " +
          rowNode.quickFilterAggregateText,
      );
    });
  }, []);

  const quickFilterParser = useCallback((quickFilter: string) => {
    const quickFilterParts = [];
    let lastSpaceIndex = -1;
    const isQuote = (index: number) => quickFilter[index] === '"';
    const getQuickFilterPart = (
      lastSpaceIndex: number,
      currentIndex: number,
    ) => {
      const startsWithQuote = isQuote(lastSpaceIndex + 1);
      const endsWithQuote = isQuote(currentIndex - 1);
      const startIndex =
        startsWithQuote && endsWithQuote
          ? lastSpaceIndex + 2
          : lastSpaceIndex + 1;
      const endIndex =
        startsWithQuote && endsWithQuote ? currentIndex - 1 : currentIndex;
      return quickFilter.slice(startIndex, endIndex);
    };
    for (let i = 0; i < quickFilter.length; i++) {
      const char = quickFilter[i];
      if (char === " ") {
        if (!isQuote(lastSpaceIndex + 1) || isQuote(i - 1)) {
          quickFilterParts.push(getQuickFilterPart(lastSpaceIndex, i));
          lastSpaceIndex = i;
        }
      }
    }
    if (lastSpaceIndex !== quickFilter.length - 1) {
      quickFilterParts.push(
        getQuickFilterPart(lastSpaceIndex, quickFilter.length),
      );
    }
    return quickFilterParts;
  }, []);

  const quickFilterMatcher = useCallback(
    (quickFilterParts: string[], rowQuickFilterAggregateText: string) => {
      let result: boolean;
      try {
        result = quickFilterParts.every((part) =>
          rowQuickFilterAggregateText.match(part),
        );
      } catch {
        result = false;
      }
      return result;
    },
    [],
  );

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="example-header">
          <input
            type="text"
            id="filter-text-box"
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged}
          />
          <button
            style={{ marginLeft: "20px" }}
            onClick={onPrintQuickFilterTexts}
          >
            Print Quick Filter Cache Texts
          </button>
          <button
            id="includeHiddenColumns"
            style={{ marginLeft: "20px" }}
            onClick={onIncludeHiddenColumnsToggled}
          >
            Include Hidden Columns
          </button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            cacheQuickFilter={true}
            quickFilterParser={quickFilterParser}
            quickFilterMatcher={quickFilterMatcher}
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

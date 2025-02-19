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
  ModuleRegistry,
  NumberFilterModule,
  PaginationModule,
  RowSelectionModule,
  RowSelectionOptions,
  TextFilterModule,
  ValidationModule,
  ValueFormatterParams,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  RowSelectionModule,
  PaginationModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

function setText(selector: string, text: any) {
  (document.querySelector(selector) as any).innerHTML = text;
}

function setLastButtonDisabled(disabled: boolean) {
  (document.querySelector("#btLast") as any).disabled = disabled;
}

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    // this row just shows the row index, doesn't use any data from the row
    {
      headerName: "#",
      width: 70,
      valueFormatter: (params: ValueFormatterParams) => {
        return `${parseInt(params.node!.id!) + 1}`;
      },
    },
    { headerName: "Athlete", field: "athlete", width: 150 },
    { headerName: "Age", field: "age", width: 90 },
    { headerName: "Country", field: "country", width: 120 },
    { headerName: "Year", field: "year", width: 90 },
    { headerName: "Date", field: "date", width: 110 },
    { headerName: "Sport", field: "sport", width: 110 },
    { headerName: "Gold", field: "gold", width: 100 },
    { headerName: "Silver", field: "silver", width: 100 },
    { headerName: "Bronze", field: "bronze", width: 100 },
    { headerName: "Total", field: "total", width: 100 },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);
  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return {
      mode: "multiRow",
      checkboxes: true,
      headerCheckbox: true,
    };
  }, []);
  const paginationPageSizeSelector = useMemo<number[] | boolean>(() => {
    return [100, 500, 1000];
  }, []);

  const { data, loading } = useFetchJson<IOlympicData>(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  const onPaginationChanged = useCallback(() => {
    console.log("onPaginationPageLoaded");
    // Workaround for bug in events order
    if (gridRef.current!.api!) {
      setText(
        "#lbLastPageFound",
        gridRef.current!.api.paginationIsLastPageFound(),
      );
      setText("#lbPageSize", gridRef.current!.api.paginationGetPageSize());
      // we +1 to current page, as pages are zero based
      setText(
        "#lbCurrentPage",
        gridRef.current!.api.paginationGetCurrentPage() + 1,
      );
      setText("#lbTotalPages", gridRef.current!.api.paginationGetTotalPages());
      setLastButtonDisabled(!gridRef.current!.api.paginationIsLastPageFound());
    }
  }, []);

  const onBtFirst = useCallback(() => {
    gridRef.current!.api.paginationGoToFirstPage();
  }, []);

  const onBtLast = useCallback(() => {
    gridRef.current!.api.paginationGoToLastPage();
  }, []);

  const onBtNext = useCallback(() => {
    gridRef.current!.api.paginationGoToNextPage();
  }, []);

  const onBtPrevious = useCallback(() => {
    gridRef.current!.api.paginationGoToPreviousPage();
  }, []);

  const onBtPageFive = useCallback(() => {
    // we say page 4, as the first page is zero
    gridRef.current!.api.paginationGoToPage(4);
  }, []);

  const onBtPageFifty = useCallback(() => {
    // we say page 49, as the first page is zero
    gridRef.current!.api.paginationGoToPage(49);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="example-header">
          <div>
            <button onClick={onBtFirst}>To First</button>
            <button onClick={onBtLast} id="btLast">
              To Last
            </button>
            <button onClick={onBtPrevious}>To Previous</button>
            <button onClick={onBtNext}>To Next</button>
            <button onClick={onBtPageFive}>To Page 5</button>
            <button onClick={onBtPageFifty}>To Page 50</button>
          </div>

          <div style={{ marginTop: "6px" }}>
            <span className="label">Last Page Found:</span>
            <span className="value" id="lbLastPageFound">
              -
            </span>
            <span className="label">Page Size:</span>
            <span className="value" id="lbPageSize">
              -
            </span>
            <span className="label">Total Pages:</span>
            <span className="value" id="lbTotalPages">
              -
            </span>
            <span className="label">Current Page:</span>
            <span className="value" id="lbCurrentPage">
              -
            </span>
          </div>
        </div>

        <div style={gridStyle}>
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowSelection={rowSelection}
            paginationPageSize={500}
            paginationPageSizeSelector={paginationPageSizeSelector}
            pagination={true}
            suppressPaginationPanel={true}
            suppressScrollOnNewData={true}
            onPaginationChanged={onPaginationChanged}
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

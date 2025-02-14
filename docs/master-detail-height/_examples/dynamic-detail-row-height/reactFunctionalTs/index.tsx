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
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDetailCellRendererParams,
  ModuleRegistry,
  RenderApiModule,
  RowApiModule,
  RowHeightParams,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  RenderApiModule,
  RowApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    // group cell renderer needed for expand / collapse icons
    { field: "name", cellRenderer: "agGroupCellRenderer" },
    { field: "account" },
    { field: "calls" },
    { field: "minutes", valueFormatter: "x.toLocaleString() + 'm'" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
    };
  }, []);
  const detailCellRendererParams = useMemo<any>(() => {
    return {
      detailGridOptions: {
        columnDefs: [
          { field: "callId" },
          { field: "direction" },
          { field: "number" },
          { field: "duration", valueFormatter: "x.toLocaleString() + 's'" },
          { field: "switchCode" },
        ],
        defaultColDef: {
          flex: 1,
        },
        onGridReady: (params) => {
          // using auto height to fit the height of the the detail grid
          params.api.setGridOption("domLayout", "autoHeight");
        },
      },
      getDetailRowData: (params) => {
        params.successCallback(params.data.callRecords);
      },
    } as IDetailCellRendererParams<IAccount, ICallRecord>;
  }, []);
  const getRowHeight = useCallback((params: RowHeightParams) => {
    if (params.node && params.node.detail) {
      const offset = 80;
      const allDetailRowHeight =
        params.data.callRecords.length *
        params.api.getSizesForCurrentTheme().rowHeight;
      const gridSizes = params.api.getSizesForCurrentTheme();
      return (
        allDetailRowHeight +
        ((gridSizes && gridSizes.headerHeight) || 0) +
        offset
      );
    }
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch(
      "https://www.ag-grid.com/example-assets/master-detail-dynamic-row-height-data.json",
    )
      .then((resp) => resp.json())
      .then((data: any[]) => {
        setRowData(data);
      });
  }, []);

  const onFirstDataRendered = useCallback((params: FirstDataRenderedEvent) => {
    // arbitrarily expand a row for presentational purposes
    setTimeout(() => {
      params.api.getDisplayedRowAtIndex(1)!.setExpanded(true);
    }, 0);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          masterDetail={true}
          detailCellRendererParams={detailCellRendererParams}
          getRowHeight={getRowHeight}
          alwaysShowVerticalScroll={true}
          onGridReady={onGridReady}
          onFirstDataRendered={onFirstDataRendered}
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

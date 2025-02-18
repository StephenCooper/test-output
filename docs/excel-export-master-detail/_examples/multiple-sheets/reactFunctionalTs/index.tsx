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
  FirstDataRenderedEvent,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  IDetailCellRendererParams,
  ModuleRegistry,
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ClipboardModule,
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ExcelExportModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
import { IAccount } from "./interfaces";
ModuleRegistry.registerModules([
  RowApiModule,
  ClientSideRowModelModule,
  ClipboardModule,
  ColumnsToolPanelModule,
  ExcelExportModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IAccount>>(null);
  const { data, loading } = useFetchJson<IAccount>(
    "https://www.ag-grid.com/example-assets/master-detail-data.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

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
  const getRowId = useCallback((params: GetRowIdParams) => {
    return params.data.name;
  }, []);
  const detailCellRendererParams = useMemo(() => {
    return {
      detailGridOptions: {
        columnDefs: [
          { field: "callId" },
          { field: "direction" },
          { field: "number", minWidth: 150 },
          { field: "duration", valueFormatter: "x.toLocaleString() + 's'" },
          { field: "switchCode", minWidth: 150 },
        ],
        defaultColDef: {
          flex: 1,
        },
      },
      getDetailRowData: (params) => {
        params.successCallback(params.data.callRecords);
      },
    } as IDetailCellRendererParams<IAccount, ICallRecord>;
  }, []);

  const onFirstDataRendered = useCallback((params: FirstDataRenderedEvent) => {
    params.api.forEachNode(function (node) {
      node.setExpanded(true);
    });
  }, []);

  const onBtExport = useCallback(() => {
    const spreadsheets = [];
    const mainSheet = gridRef.current!.api.getSheetDataForExcel();
    if (mainSheet) {
      spreadsheets.push(mainSheet);
    }
    gridRef.current!.api.forEachDetailGridInfo(function (node) {
      const sheet = node.api!.getSheetDataForExcel({
        sheetName: node.id.replace("detail_", ""),
      });
      if (sheet) {
        spreadsheets.push(sheet);
      }
    });
    gridRef.current!.api.exportMultipleSheetsAsExcel({
      data: spreadsheets,
      fileName: "ag-grid.xlsx",
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="container">
        <div>
          <button
            onClick={onBtExport}
            style={{ marginBottom: "5px", fontWeight: "bold" }}
          >
            Export to Excel
          </button>
        </div>
        <div className="grid-wrapper">
          <div style={gridStyle}>
            <AgGridReact<IAccount>
              ref={gridRef}
              rowData={data}
              loading={loading}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              getRowId={getRowId}
              groupDefaultExpanded={1}
              rowBuffer={100}
              masterDetail={true}
              detailCellRendererParams={detailCellRendererParams}
              onFirstDataRendered={onFirstDataRendered}
            />
          </div>
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

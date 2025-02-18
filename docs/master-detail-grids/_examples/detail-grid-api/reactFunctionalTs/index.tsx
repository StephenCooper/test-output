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
  FirstDataRenderedEvent,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  HighlightChangesModule,
  IDetailCellRendererParams,
  ModuleRegistry,
  NumberEditorModule,
  RowApiModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
import { IAccount } from "./interfaces";
ModuleRegistry.registerModules([
  TextEditorModule,
  NumberEditorModule,
  RowApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  HighlightChangesModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IAccount>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    // group cell renderer needed for expand / collapse icons
    { field: "name", cellRenderer: "agGroupCellRenderer" },
    { field: "account" },
    { field: "calls" },
    { field: "minutes", valueFormatter: "x.toLocaleString() + 'm'" },
  ]);
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
          editable: true,
        },
      },
      getDetailRowData: (params) => {
        params.successCallback(params.data.callRecords);
      },
    } as IDetailCellRendererParams<IAccount, ICallRecord>;
  }, []);
  const getRowId = useCallback((params: GetRowIdParams) => {
    // use 'account' as the row ID
    return String(params.data.account);
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      editable: true,
    };
  }, []);

  const { data, loading } = useFetchJson<IAccount>(
    "https://www.ag-grid.com/example-assets/master-detail-data.json",
  );

  const onFirstDataRendered = useCallback((params: FirstDataRenderedEvent) => {
    setTimeout(() => {
      params.api.forEachNode(function (node) {
        node.setExpanded(true);
      });
    }, 0);
  }, []);

  const flashMilaSmithOnly = useCallback(() => {
    // flash Mila Smith - we know her account is 177001 and we use the account for the row ID
    const detailGrid = gridRef.current!.api.getDetailGridInfo("detail_177001");
    if (detailGrid) {
      detailGrid.api!.flashCells();
    }
  }, []);

  const flashAll = useCallback(() => {
    gridRef.current!.api.forEachDetailGridInfo(function (detailGridApi) {
      detailGridApi.api!.flashCells();
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ paddingBottom: "4px" }}>
          <button onClick={flashMilaSmithOnly}>Flash Mila Smith</button>
          <button onClick={flashAll}>Flash All</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact<IAccount>
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            masterDetail={true}
            detailRowHeight={200}
            detailCellRendererParams={detailCellRendererParams}
            getRowId={getRowId}
            defaultColDef={defaultColDef}
            onFirstDataRendered={onFirstDataRendered}
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

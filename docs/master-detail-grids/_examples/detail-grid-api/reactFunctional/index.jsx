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
  HighlightChangesModule,
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

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
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
    };
  }, []);
  const getRowId = useCallback((params) => {
    // use 'account' as the row ID
    return String(params.data.account);
  }, []);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      editable: true,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/master-detail-data.json")
      .then((resp) => resp.json())
      .then((data) => {
        setRowData(data);
      });
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    setTimeout(() => {
      params.api.forEachNode(function (node) {
        node.setExpanded(true);
      });
    }, 0);
  }, []);

  const flashMilaSmithOnly = useCallback(() => {
    // flash Mila Smith - we know her account is 177001 and we use the account for the row ID
    const detailGrid = gridRef.current.api.getDetailGridInfo("detail_177001");
    if (detailGrid) {
      detailGrid.api.flashCells();
    }
  }, []);

  const flashAll = useCallback(() => {
    gridRef.current.api.forEachDetailGridInfo(function (detailGridApi) {
      detailGridApi.api.flashCells();
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
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            masterDetail={true}
            detailRowHeight={200}
            detailCellRendererParams={detailCellRendererParams}
            getRowId={getRowId}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
          />
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

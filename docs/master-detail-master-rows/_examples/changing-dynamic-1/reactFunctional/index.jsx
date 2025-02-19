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
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ModuleRegistry,
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  RowApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const isRowMaster = useCallback((dataItem) => {
    return dataItem ? dataItem.callRecords.length > 0 : false;
  }, []);
  const [columnDefs, setColumnDefs] = useState([
    // group cell renderer needed for expand / collapse icons
    { field: "name", cellRenderer: "agGroupCellRenderer" },
    { field: "account" },
    { field: "calls" },
    { field: "minutes", valueFormatter: "x.toLocaleString() + 'm'" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
    };
  }, []);
  const getRowId = useCallback((params) => String(params.data.account), []);
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
    };
  }, []);

  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/master-detail-dynamic-data.json",
  );

  const onFirstDataRendered = useCallback((params) => {
    // arbitrarily expand a row for presentational purposes
    setTimeout(() => {
      params.api.getDisplayedRowAtIndex(1).setExpanded(true);
    }, 0);
  }, []);

  const onBtClearMilaCalls = useCallback(() => {
    const milaSmithRowNode = gridRef.current.api.getRowNode("177001");
    const milaSmithData = milaSmithRowNode.data;
    milaSmithData.callRecords = [];
    milaSmithData.calls = milaSmithData.callRecords.length;
    gridRef.current.api.applyTransaction({ update: [milaSmithData] });
  }, []);

  const onBtSetMilaCalls = useCallback(() => {
    const milaSmithRowNode = gridRef.current.api.getRowNode("177001");
    const milaSmithData = milaSmithRowNode.data;
    milaSmithData.callRecords = [
      {
        name: "susan",
        callId: 579,
        duration: 23,
        switchCode: "SW5",
        direction: "Out",
        number: "(02) 47485405",
      },
      {
        name: "susan",
        callId: 580,
        duration: 52,
        switchCode: "SW3",
        direction: "In",
        number: "(02) 32367069",
      },
    ];
    milaSmithData.calls = milaSmithData.callRecords.length;
    gridRef.current.api.applyTransaction({ update: [milaSmithData] });
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ paddingBottom: "4px" }}>
          <button onClick={onBtClearMilaCalls}>Clear Mila Calls</button>
          <button onClick={onBtSetMilaCalls}>Set Mila Calls</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={data}
            loading={loading}
            masterDetail={true}
            isRowMaster={isRowMaster}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            getRowId={getRowId}
            detailCellRendererParams={detailCellRendererParams}
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

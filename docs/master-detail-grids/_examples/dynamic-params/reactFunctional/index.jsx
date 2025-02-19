"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
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
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

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
  const detailCellRendererParams = useMemo(() => {
    return (params) => {
      const res = {};
      // we use the same getDetailRowData for both options
      res.getDetailRowData = function (params) {
        params.successCallback(params.data.callRecords);
      };
      const nameMatch =
        params.data.name === "Mila Smith" ||
        params.data.name === "Harper Johnson";
      if (nameMatch) {
        // grid options for columns {callId, number}
        res.detailGridOptions = {
          columnDefs: [{ field: "callId" }, { field: "number" }],
          defaultColDef: {
            flex: 1,
          },
        };
      } else {
        // grid options for columns {callId, direction, duration, switchCode}
        res.detailGridOptions = {
          columnDefs: [
            { field: "callId" },
            { field: "direction" },
            { field: "duration", valueFormatter: "x.toLocaleString() + 's'" },
            { field: "switchCode" },
          ],
          defaultColDef: {
            flex: 1,
          },
        };
      }
      return res;
    };
  }, []);

  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/master-detail-data.json",
  );

  const onFirstDataRendered = useCallback((params) => {
    // arbitrarily expand a row for presentational purposes
    setTimeout(() => {
      const node1 = params.api.getDisplayedRowAtIndex(1);
      const node2 = params.api.getDisplayedRowAtIndex(2);
      node1.setExpanded(true);
      node2.setExpanded(true);
    }, 0);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={data}
          loading={loading}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          masterDetail={true}
          detailRowHeight={195}
          detailCellRendererParams={detailCellRendererParams}
          onFirstDataRendered={onFirstDataRendered}
        />
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

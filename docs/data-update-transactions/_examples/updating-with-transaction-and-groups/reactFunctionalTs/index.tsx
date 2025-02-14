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
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  RowApiModule,
  RowClassParams,
  RowSelectionModule,
  RowSelectionOptions,
  RowStyleModule,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import { createNewRowData, getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  RowSelectionModule,
  RowApiModule,
  RowStyleModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

function poundFormatter(params: ValueFormatterParams) {
  return (
    "£" +
    Math.floor(params.value)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  );
}

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(getData());
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "category", rowGroupIndex: 1, hide: true },
    { field: "price", aggFunc: "sum", valueFormatter: poundFormatter },
    { field: "zombies" },
    { field: "style" },
    { field: "clothes" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      width: 100,
    };
  }, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerName: "Group",
      minWidth: 250,
      field: "model",
      rowGroupIndex: 1,
      cellRenderer: "agGroupCellRenderer",
    };
  }, []);
  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return {
      mode: "multiRow",
      groupSelects: "descendants",
      headerCheckbox: false,
      checkboxLocation: "autoGroupColumn",
    };
  }, []);
  const getRowClass = useCallback((params: RowClassParams) => {
    const rowNode = params.node;
    if (rowNode.group) {
      switch (rowNode.key) {
        case "In Workshop":
          return "category-in-workshop";
        case "Sold":
          return "category-sold";
        case "For Sale":
          return "category-for-sale";
        default:
          return undefined;
      }
    } else {
      // no extra classes for leaf rows
      return undefined;
    }
  }, []);

  const getRowData = useCallback(() => {
    const rowData: any[] = [];
    gridRef.current!.api.forEachNode(function (node) {
      rowData.push(node.data);
    });
    console.log("Row Data:");
    console.log(rowData);
  }, []);

  const onAddRow = useCallback(
    (category: string) => {
      const rowDataItem = createNewRowData(category);
      gridRef.current!.api.applyTransaction({ add: [rowDataItem] });
    },
    [createNewRowData],
  );

  const onMoveToGroup = useCallback((category: string) => {
    const selectedRowData = gridRef.current!.api.getSelectedRows();
    selectedRowData.forEach((dataItem) => {
      dataItem.category = category;
    });
    gridRef.current!.api.applyTransaction({ update: selectedRowData });
  }, []);

  const onRemoveSelected = useCallback(() => {
    const selectedRowData = gridRef.current!.api.getSelectedRows();
    gridRef.current!.api.applyTransaction({ remove: selectedRowData });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <div>
            <button className="bt-action" onClick={() => onAddRow("For Sale")}>
              Add For Sale
            </button>
            <button
              className="bt-action"
              onClick={() => onAddRow("In Workshop")}
            >
              Add In Workshop
            </button>
            <button className="bt-action" onClick={onRemoveSelected}>
              Remove Selected
            </button>
            <button className="bt-action" onClick={getRowData}>
              Get Row Data
            </button>
          </div>
          <div style={{ marginTop: "5px" }}>
            <button
              className="bt-action"
              onClick={() => onMoveToGroup("For Sale")}
            >
              Move to For Sale
            </button>
            <button
              className="bt-action"
              onClick={() => onMoveToGroup("In Workshop")}
            >
              Move to In Workshop
            </button>
            <button className="bt-action" onClick={() => onMoveToGroup("Sold")}>
              Move to Sold
            </button>
          </div>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            groupDefaultExpanded={1}
            rowSelection={rowSelection}
            suppressAggFuncInHeader={true}
            getRowClass={getRowClass}
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

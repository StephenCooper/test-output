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
  CsvCell,
  CsvExportParams,
  ExcelCell,
  ExcelExportParams,
  ExcelRow,
  ExcelStyle,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDetailCellRendererParams,
  ModuleRegistry,
  ProcessRowGroupForExportParams,
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
  ClientSideRowModelModule,
  ClipboardModule,
  ColumnsToolPanelModule,
  ExcelExportModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const getRows = (params: ProcessRowGroupForExportParams) => {
  const rows = [
    {
      outlineLevel: 1,
      cells: [
        cell(""),
        cell("Call Id", "header"),
        cell("Direction", "header"),
        cell("Number", "header"),
        cell("Duration", "header"),
        cell("Switch Code", "header"),
      ],
    },
  ].concat(
    ...params.node.data.callRecords.map((record: any) => [
      {
        outlineLevel: 1,
        cells: [
          cell(""),
          cell(record.callId, "body"),
          cell(record.direction, "body"),
          cell(record.number, "body"),
          cell(record.duration, "body"),
          cell(record.switchCode, "body"),
        ],
      },
    ]),
  );
  return rows;
};

const cell: (text: string, styleId?: string) => ExcelCell = (
  text: string,
  styleId?: string,
) => {
  return {
    styleId: styleId,
    data: {
      type: /^\d+$/.test(text) ? "Number" : "String",
      value: String(text),
    },
  };
};

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IAccount>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IAccount[]>();
  const defaultCsvExportParams = useMemo<CsvExportParams>(() => {
    return {
      getCustomContentBelowRow: (params) => {
        const rows = getRows(params);
        return rows.map((row) => row.cells) as CsvCell[][];
      },
    };
  }, []);
  const defaultExcelExportParams = useMemo<ExcelExportParams>(() => {
    return {
      getCustomContentBelowRow: (params) => getRows(params) as ExcelRow[],
      columnWidth: 120,
      fileName: "ag-grid.xlsx",
    };
  }, []);
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
  const excelStyles = useMemo<ExcelStyle[]>(() => {
    return [
      {
        id: "header",
        interior: {
          color: "#aaaaaa",
          pattern: "Solid",
        },
      },
      {
        id: "body",
        interior: {
          color: "#dddddd",
          pattern: "Solid",
        },
      },
    ];
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/master-detail-data.json")
      .then((resp) => resp.json())
      .then((data: IAccount[]) => {
        setRowData(data);
      });
  }, []);

  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel();
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
              rowData={rowData}
              defaultCsvExportParams={defaultCsvExportParams}
              defaultExcelExportParams={defaultExcelExportParams}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              masterDetail={true}
              detailCellRendererParams={detailCellRendererParams}
              excelStyles={excelStyles}
              onGridReady={onGridReady}
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

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
  CellSelectionOptions,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DataTypeDefinition,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextEditorModule,
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

interface IOlympicDataTypes extends IOlympicData {
  countryObject: {
    code: string;
  };
  sportObject: {
    name: string;
  };
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicDataTypes[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete" },
    { field: "countryObject", headerName: "Country" },
    { field: "sportObject", headerName: "Sport" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      floatingFilter: true,
      editable: true,
    };
  }, []);
  const dataTypeDefinitions = useMemo<{
    [cellDataType: string]: DataTypeDefinition;
  }>(() => {
    return {
      country: {
        baseDataType: "object",
        extendsDataType: "object",
        valueParser: (params) =>
          params.newValue == null || params.newValue === ""
            ? null
            : { code: params.newValue },
        valueFormatter: (params) =>
          params.value == null ? "" : params.value.code,
        dataTypeMatcher: (value: any) => value && !!value.code,
      },
      sport: {
        baseDataType: "object",
        extendsDataType: "object",
        valueParser: (params) =>
          params.newValue == null || params.newValue === ""
            ? null
            : { name: params.newValue },
        valueFormatter: (params) =>
          params.value == null ? "" : params.value.name,
        dataTypeMatcher: (value: any) => value && !!value.name,
      },
    };
  }, []);
  const cellSelection = useMemo<boolean | CellSelectionOptions>(() => {
    return { handle: { mode: "fill" } };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicDataTypes[]) =>
        setRowData(
          data.map((rowData) => {
            return {
              ...rowData,
              countryObject: {
                code: rowData.country,
              },
              sportObject: {
                name: rowData.sport,
              },
            };
          }),
        ),
      );
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicDataTypes>
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          dataTypeDefinitions={dataTypeDefinitions}
          cellSelection={cellSelection}
          onGridReady={onGridReady}
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

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
  CheckboxEditorModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DataTypeDefinition,
  DateEditorModule,
  DateFilterModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  NumberEditorModule,
  NumberFilterModule,
  CheckboxEditorModule,
  DateFilterModule,
  DateEditorModule,
  TextEditorModule,
  TextFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

interface IOlympicDataTypes extends IOlympicData {
  dateObject: Date;
  hasGold: boolean;
  hasSilver: boolean;
  countryObject: {
    name: string;
  };
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicDataTypes[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete" },
    { field: "age", minWidth: 100 },
    { field: "hasGold", minWidth: 100, headerName: "Gold" },
    {
      field: "hasSilver",
      minWidth: 100,
      headerName: "Silver",
      cellRendererParams: { disabled: true },
    },
    { field: "dateObject", headerName: "Date" },
    { field: "date", headerName: "Date (String)" },
    { field: "countryObject", headerName: "Country" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 180,
      filter: true,
      floatingFilter: true,
      editable: true,
    };
  }, []);
  const dataTypeDefinitions = useMemo<{
    [cellDataType: string]: DataTypeDefinition;
  }>(() => {
    return {
      object: {
        baseDataType: "object",
        extendsDataType: "object",
        valueParser: (params) => ({ name: params.newValue }),
        valueFormatter: (params) =>
          params.value == null ? "" : params.value.name,
      },
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicDataTypes[]) =>
        setRowData(
          data.map((rowData) => {
            const dateParts = rowData.date.split("/");
            return {
              ...rowData,
              date: `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`,
              dateObject: new Date(
                parseInt(dateParts[2]),
                parseInt(dateParts[1]) - 1,
                parseInt(dateParts[0]),
              ),
              countryObject: {
                name: rowData.country,
              },
              hasGold: rowData.gold > 0,
              hasSilver: rowData.silver > 0,
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

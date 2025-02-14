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
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowApiModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import CustomButtonComponent from "./customButtonComponent.tsx";
import MissionResultRenderer from "./missionResultRenderer.tsx";
ModuleRegistry.registerModules([
  RowApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

interface IRow {
  company: string;
  location: string;
  price: number;
  successful: boolean;
}

function successIconSrc(params: boolean) {
  if (params === true) {
    return "https://www.ag-grid.com/example-assets/icons/tick-in-circle.png";
  } else {
    return "https://www.ag-grid.com/example-assets/icons/cross-in-circle.png";
  }
}

const onClick = () => alert("Mission Launched");

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>([] as IRow[]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "company",
    },
    {
      field: "successful",
      headerName: "Success",
      cellRenderer: MissionResultRenderer,
    },
    {
      field: "successful",
      headerName: "Success",
      cellRenderer: MissionResultRenderer,
      cellRendererParams: {
        src: successIconSrc,
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: CustomButtonComponent,
      cellRendererParams: {
        onClick: onClick,
      },
    },
  ] as ColDef[]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch(
      "https://www.ag-grid.com/example-assets/small-space-mission-data.json",
    )
      .then((resp) => resp.json())
      .then((data: any[]) => {
        setRowData(data);
      });
  }, []);

  const refreshData = useCallback(() => {
    gridRef.current!.api.forEachNode((rowNode) => {
      rowNode.setDataValue("successful", Math.random() > 0.5);
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button onClick={refreshData}>Refresh Data</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
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

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
  AdvancedFilterModel,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridState,
  GridStateModule,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  AdvancedFilterModule,
  ColumnMenuModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  GridStateModule,
  AdvancedFilterModule,
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const initialAdvancedFilterModel: AdvancedFilterModel = {
  filterType: "join",
  type: "AND",
  conditions: [
    {
      filterType: "join",
      type: "OR",
      conditions: [
        {
          filterType: "number",
          colId: "age",
          type: "greaterThan",
          filter: 23,
        },
        {
          filterType: "text",
          colId: "sport",
          type: "endsWith",
          filter: "ing",
        },
      ],
    },
    {
      filterType: "text",
      colId: "country",
      type: "contains",
      filter: "united",
    },
  ],
};

let savedFilterModel: AdvancedFilterModel | null = null;

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const { data, loading } = useFetchJson<IOlympicData>(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete" },
    { field: "country" },
    { field: "sport" },
    { field: "age", minWidth: 100 },
    { field: "gold", minWidth: 100 },
    { field: "silver", minWidth: 100 },
    { field: "bronze", minWidth: 100 },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 180,
      filter: true,
    };
  }, []);
  const initialState = useMemo<GridState>(() => {
    return {
      filter: {
        advancedFilterModel: initialAdvancedFilterModel,
      },
    };
  }, []);

  const saveFilterModel = useCallback(() => {
    savedFilterModel = gridRef.current!.api.getAdvancedFilterModel();
  }, []);

  const restoreFilterModel = useCallback(() => {
    gridRef.current!.api.setAdvancedFilterModel(savedFilterModel);
  }, [savedFilterModel]);

  const restoreFromHardCoded = useCallback(() => {
    gridRef.current!.api.setAdvancedFilterModel({
      filterType: "number",
      colId: "gold",
      type: "greaterThanOrEqual",
      filter: 1,
    });
  }, []);

  const clearFilter = useCallback(() => {
    gridRef.current!.api.setAdvancedFilterModel(null);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div>
          <div className="button-group">
            <button onClick={saveFilterModel}>
              Save Advanced Filter Model
            </button>
            <button onClick={restoreFilterModel}>
              Restore Saved Advanced Filter Model
            </button>
            <button onClick={restoreFromHardCoded} title="[Gold] >= 1">
              Set Custom Advanced Filter Model
            </button>
            <button onClick={clearFilter}>Clear Advanced Filter</button>
          </div>
        </div>

        <div style={gridStyle}>
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            enableAdvancedFilter={true}
            initialState={initialState}
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

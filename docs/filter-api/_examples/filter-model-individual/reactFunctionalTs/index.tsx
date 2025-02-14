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
  ICombinedSimpleModel,
  IDateFilterParams,
  ModuleRegistry,
  NumberFilterModule,
  SideBarDef,
  TextFilterModel,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

const filterParams: IDateFilterParams = {
  comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
    const dateAsString = cellValue;
    if (dateAsString == null) return -1;
    const dateParts = dateAsString.split("/");
    const cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0]),
    );
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
    return 0;
  },
};

let savedFilterModel:
  | TextFilterModel
  | ICombinedSimpleModel<TextFilterModel>
  | null = null;

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", filter: "agTextColumnFilter" },
    { field: "age", filter: "agNumberColumnFilter", maxWidth: 100 },
    { field: "country", filter: "agTextColumnFilter" },
    { field: "year", filter: "agNumberColumnFilter", maxWidth: 100 },
    { field: "sport", filter: "agTextColumnFilter" },
    { field: "gold", filter: "agNumberColumnFilter" },
    { field: "silver", filter: "agNumberColumnFilter" },
    { field: "bronze", filter: "agNumberColumnFilter" },
    { field: "total", filter: "agNumberColumnFilter" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));

    params.api.getToolPanelInstance("filters")!.expandFilters(["athlete"]);
  }, []);

  const clearFilter = useCallback(() => {
    gridRef.current!.api.setColumnFilterModel("athlete", null).then(() => {
      gridRef.current!.api.onFilterChanged();
    });
  }, []);

  const saveFilterModel = useCallback(() => {
    savedFilterModel = gridRef.current!.api.getColumnFilterModel("athlete");
    const convertTextFilterModel = (model: TextFilterModel) => {
      return `${(model as TextFilterModel).type} ${(model as TextFilterModel).filter}`;
    };
    const convertCombinedFilterModel = (
      model: ICombinedSimpleModel<TextFilterModel>,
    ) => {
      return model
        .conditions!.map((condition) => convertTextFilterModel(condition))
        .join(` ${model.operator} `);
    };
    let savedFilterString: string;
    if (!savedFilterModel) {
      savedFilterString = "(none)";
    } else if (
      (savedFilterModel as ICombinedSimpleModel<TextFilterModel>).operator
    ) {
      savedFilterString = convertCombinedFilterModel(
        savedFilterModel as ICombinedSimpleModel<TextFilterModel>,
      );
    } else {
      savedFilterString = convertTextFilterModel(
        savedFilterModel as TextFilterModel,
      );
    }
    (document.querySelector("#savedFilters") as any).innerText =
      savedFilterString;
  }, [savedFilterModel]);

  const restoreFilterModel = useCallback(() => {
    gridRef
      .current!.api.setColumnFilterModel("athlete", savedFilterModel)
      .then(() => {
        gridRef.current!.api.onFilterChanged();
      });
  }, []);

  const restoreFromHardCoded = useCallback(() => {
    const hardcodedFilter = { type: "startsWith", filter: "Mich" };
    gridRef
      .current!.api.setColumnFilterModel("athlete", hardcodedFilter)
      .then(() => {
        gridRef.current!.api.onFilterChanged();
      });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div>
          <div className="button-group">
            <button onClick={saveFilterModel}>Save Filter Model</button>
            <button onClick={restoreFilterModel}>
              Restore Saved Filter Model
            </button>
            <button
              onClick={restoreFromHardCoded}
              title="Name = 'Mich%', Country = ['Ireland', 'United States'], Age < 30, Date < 01/01/2010"
            >
              Set Custom Filter Model
            </button>
            <button onClick={clearFilter}>Reset Filter</button>
          </div>
        </div>
        <div>
          <div className="button-group">
            Saved Filters: <span id="savedFilters">(none)</span>
          </div>
        </div>

        <div style={gridStyle}>
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            sideBar={"filters"}
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

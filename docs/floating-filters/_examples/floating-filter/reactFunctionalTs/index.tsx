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
  DateFilterModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDateFilterParams,
  INumberFilterParams,
  ISetFilter,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ValidationModule /* Development Only */,
]);

const dateFilterParams: IDateFilterParams = {
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

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", filter: "agTextColumnFilter" },
    { field: "age", filter: "agNumberColumnFilter" },
    { field: "country", filter: "agSetColumnFilter" },
    {
      field: "year",
      maxWidth: 120,
      filter: "agNumberColumnFilter",
      floatingFilter: false,
    },
    {
      field: "date",
      minWidth: 215,
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    },
    { field: "sport", filter: "agTextColumnFilter" },
    {
      field: "gold",
      filter: "agNumberColumnFilter",
      filterParams: {
        buttons: ["apply"],
      } as INumberFilterParams,
    },
    {
      field: "silver",
      filter: "agNumberColumnFilter",
      floatingFilterComponentParams: {},
      suppressFloatingFilterButton: true,
    },
    {
      field: "bronze",
      filter: "agNumberColumnFilter",
      floatingFilterComponentParams: {},
      suppressFloatingFilterButton: true,
    },
    { field: "total", filter: false },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: true,
      floatingFilter: true,
      suppressHeaderMenuButton: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  const irelandAndUk = useCallback(() => {
    gridRef
      .current!.api.setColumnFilterModel("country", {
        values: ["Ireland", "Great Britain"],
      })
      .then(() => {
        gridRef.current!.api.onFilterChanged();
      });
  }, []);

  const clearCountryFilter = useCallback(() => {
    gridRef.current!.api.setColumnFilterModel("country", null).then(() => {
      gridRef.current!.api.onFilterChanged();
    });
  }, []);

  const destroyCountryFilter = useCallback(() => {
    gridRef.current!.api.destroyFilter("country");
  }, []);

  const endingStan = useCallback(() => {
    gridRef
      .current!.api.getColumnFilterInstance<ISetFilter>("country")
      .then((countryFilterComponent) => {
        const countriesEndingWithStan = countryFilterComponent!
          .getFilterKeys()
          .filter(function (value: any) {
            return value.indexOf("stan") === value.length - 4;
          });
        gridRef
          .current!.api.setColumnFilterModel("country", {
            values: countriesEndingWithStan,
          })
          .then(() => {
            gridRef.current!.api.onFilterChanged();
          });
      });
  }, []);

  const printCountryModel = useCallback(() => {
    const model = gridRef.current!.api.getColumnFilterModel("country");
    if (model) {
      console.log("Country model is: " + JSON.stringify(model));
    } else {
      console.log("Country model filter is not active");
    }
  }, []);

  const sportStartsWithS = useCallback(() => {
    gridRef
      .current!.api!.setColumnFilterModel("sport", {
        type: "startsWith",
        filter: "s",
      })
      .then(() => {
        gridRef.current!.api.onFilterChanged();
      });
  }, []);

  const sportEndsWithG = useCallback(() => {
    gridRef
      .current!.api!.setColumnFilterModel("sport", {
        type: "endsWith",
        filter: "g",
      })
      .then(() => {
        gridRef.current!.api.onFilterChanged();
      });
  }, []);

  const sportsCombined = useCallback(() => {
    gridRef
      .current!.api!.setColumnFilterModel("sport", {
        conditions: [
          {
            type: "endsWith",
            filter: "g",
          },
          {
            type: "startsWith",
            filter: "s",
          },
        ],
        operator: "AND",
      })
      .then(() => {
        gridRef.current!.api.onFilterChanged();
      });
  }, []);

  const ageBelow25 = useCallback(() => {
    gridRef
      .current!.api!.setColumnFilterModel("age", {
        type: "lessThan",
        filter: 25,
        filterTo: null,
      })
      .then(() => {
        gridRef.current!.api.onFilterChanged();
      });
  }, []);

  const ageAbove30 = useCallback(() => {
    gridRef
      .current!.api!.setColumnFilterModel("age", {
        type: "greaterThan",
        filter: 30,
        filterTo: null,
      })
      .then(() => {
        gridRef.current!.api.onFilterChanged();
      });
  }, []);

  const ageBelow25OrAbove30 = useCallback(() => {
    gridRef
      .current!.api!.setColumnFilterModel("age", {
        conditions: [
          {
            type: "greaterThan",
            filter: 30,
            filterTo: null,
          },
          {
            type: "lessThan",
            filter: 25,
            filterTo: null,
          },
        ],
        operator: "OR",
      })
      .then(() => {
        gridRef.current!.api.onFilterChanged();
      });
  }, []);

  const ageBetween25And30 = useCallback(() => {
    gridRef
      .current!.api!.setColumnFilterModel("age", {
        type: "inRange",
        filter: 25,
        filterTo: 30,
      })
      .then(() => {
        gridRef.current!.api.onFilterChanged();
      });
  }, []);

  const clearAgeFilter = useCallback(() => {
    gridRef.current!.api.setColumnFilterModel("age", null).then(() => {
      gridRef.current!.api.onFilterChanged();
    });
  }, []);

  const after2010 = useCallback(() => {
    gridRef
      .current!.api!.setColumnFilterModel("date", {
        type: "greaterThan",
        dateFrom: "2010-01-01",
        dateTo: null,
      })
      .then(() => {
        gridRef.current!.api.onFilterChanged();
      });
  }, []);

  const before2012 = useCallback(() => {
    gridRef
      .current!.api!.setColumnFilterModel("date", {
        type: "lessThan",
        dateFrom: "2012-01-01",
        dateTo: null,
      })
      .then(() => {
        gridRef.current!.api.onFilterChanged();
      });
  }, []);

  const dateCombined = useCallback(() => {
    gridRef
      .current!.api!.setColumnFilterModel("date", {
        conditions: [
          {
            type: "lessThan",
            dateFrom: "2012-01-01",
            dateTo: null,
          },
          {
            type: "greaterThan",
            dateFrom: "2010-01-01",
            dateTo: null,
          },
        ],
        operator: "OR",
      })
      .then(() => {
        gridRef.current!.api.onFilterChanged();
      });
  }, []);

  const clearDateFilter = useCallback(() => {
    gridRef.current!.api.setColumnFilterModel("date", null).then(() => {
      gridRef.current!.api.onFilterChanged();
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div>
          <span className="button-group">
            <button onClick={irelandAndUk}>Ireland &amp; UK</button>
            <button onClick={endingStan}>Countries Ending 'stan'</button>
            <button onClick={printCountryModel}>Print Country</button>
            <button onClick={clearCountryFilter}>Clear Country</button>
            <button onClick={destroyCountryFilter}>Destroy Country</button>
          </span>
          <span className="button-group">
            <button onClick={ageBelow25}>Age Below 25</button>
            <button onClick={ageAbove30}>Age Above 30</button>
            <button onClick={ageBelow25OrAbove30}>
              Age Below 25 or Above 30
            </button>
            <button onClick={ageBetween25And30}>Age Between 25 and 30</button>
            <button onClick={clearAgeFilter}>Clear Age Filter</button>
          </span>
          <span className="button-group">
            <button onClick={after2010}>Date after 01/01/2010</button>
            <button onClick={before2012}>Date before 01/01/2012</button>
            <button onClick={dateCombined}>Date combined</button>
            <button onClick={clearDateFilter}>Clear Date Filter</button>
          </span>
          <span className="button-group">
            <button onClick={sportStartsWithS}>Sport starts with S</button>
            <button onClick={sportEndsWithG}>Sport ends with G</button>
            <button onClick={sportsCombined}>
              Sport starts with S and ends with G
            </button>
          </span>
        </div>

        <div style={{ flexGrow: "1", height: "10px" }}>
          <div style={gridStyle}>
            <AgGridReact<IOlympicData>
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
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

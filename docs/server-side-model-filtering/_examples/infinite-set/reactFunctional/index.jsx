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
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  MultiFilterModule,
  ServerSideRowModelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ColumnMenuModule,
  ContextMenuModule,
  ServerSideRowModelModule,
  SetFilterModule,
  MultiFilterModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const countryCodeKeyCreator = (params) => {
  return params.value.code;
};

const countryValueFormatter = (params) => {
  return params.value.name;
};

const countryComparator = (a, b) => {
  // for complex objects, need to provide a comparator to choose what to sort by
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  }
  return 0;
};

let fakeServer;

let selectedCountries = null;

let textFilterStored = null;

function areEqual(a, b) {
  if (a == null && b == null) {
    return true;
  }
  if (a != null || b != null) {
    return false;
  }
  return (
    a.length === b.length &&
    a.every(function (v, i) {
      return b[i] === v;
    })
  );
}

function getCountryValuesAsync(params) {
  const sportFilterModel = params.api.getFilterModel()["sport"];
  const countries = fakeServer.getCountries(sportFilterModel);
  // simulating real server call with a 500ms delay
  setTimeout(() => {
    params.success(countries);
  }, 500);
}

function getSportValuesAsync(params) {
  const sportFilterModel = params.api.getFilterModel()["sport"];
  const sports = fakeServer.getSports(selectedCountries, sportFilterModel);
  // simulating real server call with a 500ms delay
  setTimeout(() => {
    params.success(sports);
  }, 500);
}

const getServerSideDatasource = (server) => {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      // get data for request from our fake server
      const response = server.getData(params.request);
      // simulating real server call with a 500ms delay
      setTimeout(() => {
        if (response.success) {
          // supply rows for requested block to grid
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          params.fail();
        }
      }, 500);
    },
  };
};

const GridExample = () => {
  const gridRef = useRef(null);
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    {
      field: "country",
      filter: "agSetColumnFilter",
      valueFormatter: countryValueFormatter,
      filterParams: {
        values: getCountryValuesAsync,
        keyCreator: countryCodeKeyCreator,
        valueFormatter: countryValueFormatter,
        comparator: countryComparator,
      },
    },
    {
      field: "sport",
      filter: "agMultiColumnFilter",
      filterParams: {
        filters: [
          {
            filter: "agTextColumnFilter",
            filterParams: {
              defaultOption: "startsWith",
            },
          },
          {
            filter: "agSetColumnFilter",
            filterParams: {
              values: getSportValuesAsync,
            },
          },
        ],
      },
      menuTabs: ["filterMenuTab"],
    },
    { field: "athlete" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
    };
  }, []);

  const onFilterChanged = useCallback(() => {
    const countryFilterModel = gridRef.current.api.getFilterModel()["country"];
    const sportFilterModel = gridRef.current.api.getFilterModel()["sport"];
    const selected = countryFilterModel && countryFilterModel.values;
    const textFilter = sportFilterModel?.filterModels[0]
      ? sportFilterModel.filterModels[0]
      : null;
    if (
      !areEqual(selectedCountries, selected) ||
      !areEqual(textFilterStored, textFilter)
    ) {
      selectedCountries = selected;
      textFilterStored = textFilter;
      console.log("Refreshing sports filter");
      gridRef.current.api.getColumnFilterInstance("sport").then((filter) => {
        filter.getChildFilterInstance(1).refreshFilterValues();
      });
      gridRef.current.api.getColumnFilterInstance("country").then((filter) => {
        filter.refreshFilterValues();
      });
    }
  }, [textFilterStored]);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          ref={gridRef}
          rowData={data}
          loading={loading}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowModelType={"serverSide"}
          cacheBlockSize={100}
          maxBlocksInCache={10}
          onFilterChanged={onFilterChanged}
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

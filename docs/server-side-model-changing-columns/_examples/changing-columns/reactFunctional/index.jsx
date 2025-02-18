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
  ModuleRegistry,
  NumberFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const colDefCountry = { field: "country", rowGroup: true };

const colDefYear = { field: "year", rowGroup: true };

const colDefAthlete = {
  field: "athlete",
  filter: "agSetColumnFilter",
  filterParams: {
    values: getAthletesAsync,
  },
  suppressHeaderMenuButton: true,
  suppressHeaderContextMenu: true,
};

const colDefAge = { field: "age" };

const colDefSport = { field: "sport" };

const colDefGold = { field: "gold", aggFunc: "sum" };

const colDefSilver = { field: "silver", aggFunc: "sum" };

const colDefBronze = { field: "bronze", aggFunc: "sum" };

function getAthletesAsync(params) {
  const countries = fakeServer.getAthletes();
  // simulating real server call with a 500ms delay
  setTimeout(() => {
    params.success(countries);
  }, 500);
}

function getBooleanValue(cssSelector) {
  return document.querySelector(cssSelector).checked === true;
}

const getServerSideDatasource = (server) => {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      const response = server.getData(params.request);
      // adding delay to simulate real server call
      setTimeout(() => {
        if (response.success) {
          // call the success callback
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          // inform the grid request failed
          params.fail();
        }
      }, 200);
    },
  };
};

var fakeServer = undefined;

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    colDefAthlete,
    colDefAge,
    colDefCountry,
    colDefYear,
    colDefSport,
    colDefGold,
    colDefSilver,
    colDefBronze,
  ]);
  const defaultColDef = useMemo(() => {
    return {
      initialFlex: 1,
      minWidth: 120,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 200,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => {
        // setup the fake server with entire dataset
        fakeServer = new FakeServer(data);
        // create datasource with a reference to the fake server
        const datasource = getServerSideDatasource(fakeServer);
        // register the datasource with the grid
        params.api.setGridOption("serverSideDatasource", datasource);
      });

    document.getElementById("athlete").checked = true;
    document.getElementById("age").checked = true;
    document.getElementById("country").checked = true;
    document.getElementById("year").checked = true;
    document.getElementById("sport").checked = true;
    document.getElementById("gold").checked = true;
    document.getElementById("silver").checked = true;
    document.getElementById("bronze").checked = true;
  }, []);

  const onBtApply = useCallback(() => {
    const cols = [];
    if (getBooleanValue("#athlete")) {
      cols.push(colDefAthlete);
    }
    if (getBooleanValue("#age")) {
      cols.push(colDefAge);
    }
    if (getBooleanValue("#country")) {
      cols.push(colDefCountry);
    }
    if (getBooleanValue("#year")) {
      cols.push(colDefYear);
    }
    if (getBooleanValue("#sport")) {
      cols.push(colDefSport);
    }
    if (getBooleanValue("#gold")) {
      cols.push(colDefGold);
    }
    if (getBooleanValue("#silver")) {
      cols.push(colDefSilver);
    }
    if (getBooleanValue("#bronze")) {
      cols.push(colDefBronze);
    }
    gridRef.current.api.setGridOption("columnDefs", cols);
  }, [
    colDefAthlete,
    colDefAge,
    colDefCountry,
    colDefYear,
    colDefSport,
    colDefGold,
    colDefSilver,
    colDefBronze,
  ]);

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          Select columns to show then hit 'Apply'
        </div>

        <div className="test-header">
          <label>
            <input type="checkbox" id="athlete" />
            Athlete
          </label>
          <label>
            <input type="checkbox" id="age" />
            Age
          </label>
          <label>
            <input type="checkbox" id="country" />
            Country
          </label>
          <label>
            <input type="checkbox" id="year" />
            Year
          </label>
          <label>
            <input type="checkbox" id="sport" />
            Sport
          </label>

          <label>
            <input type="checkbox" id="gold" />
            Gold
          </label>
          <label>
            <input type="checkbox" id="silver" />
            Silver
          </label>
          <label>
            <input type="checkbox" id="bronze" />
            Bronze
          </label>

          <button onClick={onBtApply}>Apply</button>
        </div>

        <div style={gridStyle} className="test-grid">
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            maintainColumnOrder={true}
            rowModelType={"serverSide"}
            suppressAggFuncInHeader={true}
            onGridReady={onGridReady}
          />
        </div>
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

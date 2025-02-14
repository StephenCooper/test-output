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
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { PivotModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextFilterModule,
  ClientSideRowModelModule,
  PivotModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

function setIdText(id, value) {
  document.getElementById(id).textContent =
    value == undefined ? "undefined" : value + "";
}

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Athlete Details",
      children: [
        {
          field: "athlete",
          width: 150,
          suppressSizeToFit: true,
          enableRowGroup: true,
          rowGroupIndex: 0,
        },
        {
          field: "age",
          width: 90,
          minWidth: 75,
          maxWidth: 100,
          enableRowGroup: true,
        },
        {
          field: "country",
          enableRowGroup: true,
        },
        {
          field: "year",
          width: 90,
          enableRowGroup: true,
          pivotIndex: 0,
        },
        { field: "sport", width: 110, enableRowGroup: true },
        {
          field: "gold",
          enableValue: true,
          suppressHeaderMenuButton: true,
          filter: "agNumberColumnFilter",
          aggFunc: "sum",
        },
        {
          field: "silver",
          enableValue: true,
          suppressHeaderMenuButton: true,
          filter: "agNumberColumnFilter",
          aggFunc: "sum",
        },
        {
          field: "bronze",
          enableValue: true,
          suppressHeaderMenuButton: true,
          filter: "agNumberColumnFilter",
          aggFunc: "sum",
        },
        {
          field: "total",
          enableValue: true,
          suppressHeaderMenuButton: true,
          filter: "agNumberColumnFilter",
          aggFunc: "sum",
        },
      ],
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      floatingFilter: true,
      width: 120,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      width: 200,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  const setPivotOn = useCallback(() => {
    document.querySelector("#requiresPivot").className = "";
    document.querySelector("#requiresNotPivot").className = "hidden";
    gridRef.current.api.setGridOption("pivotMode", true);
    setIdText("pivot", "on");
  }, []);

  const setPivotOff = useCallback(() => {
    document.querySelector("#requiresPivot").className = "hidden";
    document.querySelector("#requiresNotPivot").className = "";
    gridRef.current.api.setGridOption("pivotMode", false);
    setIdText("pivot", "off");
  }, []);

  const setHeaderHeight = useCallback((value) => {
    gridRef.current.api.setGridOption("headerHeight", value);
    setIdText("headerHeight", value);
  }, []);

  const setGroupHeaderHeight = useCallback((value) => {
    gridRef.current.api.setGridOption("groupHeaderHeight", value);
    setIdText("groupHeaderHeight", value);
  }, []);

  const setFloatingFiltersHeight = useCallback((value) => {
    gridRef.current.api.setGridOption("floatingFiltersHeight", value);
    setIdText("floatingFiltersHeight", value);
  }, []);

  const setPivotGroupHeaderHeight = useCallback((value) => {
    gridRef.current.api.setGridOption("pivotGroupHeaderHeight", value);
    setIdText("pivotGroupHeaderHeight", value);
  }, []);

  const setPivotHeaderHeight = useCallback((value) => {
    gridRef.current.api.setGridOption("pivotHeaderHeight", value);
    setIdText("pivotHeaderHeight", value);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="button-bar example-header">
          <table>
            <tbody>
              <tr>
                <td className="labels">
                  pivot
                  <br />(<span id="pivot">off</span>)
                </td>
                <td className="buttons-container">
                  <button onClick={setPivotOn}>on</button>
                  <button onClick={setPivotOff}>off</button>
                </td>
              </tr>
              <tr>
                <td className="labels">
                  groupHeaderHeight
                  <br />(<span id="groupHeaderHeight">undefined</span>)
                </td>
                <td className="buttons-container">
                  <button onClick={() => setGroupHeaderHeight(40)}>40px</button>
                  <button onClick={() => setGroupHeaderHeight(60)}>60px</button>
                  <button onClick={() => setGroupHeaderHeight(undefined)}>
                    undefined
                  </button>
                </td>
                <td className="labels">
                  headerHeight
                  <br />(<span id="headerHeight">undefined</span>)
                </td>
                <td className="buttons-container">
                  <button onClick={() => setHeaderHeight(70)}>70px</button>
                  <button onClick={() => setHeaderHeight(80)}>80px</button>
                  <button onClick={() => setHeaderHeight(undefined)}>
                    undefined
                  </button>
                </td>
              </tr>
              <tr id="requiresPivot" className="hidden">
                <td className="labels">
                  pivotGroupHeaderHeight
                  <br />(<span id="pivotGroupHeaderHeight">undefined</span>)
                </td>
                <td className="buttons-container">
                  <button onClick={() => setPivotGroupHeaderHeight(50)}>
                    50px
                  </button>
                  <button onClick={() => setPivotGroupHeaderHeight(70)}>
                    70px
                  </button>
                  <button onClick={() => setPivotGroupHeaderHeight(undefined)}>
                    undefined
                  </button>
                </td>
                <td className="labels">
                  pivotHeaderHeight
                  <br />(<span id="pivotHeaderHeight">undefined</span>)
                </td>
                <td className="buttons-container">
                  <button onClick={() => setPivotHeaderHeight(60)}>60px</button>
                  <button onClick={() => setPivotHeaderHeight(80)}>80px</button>
                  <button onClick={() => setPivotHeaderHeight(undefined)}>
                    undefined
                  </button>
                </td>
              </tr>
              <tr id="requiresNotPivot">
                <td className="labels">
                  floatingFiltersHeight
                  <br />(<span id="floatingFiltersHeight">undefined</span>)
                </td>
                <td className="buttons-container">
                  <button onClick={() => setFloatingFiltersHeight(35)}>
                    35px
                  </button>
                  <button onClick={() => setFloatingFiltersHeight(55)}>
                    55px
                  </button>
                  <button onClick={() => setFloatingFiltersHeight(undefined)}>
                    undefined
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
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

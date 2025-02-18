"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./style.css";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
  IntegratedChartsModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ClipboardModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ValidationModule /* Development Only */,
]);

function createFlagImg(flag) {
  return (
    '<img border="0" width="15" height="10" src="https://flags.fmcdn.net/data/flags/mini/' +
    flag +
    '.png"/>'
  );
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", minWidth: 200 },
    { field: "age" },
    { field: "country", minWidth: 200 },
    { field: "year" },
    { field: "date", minWidth: 180 },
    { field: "sport", minWidth: 200 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  const getContextMenuItems = useCallback(
    (params) => {
      const result = [
        {
          // custom item
          name: "Alert " + params.value,
          action: () => {
            window.alert("Alerting about " + params.value);
          },
          cssClasses: ["red", "bold"],
        },
        {
          // custom item
          name: "Always Disabled",
          disabled: true,
          tooltip:
            "Very long tooltip, did I mention that I am very long, well I am! Long!  Very Long!",
        },
        {
          name: "Country",
          subMenu: [
            {
              name: "Ireland",
              action: () => {
                console.log("Ireland was pressed");
              },
              icon: createFlagImg("ie"),
            },
            {
              name: "UK",
              action: () => {
                console.log("UK was pressed");
              },
              icon: createFlagImg("gb"),
            },
            {
              name: "France",
              action: () => {
                console.log("France was pressed");
              },
              icon: createFlagImg("fr"),
            },
          ],
        },
        {
          name: "Person",
          subMenu: [
            {
              name: "Niall",
              action: () => {
                console.log("Niall was pressed");
              },
            },
            {
              name: "Sean",
              action: () => {
                console.log("Sean was pressed");
              },
            },
            {
              name: "John",
              action: () => {
                console.log("John was pressed");
              },
            },
            {
              name: "Alberto",
              action: () => {
                console.log("Alberto was pressed");
              },
            },
            {
              name: "Tony",
              action: () => {
                console.log("Tony was pressed");
              },
            },
            {
              name: "Andrew",
              action: () => {
                console.log("Andrew was pressed");
              },
            },
            {
              name: "Kev",
              action: () => {
                console.log("Kev was pressed");
              },
            },
            {
              name: "Will",
              action: () => {
                console.log("Will was pressed");
              },
            },
            {
              name: "Armaan",
              action: () => {
                console.log("Armaan was pressed");
              },
            },
          ],
        },
        "separator",
        {
          // custom item
          name: "Windows",
          shortcut: "Alt + W",
          action: () => {
            console.log("Windows Item Selected");
          },
          icon: '<img src="https://www.ag-grid.com/example-assets/skills/windows.png" />',
        },
        {
          // custom item
          name: "Mac",
          shortcut: "Alt + M",
          action: () => {
            console.log("Mac Item Selected");
          },
          icon: '<img src="https://www.ag-grid.com/example-assets/skills/mac.png"/>',
        },
        "separator",
        {
          // custom item
          name: "Checked",
          checked: true,
          action: () => {
            console.log("Checked Selected");
          },
          icon: '<img src="https://www.ag-grid.com/example-assets/skills/mac.png"/>',
        },
        "copy",
        "separator",
        "chartRange",
      ];
      if (params.column?.getColId() === "country") {
        return new Promise((res) => setTimeout(() => res(result), 150));
      }
      return result;
    },
    [window],
  );

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          cellSelection={true}
          allowContextMenuWithControlKey={true}
          getContextMenuItems={getContextMenuItems}
          onGridReady={onGridReady}
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

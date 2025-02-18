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
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DefaultMenuItem,
  GetMainMenuItemsParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  MenuItemDef,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 200 },
    {
      field: "age",
      mainMenuItems: (params: GetMainMenuItemsParams) => {
        const athleteMenuItems: (MenuItemDef | DefaultMenuItem)[] =
          params.defaultItems.slice(0);
        athleteMenuItems.push({
          name: "A Custom Item",
          action: () => {
            console.log("A Custom Item selected");
          },
        });
        athleteMenuItems.push({
          name: "Another Custom Item",
          action: () => {
            console.log("Another Custom Item selected");
          },
        });
        athleteMenuItems.push({
          name: "Custom Sub Menu",
          subMenu: [
            {
              name: "Black",
              action: () => {
                console.log("Black was pressed");
              },
            },
            {
              name: "White",
              action: () => {
                console.log("White was pressed");
              },
            },
            {
              name: "Grey",
              action: () => {
                console.log("Grey was pressed");
              },
            },
          ],
        });
        return athleteMenuItems;
      },
    },
    {
      field: "country",
      minWidth: 200,
      mainMenuItems: [
        {
          // our own item with an icon
          name: "A Custom Item",
          action: () => {
            console.log("A Custom Item selected");
          },
          icon: '<img src="https://www.ag-grid.com/example-assets/lab.png" style="width: 14px;" />',
        },
        {
          // our own icon with a check box
          name: "Another Custom Item",
          action: () => {
            console.log("Another Custom Item selected");
          },
          checked: true,
        },
        "resetColumns", // a built in item
      ],
    },
    {
      field: "year",
      mainMenuItems: (params: GetMainMenuItemsParams) => {
        const menuItems: (MenuItemDef | DefaultMenuItem)[] = [];
        const itemsToExclude = ["separator", "pinSubMenu", "valueAggSubMenu"];
        params.defaultItems.forEach((item) => {
          if (itemsToExclude.indexOf(item) < 0) {
            menuItems.push(item);
          }
        });
        return menuItems;
      },
    },
    { field: "sport", minWidth: 200 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
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

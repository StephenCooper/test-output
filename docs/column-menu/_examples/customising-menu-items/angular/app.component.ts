import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
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
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
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
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}

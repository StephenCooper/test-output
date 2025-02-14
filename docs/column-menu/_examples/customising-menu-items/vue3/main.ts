import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
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
  createGrid,
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

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
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
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
    });
    const rowData = ref<IOlympicData[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

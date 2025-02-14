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
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  RowDragModule,
  SideBarDef,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  PivotModule,
  SideBarModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  RowDragModule,
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  PivotModule,
  SideBarModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const myIcons = {
  sortAscending: () => {
    return "ASC";
  },
  sortDescending: () => {
    return "DESC";
  },
};

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :sideBar="true"
      :autoGroupColumnDef="autoGroupColumnDef"
      :icons="icons"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        field: "athlete",
        rowGroup: true,
        hide: true,
      },
      {
        field: "age",
        width: 90,
        enableValue: true,
        icons: {
          // not very useful, but demonstrates you can just have strings
          sortAscending: "U",
          sortDescending: "D",
        },
      },
      {
        field: "country",
        width: 150,
        rowGroupIndex: 0,
        icons: {
          sortAscending: '<i class="fa fa-sort-alpha-up"/>',
          sortDescending: '<i class="fa fa-sort-alpha-down"/>',
        },
      },
      { field: "year", width: 90, enableRowGroup: true },
      { field: "date" },
      {
        field: "sport",
        width: 110,
        icons: myIcons,
      },
      { field: "gold", width: 100 },
      { field: "silver", width: 100 },
      { field: "bronze", width: 100 },
      { field: "total", width: 100 },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 150,
      filter: true,
      floatingFilter: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    });
    const autoGroupColumnDef = ref<ColDef>({
      headerName: "Athlete",
      field: "athlete",
      rowDrag: true,
      // use font awesome for first col, with numbers for sort
      icons: {
        menu: '<i class="fa fa-shower"/>',
        menuAlt: '<i class="fa fa-shower"/>',
        filter: '<i class="fa fa-long-arrow-alt-up"/>',
        columns: '<i class="fa fa-snowflake"/>',
        sortAscending: '<i class="fa fa-sort-alpha-up"/>',
        sortDescending: '<i class="fa fa-sort-alpha-down"/>',
      },
      width: 300,
    });
    const icons = ref<{
      [key: string]: ((...args: any[]) => any) | string;
    }>({
      // use font awesome for menu icons
      menu: '<i class="fa fa-bath" style="width: 10px"/>',
      menuAlt: '<i class="fa fa-bath" style="width: 10px"/>',
      filter: '<i class="fa fa-long-arrow-alt-down"/>',
      columns: '<i class="fa fa-handshake"/>',
      sortAscending: '<i class="fa fa-long-arrow-alt-down"/>',
      sortDescending: '<i class="fa fa-long-arrow-alt-up"/>',
      // use some strings from group
      groupExpanded:
        '<img src="https://www.ag-grid.com/example-assets/group/contract.png" style="height: 12px; width: 12px;padding-right: 2px"/>',
      groupContracted:
        '<img src="https://www.ag-grid.com/example-assets/group/expand.png" style="height: 12px; width: 12px;padding-right: 2px"/>',
      columnMovePin: '<i class="far fa-hand-rock"/>',
      columnMoveAdd: '<i class="fa fa-plus-square"/>',
      columnMoveHide: '<i class="fa fa-times"/>',
      columnMoveMove: '<i class="fa fa-link"/>',
      columnMoveLeft: '<i class="fa fa-arrow-left"/>',
      columnMoveRight: '<i class="fa fa-arrow-right"/>',
      columnMoveGroup: '<i class="fa fa-users"/>',
      rowGroupPanel: '<i class="fa fa-university"/>',
      pivotPanel: '<i class="fa fa-magic"/>',
      valuePanel: '<i class="fa fa-magnet"/>',
      menuPin: "P",
      menuValue: "V",
      menuAddRowGroup: "A",
      menuRemoveRowGroup: "R",
      clipboardCopy: ">>",
      clipboardCut: "<<",
      clipboardPaste: ">>",
      rowDrag: '<i class="fa fa-circle"/>',
      columnDrag: '<i class="fa fa-square"/>',
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
      autoGroupColumnDef,
      icons,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

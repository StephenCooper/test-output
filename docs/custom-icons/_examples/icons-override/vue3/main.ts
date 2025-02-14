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
  NumberEditorModule,
  NumberFilterModule,
  SideBarDef,
  TextEditorModule,
  Theme,
  ValidationModule,
  createGrid,
  iconOverrides,
  themeQuartz,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  PivotModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

const myTheme = themeQuartz
  .withPart(
    iconOverrides({
      type: "image",
      icons: {
        filter: {
          url: "https://www.ag-grid.com/example-assets/svg-icons/filter.svg",
        },
      },
    }),
  )
  .withPart(
    iconOverrides({
      type: "image",
      mask: true,
      icons: {
        "menu-alt": {
          url: "https://www.ag-grid.com/example-assets/svg-icons/menu-alt.svg",
        },
      },
    }),
  )
  .withPart(
    iconOverrides({
      type: "font",
      icons: {
        columns: "🏛️",
      },
    }),
  )
  .withPart(
    iconOverrides({
      cssImports: ["https://use.fontawesome.com/releases/v5.6.3/css/all.css"],
      type: "font",
      weight: "bold",
      family: "Font Awesome 5 Free",
      color: "green",
      icons: {
        asc: "\u{f062}",
        desc: "\u{f063}",
        "tree-closed": "\u{f105}",
        "tree-indeterminate": "\u{f068}",
        "tree-open": "\u{f107}",
      },
    }),
  )
  .withPart(
    iconOverrides({
      cssImports: [
        "https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.css",
      ],
      type: "font",
      family: "Material Design Icons",
      color: "red",
      icons: {
        group: "\u{F0328}",
        aggregation: "\u{F02C3}",
      },
    }),
  );

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :theme="theme"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      :autoGroupColumnDef="autoGroupColumnDef"
      :sideBar="true"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "country", sort: "asc", rowGroup: true, hide: true },
      { field: "athlete", minWidth: 170 },
      { field: "age" },
      { field: "year" },
      { field: "date" },
      { field: "sport" },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ]);
    const theme = ref<Theme | "legacy">(myTheme);
    const defaultColDef = ref<ColDef>({
      editable: true,
      filter: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    });
    const autoGroupColumnDef = ref<ColDef>({
      headerName: "Country",
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
      theme,
      rowData,
      defaultColDef,
      autoGroupColumnDef,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

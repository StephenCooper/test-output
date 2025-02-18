import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HeaderValueGetterParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  ValueGetterParams,
} from "ag-grid-community";
import {
  AdvancedFilterModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  AdvancedFilterModule,
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

function valueGetter(params: ValueGetterParams<IOlympicData, number>) {
  return params.data ? params.data[params.colDef.field!] * -1 : null;
}

let includeHiddenColumns = false;

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header">
        <button id="includeHiddenColumns" v-on:click="onIncludeHiddenColumnsToggled()">Include Hidden Columns</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :groupDefaultExpanded="groupDefaultExpanded"
        :enableAdvancedFilter="true"
        :rowData="rowData"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<(ColDef | ColGroupDef)[]>([
      {
        field: "athlete",
        filterParams: {
          caseSensitive: true,
          filterOptions: ["contains"],
        },
      },
      { field: "country", rowGroup: true, hide: true },
      { field: "sport", hide: true },
      { field: "age", minWidth: 100, filter: false },
      {
        headerName: "Medals (+)",
        children: [
          { field: "gold", minWidth: 100 },
          { field: "silver", minWidth: 100 },
          { field: "bronze", minWidth: 100 },
        ],
      },
      {
        headerName: "Medals (-)",
        children: [
          {
            field: "gold",
            headerValueGetter: (
              params: HeaderValueGetterParams<IOlympicData, number>,
            ) => (params.location === "advancedFilter" ? "Gold (-)" : "Gold"),
            valueGetter: valueGetter,
            cellDataType: "number",
            minWidth: 100,
          },
          {
            field: "silver",
            headerValueGetter: (
              params: HeaderValueGetterParams<IOlympicData, number>,
            ) =>
              params.location === "advancedFilter" ? "Silver (-)" : "Silver",
            valueGetter: valueGetter,
            cellDataType: "number",
            minWidth: 100,
          },
          {
            field: "bronze",
            headerValueGetter: (
              params: HeaderValueGetterParams<IOlympicData, number>,
            ) =>
              params.location === "advancedFilter" ? "Bronze (-)" : "Bronze",
            valueGetter: valueGetter,
            cellDataType: "number",
            minWidth: 100,
          },
        ],
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 180,
      filter: true,
    });
    const groupDefaultExpanded = ref(1);
    const rowData = ref<IOlympicData[]>(null);

    function onIncludeHiddenColumnsToggled() {
      includeHiddenColumns = !includeHiddenColumns;
      gridApi.value!.setGridOption(
        "includeHiddenColumnsInAdvancedFilter",
        includeHiddenColumns,
      );
      document.querySelector("#includeHiddenColumns")!.textContent =
        `${includeHiddenColumns ? "Exclude" : "Include"} Hidden Columns`;
    }
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
      groupDefaultExpanded,
      rowData,
      onGridReady,
      onIncludeHiddenColumnsToggled,
    };
  },
});

createApp(VueExample).mount("#app");

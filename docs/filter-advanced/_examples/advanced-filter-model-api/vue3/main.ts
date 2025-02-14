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
  AdvancedFilterModel,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  GridState,
  GridStateModule,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  AdvancedFilterModule,
  ColumnMenuModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  GridStateModule,
  AdvancedFilterModule,
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const initialAdvancedFilterModel: AdvancedFilterModel = {
  filterType: "join",
  type: "AND",
  conditions: [
    {
      filterType: "join",
      type: "OR",
      conditions: [
        {
          filterType: "number",
          colId: "age",
          type: "greaterThan",
          filter: 23,
        },
        {
          filterType: "text",
          colId: "sport",
          type: "endsWith",
          filter: "ing",
        },
      ],
    },
    {
      filterType: "text",
      colId: "country",
      type: "contains",
      filter: "united",
    },
  ],
};

let savedFilterModel: AdvancedFilterModel | null = null;

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div>
        <div class="button-group">
          <button v-on:click="saveFilterModel()">Save Advanced Filter Model</button>
          <button v-on:click="restoreFilterModel()">Restore Saved Advanced Filter Model</button>
          <button v-on:click="restoreFromHardCoded()" title="[Gold] >= 1">Set Custom Advanced Filter Model</button>
          <button v-on:click="clearFilter()">Clear Advanced Filter</button>
        </div>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :enableAdvancedFilter="true"
        :initialState="initialState"
        :rowData="rowData"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete" },
      { field: "country" },
      { field: "sport" },
      { field: "age", minWidth: 100 },
      { field: "gold", minWidth: 100 },
      { field: "silver", minWidth: 100 },
      { field: "bronze", minWidth: 100 },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 180,
      filter: true,
    });
    const initialState = ref<GridState>({
      filter: {
        advancedFilterModel: initialAdvancedFilterModel,
      },
    });
    const rowData = ref<IOlympicData[]>(null);

    function saveFilterModel() {
      savedFilterModel = gridApi.value!.getAdvancedFilterModel();
    }
    function restoreFilterModel() {
      gridApi.value!.setAdvancedFilterModel(savedFilterModel);
    }
    function restoreFromHardCoded() {
      gridApi.value!.setAdvancedFilterModel({
        filterType: "number",
        colId: "gold",
        type: "greaterThanOrEqual",
        filter: 1,
      });
    }
    function clearFilter() {
      gridApi.value!.setAdvancedFilterModel(null);
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
      initialState,
      rowData,
      onGridReady,
      saveFilterModel,
      restoreFilterModel,
      restoreFromHardCoded,
      clearFilter,
    };
  },
});

createApp(VueExample).mount("#app");

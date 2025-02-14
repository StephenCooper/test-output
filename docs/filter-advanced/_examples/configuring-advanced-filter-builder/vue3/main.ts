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
  AdvancedFilterBuilderVisibleChangedEvent,
  AdvancedFilterModel,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  GridState,
  GridStateModule,
  IAdvancedFilterBuilderParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
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

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div id="wrapper" class="example-wrapper">
      <div class="example-header">
        <div id="advancedFilterParent" class="parent"></div>
        <button id="advancedFilterBuilderButton" v-on:click="showBuilder()">Advanced Filter Builder</button>
        <i id="advancedFilterIcon" class="fa fa-filter filter-icon"></i>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :advancedFilterBuilderParams="advancedFilterBuilderParams"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :enableAdvancedFilter="true"
        :popupParent="popupParent"
        :initialState="initialState"
        :rowData="rowData"
        @advanced-filter-builder-visible-changed="onAdvancedFilterBuilderVisibleChanged"
        @filter-changed="onFilterChanged"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const advancedFilterBuilderParams = ref<IAdvancedFilterBuilderParams>({
      showMoveButtons: true,
    });
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
    const popupParent = ref<HTMLElement | null>(
      document.getElementById("wrapper"),
    );
    const initialState = ref<GridState>({
      filter: {
        advancedFilterModel: initialAdvancedFilterModel,
      },
    });
    const rowData = ref<IOlympicData[]>(null);

    function onAdvancedFilterBuilderVisibleChanged(
      event: AdvancedFilterBuilderVisibleChangedEvent<IOlympicData>,
    ) {
      const eButton = document.getElementById("advancedFilterBuilderButton")!;
      if (event.visible) {
        eButton.setAttribute("disabled", "");
      } else {
        eButton.removeAttribute("disabled");
      }
    }
    function onFilterChanged() {
      const advancedFilterApplied = !!gridApi.value!.getAdvancedFilterModel();
      document
        .getElementById("advancedFilterIcon")!
        .classList.toggle("filter-icon-disabled", !advancedFilterApplied);
    }
    function showBuilder() {
      gridApi.value!.showAdvancedFilterBuilder();
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      // Could also be provided via grid option `advancedFilterParent`.
      // Setting the parent removes the Advanced Filter input from the grid,
      // allowing the Advanced Filter to be edited only via the Builder, launched via the API.
      params.api.setGridOption(
        "advancedFilterParent",
        document.getElementById("advancedFilterParent"),
      );

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      advancedFilterBuilderParams,
      columnDefs,
      defaultColDef,
      popupParent,
      initialState,
      rowData,
      onGridReady,
      onAdvancedFilterBuilderVisibleChanged,
      onFilterChanged,
      showBuilder,
    };
  },
});

createApp(VueExample).mount("#app");

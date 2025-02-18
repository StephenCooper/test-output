import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IMultiFilter,
  IMultiFilterParams,
  ISetFilter,
  ITextFilterParams,
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  MultiFilterModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  MultiFilterModule,
  SetFilterModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 1rem">
        <button v-on:click="getTextModel()">Print Text Filter model</button>
        <button v-on:click="getSetMiniFilter()">Print Set Filter search text</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
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
      {
        field: "athlete",
        filter: "agMultiColumnFilter",
        filterParams: {
          filters: [
            {
              filter: "agTextColumnFilter",
              filterParams: {
                buttons: ["apply", "clear"],
              } as ITextFilterParams,
            },
            {
              filter: "agSetColumnFilter",
            },
          ],
        } as IMultiFilterParams,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 200,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
    });
    const rowData = ref<IOlympicData[]>(null);

    function getTextModel() {
      gridApi
        .value!.getColumnFilterInstance<IMultiFilter>("athlete")
        .then((multiFilterInstance) => {
          const textFilter = multiFilterInstance!.getChildFilterInstance(0)!;
          console.log("Current Text Filter model: ", textFilter.getModel());
        });
    }
    function getSetMiniFilter() {
      gridApi
        .value!.getColumnFilterInstance<IMultiFilter>("athlete")
        .then((multiFilterInstance) => {
          const setFilter = multiFilterInstance!.getChildFilterInstance(
            1,
          ) as ISetFilter;
          console.log(
            "Current Set Filter search text: ",
            setFilter.getMiniFilter(),
          );
        });
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
      rowData,
      onGridReady,
      getTextModel,
      getSetMiniFilter,
    };
  },
});

createApp(VueExample).mount("#app");

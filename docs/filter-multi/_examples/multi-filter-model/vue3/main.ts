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
  DateFilterModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDateFilterParams,
  IMultiFilterParams,
  ISetFilterParams,
  ITextFilterParams,
  ModuleRegistry,
  NumberFilterModule,
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
  NumberFilterModule,
  DateFilterModule,
  ValidationModule /* Development Only */,
]);

const dateFilterParams: IMultiFilterParams = {
  filters: [
    {
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: (filterDate: Date, cellValue: string) => {
          if (cellValue == null) return -1;
          return getDate(cellValue).getTime() - filterDate.getTime();
        },
      } as IDateFilterParams,
    },
    {
      filter: "agSetColumnFilter",
      filterParams: {
        comparator: (a: string, b: string) => {
          return getDate(a).getTime() - getDate(b).getTime();
        },
      } as ISetFilterParams,
    },
  ],
};

function getDate(value: string) {
  const dateParts = value.split("/");
  return new Date(
    Number(dateParts[2]),
    Number(dateParts[1]) - 1,
    Number(dateParts[0]),
  );
}

let savedFilterState: Record<string, any>;

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 1rem">
        <button v-on:click="printState()">Print State</button>
        <button v-on:click="saveState()">Save State</button>
        <button v-on:click="restoreState()">Restore State</button>
        <button v-on:click="resetState()">Reset State</button>
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
      { field: "athlete", filter: "agMultiColumnFilter" },
      {
        field: "country",
        filter: "agMultiColumnFilter",
        filterParams: {
          filters: [
            {
              filter: "agTextColumnFilter",
              filterParams: {
                defaultOption: "startsWith",
              } as ITextFilterParams,
            },
            {
              filter: "agSetColumnFilter",
            },
          ],
        } as IMultiFilterParams,
      },
      {
        field: "gold",
        filter: "agMultiColumnFilter",
        filterParams: {
          filters: [
            {
              filter: "agNumberColumnFilter",
            },
            {
              filter: "agSetColumnFilter",
            },
          ],
        } as IMultiFilterParams,
      },
      {
        field: "date",
        filter: "agMultiColumnFilter",
        filterParams: dateFilterParams,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 200,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
    });
    const rowData = ref<IOlympicData[]>(null);

    function printState() {
      const filterState = gridApi.value!.getFilterModel();
      console.log("Current filter state: ", filterState);
    }
    function saveState() {
      savedFilterState = gridApi.value!.getFilterModel();
      console.log("Filter state saved");
    }
    function restoreState() {
      gridApi.value!.setFilterModel(savedFilterState);
      console.log("Filter state restored");
    }
    function resetState() {
      gridApi.value!.setFilterModel(null);
      console.log("Filter state reset");
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
      printState,
      saveState,
      restoreState,
      resetState,
    };
  },
});

createApp(VueExample).mount("#app");

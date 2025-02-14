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
  ITextFilterParams,
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);

function contains(target: string, lookingFor: string) {
  return target && target.indexOf(lookingFor) >= 0;
}

const athleteFilterParams: ITextFilterParams = {
  filterOptions: ["contains", "notContains"],
  textFormatter: (r) => {
    if (r == null) return null;
    return r
      .toLowerCase()
      .replace(/[àáâãäå]/g, "a")
      .replace(/æ/g, "ae")
      .replace(/ç/g, "c")
      .replace(/[èéêë]/g, "e")
      .replace(/[ìíîï]/g, "i")
      .replace(/ñ/g, "n")
      .replace(/[òóôõö]/g, "o")
      .replace(/œ/g, "oe")
      .replace(/[ùúûü]/g, "u")
      .replace(/[ýÿ]/g, "y");
  },
  debounceMs: 200,
  maxNumConditions: 1,
};

const countryFilterParams: ITextFilterParams = {
  filterOptions: ["contains"],
  textMatcher: ({ value, filterText }) => {
    const aliases: Record<string, string> = {
      usa: "united states",
      holland: "netherlands",
      niall: "ireland",
      sean: "south africa",
      alberto: "mexico",
      john: "australia",
      xi: "china",
    };
    const literalMatch = contains(value, filterText || "");
    return !!literalMatch || !!contains(value, aliases[filterText || ""]);
  },
  trimInput: true,
  debounceMs: 1000,
};

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
      {
        field: "athlete",
        filterParams: athleteFilterParams,
      },
      {
        field: "country",
        filter: "agTextColumnFilter",
        filterParams: countryFilterParams,
      },
      {
        field: "sport",
        filter: "agTextColumnFilter",
        filterParams: {
          caseSensitive: true,
          defaultOption: "startsWith",
        } as ITextFilterParams,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      filter: true,
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

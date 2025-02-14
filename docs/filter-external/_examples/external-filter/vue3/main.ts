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
  DateFilterModule,
  ExternalFilterModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDateFilterParams,
  IRowNode,
  IsExternalFilterPresentParams,
  ModuleRegistry,
  NumberFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ExternalFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ValidationModule /* Development Only */,
]);

const dateFilterParams: IDateFilterParams = {
  comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
    const cellDate = asDate(cellValue);
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
    return 0;
  },
};

let ageType = "everyone";

function asDate(dateAsString: string) {
  const splitFields = dateAsString.split("/");
  return new Date(
    Number.parseInt(splitFields[2]),
    Number.parseInt(splitFields[1]) - 1,
    Number.parseInt(splitFields[0]),
  );
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">
        <label>
          <input type="radio" name="filter" id="everyone" v-on:change="externalFilterChanged('everyone')">
            Everyone
          </label>
          <label>
            <input type="radio" name="filter" id="below25" v-on:change="externalFilterChanged('below25')">
              Below 25
            </label>
            <label>
              <input type="radio" name="filter" id="between25and50" v-on:change="externalFilterChanged('between25and50')">
                Between 25 and 50
              </label>
              <label>
                <input type="radio" name="filter" id="above50" v-on:change="externalFilterChanged('above50')">
                  Above 50
                </label>
                <label>
                  <input type="radio" name="filter" id="dateAfter2008" v-on:change="externalFilterChanged('dateAfter2008')">
                    After 01/01/2008
                  </label>
                </div>
                <ag-grid-vue
                  style="width: 100%; height: 100%;"
                  @grid-ready="onGridReady"
                  :columnDefs="columnDefs"
                  :defaultColDef="defaultColDef"
                  :isExternalFilterPresent="isExternalFilterPresent"
                  :doesExternalFilterPass="doesExternalFilterPass"
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
      { field: "athlete", minWidth: 180 },
      { field: "age", filter: "agNumberColumnFilter", maxWidth: 80 },
      { field: "country" },
      { field: "year", maxWidth: 90 },
      {
        field: "date",
        filter: "agDateColumnFilter",
        filterParams: dateFilterParams,
      },
      { field: "gold", filter: "agNumberColumnFilter" },
      { field: "silver", filter: "agNumberColumnFilter" },
      { field: "bronze", filter: "agNumberColumnFilter" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 120,
      filter: true,
    });
    const rowData = ref<IOlympicData[]>(null);

    function externalFilterChanged(newValue: string) {
      ageType = newValue;
      gridApi.value!.onFilterChanged();
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        (document.querySelector("#everyone") as HTMLInputElement).checked =
          true;
        rowData.value = data;
      };

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };
    const isExternalFilterPresent: () => boolean = () => {
      // if ageType is not everyone, then we are filtering
      return ageType !== "everyone";
    };
    const doesExternalFilterPass: (node: IRowNode<IOlympicData>) => boolean = (
      node: IRowNode<IOlympicData>,
    ) => {
      if (node.data) {
        switch (ageType) {
          case "below25":
            return node.data.age < 25;
          case "between25and50":
            return node.data.age >= 25 && node.data.age <= 50;
          case "above50":
            return node.data.age > 50;
          case "dateAfter2008":
            return asDate(node.data.date) > new Date(2008, 1, 1);
          default:
            return true;
        }
      }
      return true;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      isExternalFilterPresent,
      doesExternalFilterPass,
      rowData,
      onGridReady,
      externalFilterChanged,
    };
  },
});

createApp(VueExample).mount("#app");

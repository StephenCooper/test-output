import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  CellSelectionOptions,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FillEndEvent,
  FillStartEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { CellSelectionModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);

const daysList = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function createRowData(rowData: any[]) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  for (let i = 0; i < rowData.length; i++) {
    const dt = new Date(
      getRandom(currentYear - 10, currentYear + 10),
      getRandom(0, 12),
      getRandom(1, 25),
    );
    rowData[i].dayOfTheWeek = daysList[dt.getDay()];
  }
  return rowData;
}

var getRandom = function (start: number, finish: number) {
  return Math.floor(Math.random() * (finish - start) + start);
};

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :cellSelection="cellSelection"
      :rowData="rowData"
      @fill-start="onFillStart"
      @fill-end="onFillEnd"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", minWidth: 150 },
      { headerName: "Day of the Week", field: "dayOfTheWeek", minWidth: 180 },
      { field: "age", maxWidth: 90 },
      { field: "country", minWidth: 150 },
      { field: "year", maxWidth: 90 },
      { field: "date", minWidth: 150 },
      { field: "sport", minWidth: 150 },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
      editable: true,
      cellDataType: false,
    });
    const cellSelection = ref<boolean | CellSelectionOptions>({
      handle: {
        mode: "fill",
        setFillValue(params) {
          const hasNonDayValues = params.initialValues.some(function (val) {
            return daysList.indexOf(val) === -1;
          });
          if (hasNonDayValues) {
            return false;
          }
          const lastValue = params.values[params.values.length - 1];
          const idxOfLast = daysList.indexOf(lastValue);
          const nextDay = daysList[(idxOfLast + 1) % daysList.length];
          console.log("Custom Fill Operation -> Next Day is:", nextDay);
          return nextDay;
        },
      },
    });
    const rowData = ref<any[]>(null);

    function onFillStart(event: FillStartEvent) {
      console.log("Fill Start", event);
    }
    function onFillEnd(event: FillEndEvent) {
      console.log("Fill End", event);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        params.api!.setGridOption("rowData", createRowData(data));
      };

      fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      cellSelection,
      rowData,
      onGridReady,
      onFillStart,
      onFillEnd,
    };
  },
});

createApp(VueExample).mount("#app");

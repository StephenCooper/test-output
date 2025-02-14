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
  CellClassParams,
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColTypeDef,
  EditableCallbackParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  RowApiModule,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  RowApiModule,
  NumberEditorModule,
  TextEditorModule,
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let editableYear = 2012;

function isCellEditable(params: EditableCallbackParams | CellClassParams) {
  return params.data.year === editableYear;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button style="font-size: 12px" v-on:click="setEditableYear(2008)">Enable Editing for 2008</button>
        <button style="font-size: 12px" v-on:click="setEditableYear(2012)">Enable Editing for 2012</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :columnTypes="columnTypes"
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
      { field: "athlete", type: "editableColumn" },
      { field: "age", type: "editableColumn" },
      { field: "year" },
      { field: "country" },
      { field: "sport" },
      { field: "total" },
    ]);
    const columnTypes = ref<{
      [key: string]: ColTypeDef;
    }>({
      editableColumn: {
        editable: (params: EditableCallbackParams<IOlympicData>) => {
          return isCellEditable(params);
        },
        cellStyle: (params: CellClassParams<IOlympicData>) => {
          if (isCellEditable(params)) {
            return { backgroundColor: "#2244CC44" };
          }
        },
      },
    });
    const rowData = ref<IOlympicData[]>(null);

    function setEditableYear(year: number) {
      editableYear = year;
      // Redraw to re-apply the new cell style
      gridApi.value!.redrawRows();
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
      columnTypes,
      rowData,
      onGridReady,
      setEditableYear,
    };
  },
});

createApp(VueExample).mount("#app");

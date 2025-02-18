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
  CustomFilterModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import PartialMatchFilter from "./partialMatchFilterVue";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextFilterModule,
  TextEditorModule,
  CustomFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <button style="margin-bottom: 5px" v-on:click="onClicked()" class="btn btn-primary">
        Invoke Filter Instance Method
      </button>
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
    PartialMatchFilter,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "row" },
      {
        field: "name",
        filter: "PartialMatchFilter",
      },
    ]);
    const defaultColDef = ref<ColDef>({
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    });
    const rowData = ref<any[] | null>(getData());

    function onClicked() {
      gridApi
        .value!.getColumnFilterInstance<PartialMatchFilter>("name")
        .then((instance) => {
          instance!.componentMethod("Hello World!");
        });
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      onGridReady,
      onClicked,
    };
  },
});

createApp(VueExample).mount("#app");

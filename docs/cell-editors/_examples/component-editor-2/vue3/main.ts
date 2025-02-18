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
  CustomEditorModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { RichSelectModule } from "ag-grid-enterprise";
import GenderRenderer from "./genderRendererVue";
import MoodEditor from "./moodEditorVue";
import MoodRenderer from "./moodRendererVue";
import SimpleTextEditor from "./simpleTextEditorVue";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RichSelectModule,
  NumberEditorModule,
  TextEditorModule,
  CustomEditorModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    GenderRenderer,
    MoodEditor,
    MoodRenderer,
    SimpleTextEditor,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "first_name", headerName: "Provided Text" },
      {
        field: "last_name",
        headerName: "Custom Text",
        cellEditor: "SimpleTextEditor",
      },
      {
        field: "age",
        headerName: "Provided Number",
        cellEditor: "agNumberCellEditor",
      },
      {
        field: "gender",
        headerName: "Provided Rich Select",
        cellRenderer: "GenderRenderer",
        cellEditor: "agRichSelectCellEditor",
        cellEditorParams: {
          cellRenderer: "GenderRenderer",
          values: ["Male", "Female"],
        },
      },
      {
        field: "mood",
        headerName: "Custom Mood",
        cellRenderer: "MoodRenderer",
        cellEditor: "MoodEditor",
        cellEditorPopup: true,
      },
    ]);
    const rowData = ref<any[] | null>(getData());
    const defaultColDef = ref<ColDef>({
      editable: true,
      flex: 1,
      minWidth: 100,
    });

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      rowData,
      defaultColDef,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

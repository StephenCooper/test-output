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
  createGrid,
} from "ag-grid-community";
import { RichSelectModule } from "ag-grid-enterprise";
import MoodEditor from "./moodEditorVue";
import MoodRenderer from "./moodRendererVue";
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
    MoodEditor,
    MoodRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        field: "mood",
        headerName: "Inline",
        cellRenderer: "MoodRenderer",
        cellEditor: "MoodEditor",
      },
      {
        field: "mood",
        headerName: "Popup Over",
        cellRenderer: "MoodRenderer",
        cellEditor: "MoodEditor",
        cellEditorPopup: true,
      },
      {
        field: "mood",
        headerName: "Popup Under",
        cellRenderer: "MoodRenderer",
        cellEditor: "MoodEditor",
        cellEditorPopup: true,
        cellEditorPopupPosition: "under",
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

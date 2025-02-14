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
  EventApiModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IAggregationStatusPanelParams,
  ModuleRegistry,
  RowApiModule,
  RowSelectionModule,
  RowSelectionOptions,
  StatusPanelDef,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { CellSelectionModule, StatusBarModule } from "ag-grid-enterprise";
import ClickableStatusBarComponent from "./clickableStatusBarComponentVue";
import CountStatusBarComponent from "./countStatusBarComponentVue";
ModuleRegistry.registerModules([
  TextEditorModule,
  TextFilterModule,
  RowSelectionModule,
  ClientSideRowModelModule,
  CellSelectionModule,
  StatusBarModule,
  RowApiModule,
  EventApiModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rowData"
      :rowSelection="rowSelection"
      :statusBar="statusBar"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    ClickableStatusBarComponent,
    CountStatusBarComponent,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        field: "row",
      },
      {
        field: "name",
      },
    ]);
    const defaultColDef = ref<ColDef>({
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    });
    const rowData = ref<any[] | null>([
      { row: "Row 1", name: "Michael Phelps" },
      { row: "Row 2", name: "Natalie Coughlin" },
      { row: "Row 3", name: "Aleksey Nemov" },
      { row: "Row 4", name: "Alicia Coutts" },
      { row: "Row 5", name: "Missy Franklin" },
      { row: "Row 6", name: "Ryan Lochte" },
      { row: "Row 7", name: "Allison Schmitt" },
      { row: "Row 8", name: "Natalie Coughlin" },
      { row: "Row 9", name: "Ian Thorpe" },
      { row: "Row 10", name: "Bob Mill" },
      { row: "Row 11", name: "Willy Walsh" },
      { row: "Row 12", name: "Sarah McCoy" },
      { row: "Row 13", name: "Jane Jack" },
      { row: "Row 14", name: "Tina Wills" },
    ]);
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
    });
    const statusBar = ref<{
      statusPanels: StatusPanelDef[];
    }>({
      statusPanels: [
        {
          statusPanel: "CountStatusBarComponent",
        },
        {
          statusPanel: "ClickableStatusBarComponent",
        },
        {
          statusPanel: "agAggregationComponent",
          statusPanelParams: {
            aggFuncs: ["count", "sum"],
          } as IAggregationStatusPanelParams,
        },
      ],
    });

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      rowSelection,
      statusBar,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

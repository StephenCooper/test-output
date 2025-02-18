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
  IRichCellEditorParams,
  ModuleRegistry,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { RichSelectModule } from "ag-grid-enterprise";
import { colors } from "./colors";
ModuleRegistry.registerModules([
  TextEditorModule,
  ClientSideRowModelModule,
  RichSelectModule,
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
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        headerName: "Color (Column as String Type)",
        field: "color",
        width: 250,
        cellEditor: "agRichSelectCellEditor",
        cellEditorParams: {
          formatValue: (v) => v.name,
          parseValue: (v) => v.name,
          values: colors,
          searchType: "matchAny",
          allowTyping: true,
          filterList: true,
          valueListMaxHeight: 220,
        } as IRichCellEditorParams,
      },
      {
        headerName: "Color (Column as Complex Object)",
        field: "detailedColor",
        width: 290,
        valueFormatter: (p) => `${p.value.name} (${p.value.code})`,
        valueParser: (p) => p.newValue,
        cellEditor: "agRichSelectCellEditor",
        cellEditorParams: {
          formatValue: (v) => v.name,
          values: colors,
          searchType: "matchAny",
          allowTyping: true,
          filterList: true,
          valueListMaxHeight: 220,
        } as IRichCellEditorParams,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 200,
      editable: true,
    });
    const rowData = ref<any[] | null>(
      colors.map((v) => ({ color: v.name, detailedColor: v })),
    );

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
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

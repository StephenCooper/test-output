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
  createGrid,
} from "ag-grid-community";
import { RichSelectModule } from "ag-grid-enterprise";
import ColourCellRenderer from "./colourCellRendererVue";
import { colors } from "./colors";
ModuleRegistry.registerModules([
  TextEditorModule,
  ClientSideRowModelModule,
  RichSelectModule,
  ValidationModule /* Development Only */,
]);

function getRandomNumber(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const data = Array.from(Array(20).keys()).map(() => {
  const color = colors[getRandomNumber(0, colors.length - 1)];
  return { color };
});

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
    ColourCellRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        headerName: "Fuzzy Search",
        field: "color",
        cellRenderer: "ColourCellRenderer",
        cellEditor: "agRichSelectCellEditor",
        cellEditorParams: {
          values: colors,
          cellRenderer: "ColourCellRenderer",
          valueListMaxHeight: 220,
        } as IRichCellEditorParams,
      },
      {
        headerName: "Match Search",
        field: "color",
        cellRenderer: "ColourCellRenderer",
        cellEditor: "agRichSelectCellEditor",
        cellEditorParams: {
          values: colors,
          cellRenderer: "ColourCellRenderer",
          searchType: "match",
          valueListMaxHeight: 220,
        } as IRichCellEditorParams,
      },
      {
        headerName: "Match Any Search",
        field: "color",
        cellRenderer: "ColourCellRenderer",
        cellEditor: "agRichSelectCellEditor",
        cellEditorParams: {
          values: colors,
          cellRenderer: "ColourCellRenderer",
          searchType: "matchAny",
          valueListMaxHeight: 220,
        } as IRichCellEditorParams,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 200,
      editable: true,
    });
    const rowData = ref<any[] | null>(data);

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

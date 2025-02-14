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
  ILargeTextEditorParams,
  IRichCellEditorParams,
  ISelectCellEditorParams,
  ITextCellEditorParams,
  LargeTextEditorModule,
  ModuleRegistry,
  SelectEditorModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { RichSelectModule } from "ag-grid-enterprise";
import ColourCellRenderer from "./colourCellRendererVue";
import { colors } from "./colors";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RichSelectModule,
  SelectEditorModule,
  TextEditorModule,
  LargeTextEditorModule,
  ValidationModule /* Development Only */,
]);

function getRandomNumber(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const data = Array.from(Array(20).keys()).map(() => {
  const color = colors[getRandomNumber(0, colors.length - 1)];
  return {
    color1: color,
    color2: color,
    color3: color,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  };
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
        headerName: "Text Editor",
        field: "color1",
        cellRenderer: "ColourCellRenderer",
        cellEditor: "agTextCellEditor",
        cellEditorParams: {
          maxLength: 20,
        } as ITextCellEditorParams,
      },
      {
        headerName: "Select Editor",
        field: "color2",
        cellRenderer: "ColourCellRenderer",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: colors,
        } as ISelectCellEditorParams,
      },
      {
        headerName: "Rich Select Editor",
        field: "color3",
        cellRenderer: "ColourCellRenderer",
        cellEditor: "agRichSelectCellEditor",
        cellEditorParams: {
          values: colors,
          cellRenderer: "ColourCellRenderer",
          filterList: true,
          searchType: "match",
          allowTyping: true,
          valueListMaxHeight: 220,
        } as IRichCellEditorParams,
      },
      {
        headerName: "Large Text Editor",
        field: "description",
        cellEditorPopup: true,
        cellEditor: "agLargeTextCellEditor",
        cellEditorParams: {
          maxLength: 250,
          rows: 10,
          cols: 50,
        } as ILargeTextEditorParams,
        flex: 2,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
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

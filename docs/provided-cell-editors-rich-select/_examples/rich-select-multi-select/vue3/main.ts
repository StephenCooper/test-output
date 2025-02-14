import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./style.css";
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
  ValueFormatterParams,
  ValueParserParams,
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

const valueFormatter = (params: ValueFormatterParams) => {
  const { value } = params;
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return value;
};

const valueParser = (params: ValueParserParams) => {
  const { newValue } = params;
  if (newValue == null || newValue === "") {
    return null;
  }
  if (Array.isArray(newValue)) {
    return newValue;
  }
  return params.newValue.split(",");
};

function getRandomNumber(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const data = Array.from(Array(20).keys()).map(() => {
  const numberOfOptions = getRandomNumber(1, 4);
  const selectedOptions: string[] = [];
  for (let i = 0; i < numberOfOptions; i++) {
    const color = colors[getRandomNumber(0, colors.length - 1)];
    if (selectedOptions.indexOf(color) === -1) {
      selectedOptions.push(color);
    }
  }
  selectedOptions.sort();
  return { colors: selectedOptions };
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
        headerName: "Multi Select",
        field: "colors",
        cellEditor: "agRichSelectCellEditor",
        cellEditorParams: {
          values: colors,
          multiSelect: true,
          searchType: "matchAny",
          filterList: true,
          highlightMatch: true,
          valueListMaxHeight: 220,
        } as IRichCellEditorParams,
      },
      {
        headerName: "Multi Select (No Pills)",
        field: "colors",
        cellEditor: "agRichSelectCellEditor",
        cellEditorParams: {
          values: colors,
          suppressMultiSelectPillRenderer: true,
          multiSelect: true,
          searchType: "matchAny",
          filterList: true,
          highlightMatch: true,
          valueListMaxHeight: 220,
        } as IRichCellEditorParams,
      },
      {
        headerName: "Multi Select (With Renderer)",
        field: "colors",
        cellRenderer: "ColourCellRenderer",
        cellEditor: "agRichSelectCellEditor",
        cellEditorParams: {
          values: colors,
          cellRenderer: "ColourCellRenderer",
          suppressMultiSelectPillRenderer: true,
          multiSelect: true,
          searchType: "matchAny",
          filterList: true,
          highlightMatch: true,
          valueListMaxHeight: 220,
        } as IRichCellEditorParams,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      editable: true,
      valueFormatter: valueFormatter,
      valueParser: valueParser,
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

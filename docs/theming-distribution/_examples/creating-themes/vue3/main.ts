import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowSelectionOptions,
  Theme,
  colorSchemeVariable,
  createTheme,
  iconSetMaterial,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule]);

const myCustomTheme = createTheme()
  // add just the parts you want
  .withPart(iconSetMaterial)
  .withPart(colorSchemeVariable)
  // set default param values
  .withParams({
    accentColor: "red",
    iconSize: 18,
  });

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :theme="theme"
      :defaultColDef="defaultColDef"
      :rowSelection="rowSelection"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "make" },
      { field: "model" },
      { field: "price" },
    ]);
    const rowData = ref<IOlympicData[] | null>(
      (() => {
        const rowData: any[] = [];
        for (let i = 0; i < 10; i++) {
          rowData.push({
            make: "Toyota",
            model: "Celica",
            price: 35000 + i * 1000,
          });
          rowData.push({
            make: "Ford",
            model: "Mondeo",
            price: 32000 + i * 1000,
          });
          rowData.push({
            make: "Porsche",
            model: "Boxster",
            price: 72000 + i * 1000,
          });
        }
        return rowData;
      })(),
    );
    const theme = ref<Theme | "legacy">(myCustomTheme);
    const defaultColDef = ref<ColDef>({
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    });
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
      checkboxes: true,
    });

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      rowData,
      theme,
      defaultColDef,
      rowSelection,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

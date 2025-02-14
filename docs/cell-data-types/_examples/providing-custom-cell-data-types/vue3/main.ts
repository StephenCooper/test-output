import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  CellSelectionOptions,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DataTypeDefinition,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextEditorModule,
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

interface IOlympicDataTypes extends IOlympicData {
  countryObject: {
    code: string;
  };
  sportObject: {
    name: string;
  };
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :dataTypeDefinitions="dataTypeDefinitions"
      :cellSelection="cellSelection"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicDataTypes> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete" },
      { field: "countryObject", headerName: "Country" },
      { field: "sportObject", headerName: "Sport" },
    ]);
    const defaultColDef = ref<ColDef>({
      filter: true,
      floatingFilter: true,
      editable: true,
    });
    const dataTypeDefinitions = ref<{
      [cellDataType: string]: DataTypeDefinition;
    }>({
      country: {
        baseDataType: "object",
        extendsDataType: "object",
        valueParser: (params) =>
          params.newValue == null || params.newValue === ""
            ? null
            : { code: params.newValue },
        valueFormatter: (params) =>
          params.value == null ? "" : params.value.code,
        dataTypeMatcher: (value: any) => value && !!value.code,
      },
      sport: {
        baseDataType: "object",
        extendsDataType: "object",
        valueParser: (params) =>
          params.newValue == null || params.newValue === ""
            ? null
            : { name: params.newValue },
        valueFormatter: (params) =>
          params.value == null ? "" : params.value.name,
        dataTypeMatcher: (value: any) => value && !!value.name,
      },
    });
    const cellSelection = ref<boolean | CellSelectionOptions>({
      handle: { mode: "fill" },
    });
    const rowData = ref<IOlympicDataTypes[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) =>
        (rowData.value = data.map((rowData) => {
          const dateParts = rowData.date.split("/");
          return {
            ...rowData,
            countryObject: {
              code: rowData.country,
            },
            sportObject: {
              name: rowData.sport,
            },
          };
        }));

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      dataTypeDefinitions,
      cellSelection,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

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
  DataTypeDefinition,
  DateEditorModule,
  DateFilterModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  ValueFormatterLiteParams,
  ValueParserLiteParams,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberEditorModule,
  NumberFilterModule,
  DateEditorModule,
  DateFilterModule,
  TextEditorModule,
  TextFilterModule,
  ClientSideRowModelModule,
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
      :dataTypeDefinitions="dataTypeDefinitions"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete" },
      { field: "age" },
      { field: "date" },
    ]);
    const defaultColDef = ref<ColDef>({
      filter: true,
      floatingFilter: true,
      editable: true,
    });
    const dataTypeDefinitions = ref<{
      [cellDataType: string]: DataTypeDefinition;
    }>({
      dateString: {
        baseDataType: "dateString",
        extendsDataType: "dateString",
        valueParser: (params: ValueParserLiteParams<IOlympicData, string>) =>
          params.newValue != null &&
          params.newValue.match("\\d{2}/\\d{2}/\\d{4}")
            ? params.newValue
            : null,
        valueFormatter: (
          params: ValueFormatterLiteParams<IOlympicData, string>,
        ) => (params.value == null ? "" : params.value),
        dataTypeMatcher: (value: any) =>
          typeof value === "string" && !!value.match("\\d{2}/\\d{2}/\\d{4}"),
        dateParser: (value: string | undefined) => {
          if (value == null || value === "") {
            return undefined;
          }
          const dateParts = value.split("/");
          return dateParts.length === 3
            ? new Date(
                parseInt(dateParts[2]),
                parseInt(dateParts[1]) - 1,
                parseInt(dateParts[0]),
              )
            : undefined;
        },
        dateFormatter: (value: Date | undefined) => {
          if (value == null) {
            return undefined;
          }
          const date = String(value.getDate());
          const month = String(value.getMonth() + 1);
          return `${date.length === 1 ? "0" + date : date}/${month.length === 1 ? "0" + month : month}/${value.getFullYear()}`;
        },
      },
    });
    const rowData = ref<IOlympicData[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      dataTypeDefinitions,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  CheckboxEditorModule,
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
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  NumberEditorModule,
  NumberFilterModule,
  CheckboxEditorModule,
  DateFilterModule,
  DateEditorModule,
  TextEditorModule,
  TextFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

interface IOlympicDataTypes extends IOlympicData {
  dateObject: Date;
  hasGold: boolean;
  hasSilver: boolean;
  countryObject: {
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
      { field: "age", minWidth: 100 },
      { field: "hasGold", minWidth: 100, headerName: "Gold" },
      {
        field: "hasSilver",
        minWidth: 100,
        headerName: "Silver",
        cellRendererParams: { disabled: true },
      },
      { field: "dateObject", headerName: "Date" },
      { field: "date", headerName: "Date (String)" },
      { field: "countryObject", headerName: "Country" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 180,
      filter: true,
      floatingFilter: true,
      editable: true,
    });
    const dataTypeDefinitions = ref<{
      [cellDataType: string]: DataTypeDefinition;
    }>({
      object: {
        baseDataType: "object",
        extendsDataType: "object",
        valueParser: (params) => ({ name: params.newValue }),
        valueFormatter: (params) =>
          params.value == null ? "" : params.value.name,
      },
    });
    const rowData = ref<IOlympicDataTypes[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) =>
        (rowData.value = data.map((rowData) => {
          const dateParts = rowData.date.split("/");
          return {
            ...rowData,
            date: `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`,
            dateObject: new Date(
              parseInt(dateParts[2]),
              parseInt(dateParts[1]) - 1,
              parseInt(dateParts[0]),
            ),
            countryObject: {
              name: rowData.country,
            },
            hasGold: rowData.gold > 0,
            hasSilver: rowData.silver > 0,
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
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

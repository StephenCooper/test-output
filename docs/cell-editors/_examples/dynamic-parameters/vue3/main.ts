import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  CellValueChangedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellEditorParams,
  LargeTextEditorModule,
  ModuleRegistry,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RichSelectModule,
} from "ag-grid-enterprise";
import GenderCellRenderer from "./genderCellRendererVue";
import { IRow } from "./data";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RichSelectModule,
  TextEditorModule,
  LargeTextEditorModule,
  ValidationModule /* Development Only */,
]);

const cellCellEditorParams = (params: ICellEditorParams<IRow>) => {
  const selectedCountry = params.data.country;
  const allowedCities = countyToCityMap(selectedCountry);
  return {
    values: allowedCities,
    formatValue: (value: any) => `${value} (${selectedCountry})`,
  };
};

function countyToCityMap(match: string): string[] {
  const map: {
    [key: string]: string[];
  } = {
    Ireland: ["Dublin", "Cork", "Galway"],
    USA: ["New York", "Los Angeles", "Chicago", "Houston"],
  };
  return map[match];
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rowData"
      @cell-value-changed="onCellValueChanged"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    GenderCellRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "name" },
      {
        field: "gender",
        cellRenderer: "GenderCellRenderer",
        cellEditor: "agRichSelectCellEditor",
        cellEditorParams: {
          values: ["Male", "Female"],
          cellRenderer: "GenderCellRenderer",
        },
      },
      {
        field: "country",
        cellEditor: "agRichSelectCellEditor",
        cellEditorParams: {
          cellHeight: 50,
          values: ["Ireland", "USA"],
        },
      },
      {
        field: "city",
        cellEditor: "agRichSelectCellEditor",
        cellEditorParams: cellCellEditorParams,
      },
      {
        field: "address",
        cellEditor: "agLargeTextCellEditor",
        cellEditorPopup: true,
        minWidth: 550,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 130,
      editable: true,
    });
    const rowData = ref<any[] | null>(getData());

    function onCellValueChanged(params: CellValueChangedEvent) {
      const colId = params.column.getId();
      if (colId === "country") {
        const selectedCountry = params.data.country;
        const selectedCity = params.data.city;
        const allowedCities = countyToCityMap(selectedCountry) || [];
        const cityMismatch = allowedCities.indexOf(selectedCity) < 0;
        if (cityMismatch) {
          params.node.setDataValue("city", null);
        }
      }
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      onGridReady,
      onCellValueChanged,
    };
  },
});

createApp(VueExample).mount("#app");

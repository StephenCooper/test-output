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
  ISetFilterParams,
  ModuleRegistry,
  SelectEditorModule,
  TextEditorModule,
  ValidationModule,
  ValueFormatterParams,
  ValueSetterParams,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RichSelectModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import ColourCellRenderer from "./colourCellRendererVue";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RichSelectModule,
  SetFilterModule,
  SelectEditorModule,
  TextEditorModule,
  ValidationModule /* Development Only */,
]);

const carMappings = {
  tyt: "Toyota",
  frd: "Ford",
  prs: "Porsche",
  nss: "Nissan",
};

const colourMappings = {
  cb: "Cadet Blue",
  bw: "Burlywood",
  fg: "Forest Green",
};

function extractKeys(mappings: Record<string, string>) {
  return Object.keys(mappings);
}

const carCodes = extractKeys(carMappings);

const colourCodes = extractKeys(colourMappings);

function lookupValue(mappings: Record<string, string>, key: string) {
  return mappings[key];
}

function lookupKey(mappings: Record<string, string>, name: string) {
  const keys = Object.keys(mappings);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (mappings[key] === name) {
      return key;
    }
  }
}

function currencyFormatter(params: ValueFormatterParams) {
  const value = Math.floor(params.value);
  if (isNaN(value)) {
    return "";
  }
  return "£" + value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function numberValueSetter(params: ValueSetterParams) {
  const valueAsNumber = parseFloat(params.newValue);
  if (isNaN(valueAsNumber) || !isFinite(params.newValue)) {
    return false; // don't set invalid numbers!
  }
  params.data.price = valueAsNumber;
  return true;
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
    ColourCellRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        field: "make",
        minWidth: 100,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: carCodes,
        },
        filterParams: {
          valueFormatter: (params: ValueFormatterParams) => {
            return lookupValue(carMappings, params.value);
          },
        },
        valueFormatter: (params) => {
          return lookupValue(carMappings, params.value);
        },
      },
      {
        field: "exteriorColour",
        minWidth: 150,
        cellEditor: "agRichSelectCellEditor",
        cellEditorParams: {
          values: colourCodes,
          cellRenderer: "ColourCellRenderer",
        },
        filter: "agSetColumnFilter",
        filterParams: {
          values: colourCodes,
          valueFormatter: (params) => {
            return lookupValue(colourMappings, params.value);
          },
          cellRenderer: "ColourCellRenderer",
        } as ISetFilterParams,
        valueFormatter: (params) => {
          return lookupValue(colourMappings, params.value);
        },
        valueParser: (params) => {
          return lookupKey(colourMappings, params.newValue);
        },
        cellRenderer: "ColourCellRenderer",
      },
      {
        field: "interiorColour",
        minWidth: 150,
        cellEditor: "agTextCellEditor",
        cellEditorParams: {
          useFormatter: true,
        },
        filter: "agSetColumnFilter",
        filterParams: {
          values: colourCodes,
          valueFormatter: (params: ValueFormatterParams) => {
            return lookupValue(colourMappings, params.value);
          },
          cellRenderer: "ColourCellRenderer",
        },
        valueFormatter: (params) => {
          return lookupValue(colourMappings, params.value);
        },
        valueParser: (params) => {
          return lookupKey(colourMappings, params.newValue);
        },
        cellRenderer: "ColourCellRenderer",
      },
      {
        headerName: "Retail Price",
        field: "price",
        minWidth: 120,
        colId: "retailPrice",
        valueGetter: (params) => {
          return params.data.price;
        },
        valueFormatter: currencyFormatter,
        valueSetter: numberValueSetter,
      },
      {
        headerName: "Retail Price (incl Taxes)",
        minWidth: 120,
        editable: false,
        valueGetter: (params) => {
          // example of chaining value getters
          return params.getValue("retailPrice") * 1.2;
        },
        valueFormatter: currencyFormatter,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      filter: true,
      editable: true,
    });
    const rowData = ref<any[] | null>(getData());

    function onCellValueChanged(params: CellValueChangedEvent) {
      // notice that the data always contains the keys rather than values after editing
      console.log("onCellValueChanged Data: ", params.data);
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

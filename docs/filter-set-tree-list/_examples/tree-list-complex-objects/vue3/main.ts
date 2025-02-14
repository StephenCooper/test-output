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
  GetDataPath,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ISetFilterParams,
  KeyCreatorParams,
  ModuleRegistry,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
  TreeDataModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TreeDataModule,
  ValidationModule /* Development Only */,
]);

const pathLookup: {
  [key: string]: string;
} = getData().reduce((pathMap, row) => {
  pathMap[row.path.key] = row.path.displayValue;
  return pathMap;
}, {});

function treeListFormatter(
  pathKey: string | null,
  _level: number,
  parentPathKeys: (string | null)[],
): string {
  return pathLookup[[...parentPathKeys, pathKey].join(".")];
}

function valueFormatter(params: ValueFormatterParams): string {
  return params.value ? pathLookup[params.value.join(".")] : "(Blanks)";
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :autoGroupColumnDef="autoGroupColumnDef"
      :treeData="true"
      :groupDefaultExpanded="groupDefaultExpanded"
      :getDataPath="getDataPath"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "employmentType" },
      { field: "jobTitle" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 200,
      filter: true,
      floatingFilter: true,
      cellDataType: false,
    });
    const autoGroupColumnDef = ref<ColDef>({
      headerName: "Employee",
      field: "path",
      cellRendererParams: {
        suppressCount: true,
      },
      filter: "agSetColumnFilter",
      filterParams: {
        treeList: true,
        keyCreator: (params: KeyCreatorParams) => params.value.join("."),
        treeListFormatter: treeListFormatter,
        valueFormatter: valueFormatter,
      } as ISetFilterParams<any, string[]>,
      minWidth: 280,
      valueFormatter: (params: ValueFormatterParams) =>
        params.value.displayValue,
    });
    const groupDefaultExpanded = ref(-1);
    const getDataPath = ref<GetDataPath>((data) => data.path.key.split("."));
    const rowData = ref<any[] | null>(getData());

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      groupDefaultExpanded,
      getDataPath,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

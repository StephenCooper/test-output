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
  GetRowIdFunc,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ISetFilterParams,
  KeyCreatorParams,
  ModuleRegistry,
  ValidationModule,
  ValueFormatterParams,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
  TreeDataModule,
} from "ag-grid-enterprise";
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

function arrayComparator(a: string[] | null, b: string[] | null): number {
  if (a == null) {
    return b == null ? 0 : -1;
  } else if (b == null) {
    return 1;
  }
  for (let i = 0; i < a.length; i++) {
    if (i >= b.length) {
      return 1;
    }
    const comparisonValue = reverseOrderComparator(a[i], b[i]);
    if (comparisonValue !== 0) {
      return comparisonValue;
    }
  }
  return 0;
}

function reverseOrderComparator(a: any, b: any): number {
  return a < b ? 1 : a > b ? -1 : 0;
}

function processData(data: any[]) {
  const flattenedData: any[] = [];
  const flattenRowRecursive = (row: any, parentPath: string[]) => {
    const dateParts = row.startDate.split("/");
    const startDate = new Date(
      parseInt(dateParts[2]),
      dateParts[1] - 1,
      dateParts[0],
    );
    const dataPath = [...parentPath, row.employeeName];
    flattenedData.push({ ...row, dataPath, startDate });
    if (row.underlings) {
      row.underlings.forEach((underling: any) =>
        flattenRowRecursive(underling, dataPath),
      );
    }
  };
  data.forEach((row) => flattenRowRecursive(row, []));
  return flattenedData;
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
      :getRowId="getRowId"
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
      {
        field: "startDate",
        valueFormatter: (params) =>
          params.value ? params.value.toLocaleDateString() : params.value,
        filterParams: {
          treeList: true,
          comparator: reverseOrderComparator,
        } as ISetFilterParams<any, Date>,
      },
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
      field: "employeeName",
      cellRendererParams: {
        suppressCount: true,
      },
      filter: "agSetColumnFilter",
      filterParams: {
        treeList: true,
        keyCreator: (params: KeyCreatorParams) =>
          params.value ? params.value.join("#") : null,
        comparator: arrayComparator,
      } as ISetFilterParams<any, string[]>,
      minWidth: 280,
    });
    const groupDefaultExpanded = ref(-1);
    const getDataPath = ref<GetDataPath>((data) => {
      return data.dataPath;
    });
    const getRowId = ref<GetRowIdFunc>((params) =>
      String(params.data.employeeId),
    );
    const rowData = ref<any[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) =>
        params.api!.setGridOption("rowData", processData(data));

      fetch("https://www.ag-grid.com/example-assets/tree-data.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      groupDefaultExpanded,
      getDataPath,
      getRowId,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

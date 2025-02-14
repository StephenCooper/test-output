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
  ISetFilterParams,
  KeyCreatorParams,
  ModuleRegistry,
  NumberFilterModule,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  RowGroupingModule,
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
      :autoGroupColumnDef="autoGroupColumnDef"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "country", rowGroup: true, hide: true },
      { field: "sport", rowGroup: true, hide: true },
      { field: "athlete", hide: true },
      {
        field: "date",
        filter: "agSetColumnFilter",
        filterParams: {
          treeList: true,
        } as ISetFilterParams<any, Date>,
      },
      {
        field: "gold",
        filter: "agSetColumnFilter",
        filterParams: {
          treeList: true,
          treeListPathGetter: (gold: number) =>
            gold != null ? [gold > 2 ? ">2" : "<=2", String(gold)] : [null],
        } as ISetFilterParams<any, number>,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 200,
      floatingFilter: true,
      cellDataType: false,
    });
    const autoGroupColumnDef = ref<ColDef>({
      field: "athlete",
      filter: "agSetColumnFilter",
      filterParams: {
        treeList: true,
        keyCreator: (params: KeyCreatorParams) =>
          params.value ? params.value.join("#") : null,
      } as ISetFilterParams,
    });
    const rowData = ref<any[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) =>
        (rowData.value = data.map((row) => {
          const dateParts = row.date.split("/");
          const newDate = new Date(
            parseInt(dateParts[2]),
            dateParts[1] - 1,
            dateParts[0],
          );
          return { ...row, date: newDate };
        }));

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

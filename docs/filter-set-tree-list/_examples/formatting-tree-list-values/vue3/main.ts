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

function dateCellValueFormatter(params: ValueFormatterParams) {
  return params.value ? params.value.toLocaleDateString() : "";
}

function dateFloatingFilterValueFormatter(params: ValueFormatterParams) {
  return params.value ? params.value.toLocaleDateString() : "(Blanks)";
}

function treeListFormatter(
  pathKey: string | null,
  level: number,
  _parentPathKeys: (string | null)[],
): string {
  if (level === 1) {
    const date = new Date();
    date.setMonth(Number(pathKey) - 1);
    return date.toLocaleDateString(undefined, { month: "long" });
  }
  return pathKey || "(Blanks)";
}

function groupTreeListFormatter(
  pathKey: string | null,
  level: number,
  _parentPathKeys: (string | null)[],
): string {
  if (level === 0 && pathKey) {
    return pathKey + " (" + pathKey.substring(0, 2).toUpperCase() + ")";
  }
  return pathKey || "(Blanks)";
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
      { field: "sport" },
      {
        field: "date",
        valueFormatter: dateCellValueFormatter,
        filter: "agSetColumnFilter",
        filterParams: {
          treeList: true,
          treeListFormatter: treeListFormatter,
          valueFormatter: dateFloatingFilterValueFormatter,
        } as ISetFilterParams<any, Date>,
      },
      {
        field: "gold",
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
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
        treeListFormatter: groupTreeListFormatter,
      } as ISetFilterParams,
      minWidth: 200,
    });
    const rowData = ref<any[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        const randomDays = [1, 4, 10, 15, 18];
        params.api!.setGridOption("rowData", [
          {},
          ...data.map((row) => {
            // generate pseudo-random dates
            const dateParts = row.date.split("/");
            const randomMonth =
              parseInt(dateParts[1]) - Math.floor(Math.random() * 3);
            const newDate = new Date(
              parseInt(dateParts[2]),
              randomMonth,
              randomMonth + randomDays[Math.floor(Math.random() * 5)],
            );
            return { ...row, date: newDate };
          }),
        ]);
      };

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

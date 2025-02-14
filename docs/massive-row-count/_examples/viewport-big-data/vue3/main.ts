import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IViewportDatasource,
  IViewportDatasourceParams,
  ModuleRegistry,
  RowModelType,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { ViewportRowModelModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ViewportRowModelModule,
  ValidationModule /* Development Only */,
]);

function createViewportDatasource(): IViewportDatasource {
  let initParams: IViewportDatasourceParams;
  return {
    init: (params: IViewportDatasourceParams) => {
      initParams = params;
      const oneMillion = 1000 * 1000;
      params.setRowCount(oneMillion);
    },
    setViewportRange(firstRow: number, lastRow: number) {
      const rowData: any = {};
      for (let rowIndex = firstRow; rowIndex <= lastRow; rowIndex++) {
        const item: any = {};
        item.id = rowIndex;
        item.a = "A-" + rowIndex;
        item.b = "B-" + rowIndex;
        item.c = "C-" + rowIndex;
        rowData[rowIndex] = item;
      }
      initParams.setRowData(rowData);
    },
    destroy: () => {},
  };
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :rowHeight="rowHeight"
      :rowModelType="rowModelType"
      :viewportDatasource="viewportDatasource"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        headerName: "ID",
        field: "id",
      },
      {
        headerName: "Expected Position",
        valueGetter: '"translateY(" + node.rowIndex * 100 + "px)"',
      },
      {
        field: "a",
      },
      {
        field: "b",
      },
      {
        field: "c",
      },
    ]);
    const rowHeight = ref(100);
    const rowModelType = ref<RowModelType>("viewport");
    const viewportDatasource = ref<IViewportDatasource>(
      createViewportDatasource(),
    );
    const rowData = ref<any[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      rowHeight,
      rowModelType,
      viewportDatasource,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

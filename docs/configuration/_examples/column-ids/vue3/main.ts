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
  ColumnApiModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

function createRowData() {
  const data = [];
  for (let i = 0; i < 20; i++) {
    data.push({
      height: Math.floor(Math.random() * 100),
      width: Math.floor(Math.random() * 100),
      depth: Math.floor(Math.random() * 100),
    });
  }
  return data;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div style="height: 100%; box-sizing: border-box">
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :rowData="rowData"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      // colId will be 'height',
      { headerName: "Col 1", field: "height" },
      // colId will be 'firstWidth',
      { headerName: "Col 2", colId: "firstWidth", field: "width" },
      // colId will be 'secondWidth'
      { headerName: "Col 3", colId: "secondWidth", field: "width" },
      // no colId, no field, so grid generated ID
      { headerName: "Col 4", valueGetter: "data.width" },
      { headerName: "Col 5", valueGetter: "data.width" },
    ]);
    const rowData = ref<any[] | null>(createRowData());

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const cols = params.api.getColumns()!;
      cols.forEach((col) => {
        const colDef = col.getColDef();
        console.log(
          colDef.headerName + ", Column ID = " + col.getId(),
          JSON.stringify(colDef),
        );
      });
    };

    return {
      gridApi,
      columnDefs,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

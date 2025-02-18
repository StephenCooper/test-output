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
  IDetailCellRendererParams,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :rowData="rowData"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :groupDefaultExpanded="groupDefaultExpanded"
      :masterDetail="true"
      :detailCellRendererParams="detailCellRendererParams"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const rowData = ref<any[] | null>([
      {
        a1: "level 1 - 111",
        b1: "level 1 - 222",
        children: [
          {
            a2: "level 2 - 333",
            b2: "level 2 - 444",
            children: [
              { a3: "level 3 - 5551", b3: "level 3 - 6661" },
              { a3: "level 3 - 5552", b3: "level 3 - 6662" },
              { a3: "level 3 - 5553", b3: "level 3 - 6663" },
              { a3: "level 3 - 5554", b3: "level 3 - 6664" },
              { a3: "level 3 - 5555", b3: "level 3 - 6665" },
              { a3: "level 3 - 5556", b3: "level 3 - 6666" },
            ],
          },
        ],
      },
      {
        a1: "level 1 - 111",
        b1: "level 1 - 222",
        children: [
          {
            a2: "level 2 - 333",
            b2: "level 2 - 444",
            children: [
              { a3: "level 3 - 5551", b3: "level 3 - 6661" },
              { a3: "level 3 - 5552", b3: "level 3 - 6662" },
              { a3: "level 3 - 5553", b3: "level 3 - 6663" },
              { a3: "level 3 - 5554", b3: "level 3 - 6664" },
              { a3: "level 3 - 5555", b3: "level 3 - 6665" },
              { a3: "level 3 - 5556", b3: "level 3 - 6666" },
            ],
          },
        ],
      },
    ]);
    const columnDefs = ref<ColDef[]>([
      { field: "a1", cellRenderer: "agGroupCellRenderer" },
      { field: "b1" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
    });
    const groupDefaultExpanded = ref(1);
    const detailCellRendererParams = ref<any>({
      // level 2 grid options
      detailGridOptions: {
        columnDefs: [
          { field: "a2", cellRenderer: "agGroupCellRenderer" },
          { field: "b2" },
        ],
        defaultColDef: {
          flex: 1,
        },
        groupDefaultExpanded: 1,
        masterDetail: true,
        detailRowHeight: 240,
        detailCellRendererParams: {
          // level 3 grid options
          detailGridOptions: {
            columnDefs: [
              { field: "a3", cellRenderer: "agGroupCellRenderer" },
              { field: "b3" },
            ],
            defaultColDef: {
              flex: 1,
            },
          },
          getDetailRowData: (params) => {
            params.successCallback(params.data.children);
          },
        } as IDetailCellRendererParams,
      },
      getDetailRowData: (params) => {
        params.successCallback(params.data.children);
      },
    } as IDetailCellRendererParams);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      rowData,
      columnDefs,
      defaultColDef,
      groupDefaultExpanded,
      detailCellRendererParams,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

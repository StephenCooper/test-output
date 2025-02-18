import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./styles.css";
import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
import DetailCellRenderer from "./detailCellRendererVue";
import { IAccount } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  HighlightChangesModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

let allRowData: any[];

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :masterDetail="true"
      :detailCellRenderer="detailCellRenderer"
      :detailRowHeight="detailRowHeight"
      :groupDefaultExpanded="groupDefaultExpanded"
      :rowData="rowData"
      @first-data-rendered="onFirstDataRendered"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    DetailCellRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IAccount> | null>(null);
    const columnDefs = ref<ColDef[]>([
      // group cell renderer needed for expand / collapse icons
      { field: "name", cellRenderer: "agGroupCellRenderer" },
      { field: "account" },
      { field: "calls" },
      { field: "minutes", valueFormatter: "x.toLocaleString() + 'm'" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      enableCellChangeFlash: true,
    });
    const detailCellRenderer = ref("DetailCellRenderer");
    const detailRowHeight = ref(70);
    const groupDefaultExpanded = ref(1);
    const rowData = ref<IAccount[]>(null);

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      setInterval(() => {
        if (!allRowData) {
          return;
        }
        const data = allRowData[0];
        const newCallRecords: any[] = [];
        data.callRecords.forEach((record: any, index: number) => {
          newCallRecords.push({
            name: record.name,
            callId: record.callId,
            duration: record.duration + (index % 2),
            switchCode: record.switchCode,
            direction: record.direction,
            number: record.number,
          });
        });
        data.callRecords = newCallRecords;
        data.calls++;
        const tran = {
          update: [data],
        };
        params.api.applyTransaction(tran);
      }, 2000);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        allRowData = data;
        params.api!.setGridOption("rowData", allRowData);
      };

      fetch("https://www.ag-grid.com/example-assets/master-detail-data.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      detailCellRenderer,
      detailRowHeight,
      groupDefaultExpanded,
      rowData,
      onGridReady,
      onFirstDataRendered,
    };
  },
});

createApp(VueExample).mount("#app");

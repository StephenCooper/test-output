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
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  IDetailCellRendererParams,
  ModuleRegistry,
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
import { IAccount } from "./interfaces";
ModuleRegistry.registerModules([
  RowApiModule,
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
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :masterDetail="true"
      :detailRowHeight="detailRowHeight"
      :detailCellRendererParams="detailCellRendererParams"
      :rowData="rowData"
      @first-data-rendered="onFirstDataRendered"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
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
    });
    const detailRowHeight = ref(195);
    const detailCellRendererParams = ref((params: ICellRendererParams) => {
      const res = {} as IDetailCellRendererParams;
      // we use the same getDetailRowData for both options
      res.getDetailRowData = function (params) {
        params.successCallback(params.data.callRecords);
      };
      const nameMatch =
        params.data.name === "Mila Smith" ||
        params.data.name === "Harper Johnson";
      if (nameMatch) {
        // grid options for columns {callId, number}
        res.detailGridOptions = {
          columnDefs: [{ field: "callId" }, { field: "number" }],
          defaultColDef: {
            flex: 1,
          },
        };
      } else {
        // grid options for columns {callId, direction, duration, switchCode}
        res.detailGridOptions = {
          columnDefs: [
            { field: "callId" },
            { field: "direction" },
            { field: "duration", valueFormatter: "x.toLocaleString() + 's'" },
            { field: "switchCode" },
          ],
          defaultColDef: {
            flex: 1,
          },
        };
      }
      return res;
    });
    const rowData = ref<IAccount[]>(null);

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      // arbitrarily expand a row for presentational purposes
      setTimeout(() => {
        const node1 = params.api.getDisplayedRowAtIndex(1)!;
        const node2 = params.api.getDisplayedRowAtIndex(2)!;
        node1.setExpanded(true);
        node2.setExpanded(true);
      }, 0);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        rowData.value = data;
      };

      fetch("https://www.ag-grid.com/example-assets/master-detail-data.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      detailRowHeight,
      detailCellRendererParams,
      rowData,
      onGridReady,
      onFirstDataRendered,
    };
  },
});

createApp(VueExample).mount("#app");

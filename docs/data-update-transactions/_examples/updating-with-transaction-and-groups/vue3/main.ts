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
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowApiModule,
  RowClassParams,
  RowSelectionModule,
  RowSelectionOptions,
  RowStyleModule,
  ValidationModule,
  ValueFormatterParams,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import { createNewRowData, getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  RowSelectionModule,
  RowApiModule,
  RowStyleModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

function poundFormatter(params: ValueFormatterParams) {
  return (
    "£" +
    Math.floor(params.value)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  );
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <div>
          <button class="bt-action" v-on:click="onAddRow('For Sale')">Add For Sale</button>
          <button class="bt-action" v-on:click="onAddRow('In Workshop')">Add In Workshop</button>
          <button class="bt-action" v-on:click="onRemoveSelected()">Remove Selected</button>
          <button class="bt-action" v-on:click="getRowData()">Get Row Data</button>
        </div>
        <div style="margin-top: 5px">
          <button class="bt-action" v-on:click="onMoveToGroup('For Sale')">Move to For Sale</button>
          <button class="bt-action" v-on:click="onMoveToGroup('In Workshop')">Move to In Workshop</button>
          <button class="bt-action" v-on:click="onMoveToGroup('Sold')">Move to Sold</button>
        </div>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :groupDefaultExpanded="groupDefaultExpanded"
        :rowData="rowData"
        :rowSelection="rowSelection"
        :suppressAggFuncInHeader="true"
        :getRowClass="getRowClass"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "category", rowGroupIndex: 1, hide: true },
      { field: "price", aggFunc: "sum", valueFormatter: poundFormatter },
      { field: "zombies" },
      { field: "style" },
      { field: "clothes" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      width: 100,
    });
    const autoGroupColumnDef = ref<ColDef>({
      headerName: "Group",
      minWidth: 250,
      field: "model",
      rowGroupIndex: 1,
      cellRenderer: "agGroupCellRenderer",
    });
    const groupDefaultExpanded = ref(1);
    const rowData = ref<any[] | null>(getData());
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
      groupSelects: "descendants",
      headerCheckbox: false,
      checkboxLocation: "autoGroupColumn",
    });
    const getRowClass = ref<
      (params: RowClassParams) => string | string[] | undefined
    >((params: RowClassParams) => {
      const rowNode = params.node;
      if (rowNode.group) {
        switch (rowNode.key) {
          case "In Workshop":
            return "category-in-workshop";
          case "Sold":
            return "category-sold";
          case "For Sale":
            return "category-for-sale";
          default:
            return undefined;
        }
      } else {
        // no extra classes for leaf rows
        return undefined;
      }
    });

    function getRowData() {
      const rowData: any[] = [];
      gridApi.value!.forEachNode(function (node) {
        rowData.push(node.data);
      });
      console.log("Row Data:");
      console.log(rowData);
    }
    function onAddRow(category: string) {
      const rowDataItem = createNewRowData(category);
      gridApi.value!.applyTransaction({ add: [rowDataItem] });
    }
    function onMoveToGroup(category: string) {
      const selectedRowData = gridApi.value!.getSelectedRows();
      selectedRowData.forEach((dataItem) => {
        dataItem.category = category;
      });
      gridApi.value!.applyTransaction({ update: selectedRowData });
    }
    function onRemoveSelected() {
      const selectedRowData = gridApi.value!.getSelectedRows();
      gridApi.value!.applyTransaction({ remove: selectedRowData });
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      groupDefaultExpanded,
      rowData,
      rowSelection,
      getRowClass,
      onGridReady,
      getRowData,
      onAddRow,
      onMoveToGroup,
      onRemoveSelected,
    };
  },
});

createApp(VueExample).mount("#app");

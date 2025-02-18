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
  CustomFilterModule,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  IAggFuncParams,
  IDoesFilterPassParams,
  IFilterComp,
  IFilterParams,
  IFilterType,
  IsGroupOpenByDefaultParams,
  ModuleRegistry,
  RowSelectionModule,
  RowSelectionOptions,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import { createDataItem, getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  TextFilterModule,
  RowSelectionModule,
  HighlightChangesModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  CustomFilterModule,
  ValidationModule /* Development Only */,
]);

let aggCallCount = 0;

let compareCallCount = 0;

let filterCallCount = 0;

function myAggFunc(params: IAggFuncParams) {
  aggCallCount++;
  let total = 0;
  for (let i = 0; i < params.values.length; i++) {
    total += params.values[i];
  }
  return total;
}

function myComparator(a: any, b: any) {
  compareCallCount++;
  return a < b ? -1 : 1;
}

function getMyFilter(): IFilterType {
  class MyFilter implements IFilterComp {
    filterParams!: IFilterParams;
    filterValue!: number | null;
    eGui: any;
    eInput: any;
    init(params: IFilterParams) {
      this.filterParams = params;
      this.filterValue = null;
      this.eGui = document.createElement("div");
      this.eGui.innerHTML = '<div>Greater Than: <input type="text"/></div>';
      this.eInput = this.eGui.querySelector("input");
      this.eInput.addEventListener("input", () => {
        this.getValueFromInput();
        params.filterChangedCallback();
      });
    }
    getGui() {
      return this.eGui;
    }
    getValueFromInput() {
      const value = parseInt(this.eInput.value);
      this.filterValue = isNaN(value) ? null : value;
    }
    setModel(model: any) {
      this.eInput.value = model == null ? null : model.value;
      this.getValueFromInput();
    }
    getModel() {
      if (!this.isFilterActive()) {
        return null;
      }
      return { value: this.eInput.value };
    }
    isFilterActive() {
      return this.filterValue !== null;
    }
    doesFilterPass(params: IDoesFilterPassParams) {
      filterCallCount++;
      const { node } = params;
      const value = this.filterParams.getValue(node);
      return value > (this.filterValue || 0);
    }
  }
  return MyFilter;
}

const myFilter = getMyFilter();

function timeOperation(name: string, operation: any) {
  aggCallCount = 0;
  compareCallCount = 0;
  filterCallCount = 0;
  const start = new Date().getTime();
  operation();
  const end = new Date().getTime();
  console.log(
    name +
      " finished in " +
      (end - start) +
      "ms, aggCallCount = " +
      aggCallCount +
      ", compareCallCount = " +
      compareCallCount +
      ", filterCallCount = " +
      filterCallCount,
  );
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">
        <button v-on:click="onBtUpdate()">Update</button>
        <button v-on:click="onBtDuplicate()">Duplicate</button>
        <button v-on:click="onBtDelete()">Delete</button>
        <button v-on:click="onBtClearSelection()">Clear Selection</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        class="test-grid"
        @grid-ready="onGridReady"
        :getRowId="getRowId"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowSelection="rowSelection"
        :autoGroupColumnDef="autoGroupColumnDef"
        :isGroupOpenByDefault="isGroupOpenByDefault"
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
      { field: "city", rowGroup: true, hide: true },
      { field: "laptop", rowGroup: true, hide: true },
      { field: "distro", sort: "asc", comparator: myComparator },
      {
        field: "value",
        enableCellChangeFlash: true,
        aggFunc: myAggFunc,
        filter: myFilter,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      filter: true,
    });
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
      groupSelects: "descendants",
      headerCheckbox: false,
    });
    const autoGroupColumnDef = ref<ColDef>({
      field: "name",
    });
    const rowData = ref<any[]>(null);

    function onBtDuplicate() {
      // get the first child of the
      const selectedRows = gridApi.value.getSelectedRows();
      if (!selectedRows || selectedRows.length === 0) {
        console.log("No rows selected!");
        return;
      }
      const newItems: any = [];
      selectedRows.forEach((selectedRow) => {
        const newItem = createDataItem(
          selectedRow.name,
          selectedRow.distro,
          selectedRow.laptop,
          selectedRow.city,
          selectedRow.value,
        );
        newItems.push(newItem);
      });
      timeOperation("Duplicate", () => {
        gridApi.value.applyTransaction({ add: newItems });
      });
    }
    function onBtUpdate() {
      // get the first child of the
      const selectedRows = gridApi.value.getSelectedRows();
      if (!selectedRows || selectedRows.length === 0) {
        console.log("No rows selected!");
        return;
      }
      const updatedItems: any[] = [];
      selectedRows.forEach((oldItem) => {
        const newValue = Math.floor(Math.random() * 100) + 10;
        const newItem = createDataItem(
          oldItem.name,
          oldItem.distro,
          oldItem.laptop,
          oldItem.city,
          newValue,
          oldItem.id,
        );
        updatedItems.push(newItem);
      });
      timeOperation("Update", () => {
        gridApi.value.applyTransaction({ update: updatedItems });
      });
    }
    function onBtDelete() {
      // get the first child of the
      const selectedRows = gridApi.value.getSelectedRows();
      if (!selectedRows || selectedRows.length === 0) {
        console.log("No rows selected!");
        return;
      }
      timeOperation("Delete", () => {
        gridApi.value.applyTransaction({ remove: selectedRows });
      });
    }
    function onBtClearSelection() {
      gridApi.value!.deselectAll();
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      params.api.setFilterModel({
        value: { value: "50" },
      });
      timeOperation("Initialisation", () => {
        params.api.setGridOption("rowData", getData());
      });
    };
    function getRowId(params: GetRowIdParams) {
      return String(params.data.id);
    }
    function isGroupOpenByDefault(
      params: IsGroupOpenByDefaultParams<IOlympicData, any>,
    ) {
      return ["Delhi", "Seoul"].includes(params.key);
    }

    return {
      gridApi,
      getRowId,
      columnDefs,
      defaultColDef,
      rowSelection,
      autoGroupColumnDef,
      isGroupOpenByDefault,
      rowData,
      onGridReady,
      onBtDuplicate,
      onBtUpdate,
      onBtDelete,
      onBtClearSelection,
    };
  },
});

createApp(VueExample).mount("#app");

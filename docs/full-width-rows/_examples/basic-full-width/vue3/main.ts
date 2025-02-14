import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IsFullWidthRowParams,
  ModuleRegistry,
  PinnedRowModule,
  RowHeightParams,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import FullWidthCellRenderer from "./fullWidthCellRendererVue";
ModuleRegistry.registerModules([
  ColumnApiModule,
  PinnedRowModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

function getColumnDefs() {
  const columnDefs: ColDef[] = [];
  alphabet().forEach((letter) => {
    const colDef: ColDef = {
      headerName: letter,
      field: letter,
      width: 150,
    };
    if (letter === "A") {
      colDef.pinned = "left";
    }
    if (letter === "Z") {
      colDef.pinned = "right";
    }
    columnDefs.push(colDef);
  });
  return columnDefs;
}

function alphabet() {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
}

function createData(count: number, prefix: string) {
  const rowData = [];
  for (let i = 0; i < count; i++) {
    const item: any = {};
    // mark every third row as full width. how you mark the row is up to you,
    // in this example the example code (not the grid code) looks at the
    // fullWidth attribute in the isFullWidthRow() callback. how you determine
    // if a row is full width or not is totally up to you.
    item.fullWidth = i % 3 === 2;
    // put in a column for each letter of the alphabet
    alphabet().forEach((letter) => {
      item[letter] = prefix + " (" + letter + "," + i + ")";
    });
    rowData.push(item);
  }
  return rowData;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :rowData="rowData"
      :pinnedTopRowData="pinnedTopRowData"
      :pinnedBottomRowData="pinnedBottomRowData"
      :columnDefs="columnDefs"
      :isFullWidthRow="isFullWidthRow"
      :fullWidthCellRenderer="fullWidthCellRenderer"
      :getRowHeight="getRowHeight"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    FullWidthCellRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const rowData = ref<any[] | null>(createData(100, "body"));
    const pinnedTopRowData = ref<any[]>(createData(3, "pinned"));
    const pinnedBottomRowData = ref<any[]>(createData(3, "pinned"));
    const columnDefs = ref<ColDef[]>(getColumnDefs());
    const isFullWidthRow = ref<(params: IsFullWidthRowParams) => boolean>(
      (params: IsFullWidthRowParams) => {
        // in this example, we check the fullWidth attribute that we set
        // while creating the data. what check you do to decide if you
        // want a row full width is up to you, as long as you return a boolean
        // for this method.
        return params.rowNode.data.fullWidth;
      },
    );
    const fullWidthCellRenderer = ref<any>("FullWidthCellRenderer");
    const getRowHeight = ref<
      (params: RowHeightParams) => number | undefined | null
    >((params: RowHeightParams) => {
      // you can have normal rows and full width rows any height that you want
      const isBodyRow = params.node.rowPinned === undefined;
      const isFullWidth = params.node.data.fullWidth;
      if (isBodyRow && isFullWidth) {
        return 75;
      }
    });

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      rowData,
      pinnedTopRowData,
      pinnedBottomRowData,
      columnDefs,
      isFullWidthRow,
      fullWidthCellRenderer,
      getRowHeight,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

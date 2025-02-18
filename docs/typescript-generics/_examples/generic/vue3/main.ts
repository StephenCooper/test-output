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
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowSelectedEvent,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  ValueFormatterParams,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowSelectionModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

interface ICar {
  make: string;
  model: string;
  price: number;
}
interface IDiscountRate {
  discount: number;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">
        <button v-on:click="onShowSelection()">Log Selected Cars</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        class="test-grid"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :rowSelection="rowSelection"
        :context="context"
        :getRowId="getRowId"
        @row-selected="onRowSelected"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<ICar> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { headerName: "Make", field: "make" },
      { headerName: "Model", field: "model" },
      {
        headerName: "Price",
        field: "price",
        valueFormatter: (params: ValueFormatterParams<ICar, number>) => {
          // params.value: number
          return "£" + params.value;
        },
      },
    ]);
    const rowData = ref<ICar[] | null>([
      { make: "Toyota", model: "Celica", price: 35000 },
      { make: "Ford", model: "Mondeo", price: 32000 },
      { make: "Porsche", model: "Boxster", price: 72000 },
    ]);
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
    });
    const context = ref({
      discount: 0.9,
    } as IDiscountRate);
    const getRowId = ref<GetRowIdFunc>((params: GetRowIdParams<ICar>) => {
      // params.data : ICar
      return params.data.make + params.data.model;
    });

    function onRowSelected(event: RowSelectedEvent<ICar, IDiscountRate>) {
      // event.data: ICar | undefined
      if (event.data && event.node.isSelected()) {
        const price = event.data.price;
        // event.context: IContext
        const discountRate = event.context.discount;
        console.log("Price with 10% discount:", price * discountRate);
      }
    }
    function onShowSelection() {
      // api.getSelectedRows() : ICar[]
      const cars: ICar[] = gridApi.value!.getSelectedRows();
      console.log(
        "Selected cars are",
        cars.map((c) => `${c.make} ${c.model}`),
      );
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      rowData,
      rowSelection,
      context,
      getRowId,
      onGridReady,
      onRowSelected,
      onShowSelection,
    };
  },
});

createApp(VueExample).mount("#app");

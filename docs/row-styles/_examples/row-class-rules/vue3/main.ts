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
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  RowApiModule,
  RowClassRules,
  RowStyleModule,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextEditorModule,
  NumberEditorModule,
  RowApiModule,
  RowStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

function randomInt() {
  return Math.floor(Math.random() * 10);
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button v-on:click="setData()">Update Data</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :rowData="rowData"
        :columnDefs="columnDefs"
        :rowClassRules="rowClassRules"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const rowData = ref<any[] | null>(getData());
    const columnDefs = ref<ColDef[]>([
      { headerName: "Employee", field: "employee" },
      { headerName: "Number Sick Days", field: "sickDays", editable: true },
    ]);
    const rowClassRules = ref<RowClassRules>({
      // row style function
      "sick-days-warning": (params) => {
        const numSickDays = params.data.sickDays;
        return numSickDays > 5 && numSickDays <= 7;
      },
      // row style expression
      "sick-days-breach": "data.sickDays >= 8",
    });

    function setData() {
      gridApi.value!.forEachNode(function (rowNode) {
        const newData = {
          employee: rowNode.data.employee,
          sickDays: randomInt(),
        };
        rowNode.setData(newData);
      });
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      rowData,
      columnDefs,
      rowClassRules,
      onGridReady,
      setData,
    };
  },
});

createApp(VueExample).mount("#app");

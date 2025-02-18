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
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
import CustomButtonComponent from "./customButtonComponentVue";
import MissionResultRenderer from "./missionResultRendererVue";
ModuleRegistry.registerModules([
  RowApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

interface IRow {
  company: string;
  location: string;
  price: number;
  successful: boolean;
}

function successIconSrc(params: boolean) {
  if (params === true) {
    return "https://www.ag-grid.com/example-assets/icons/tick-in-circle.png";
  } else {
    return "https://www.ag-grid.com/example-assets/icons/cross-in-circle.png";
  }
}

const onClick = () => alert("Mission Launched");

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button v-on:click="refreshData()">Refresh Data</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :rowData="rowData"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    CustomButtonComponent,
    MissionResultRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const rowData = ref<any[] | null>([] as IRow[]);
    const columnDefs = ref<ColDef[]>([
      {
        field: "company",
      },
      {
        field: "successful",
        headerName: "Success",
        cellRenderer: "MissionResultRenderer",
      },
      {
        field: "successful",
        headerName: "Success",
        cellRenderer: "MissionResultRenderer",
        cellRendererParams: {
          src: successIconSrc,
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        cellRenderer: "CustomButtonComponent",
        cellRendererParams: {
          onClick: onClick,
        },
      },
    ] as ColDef[]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
    });

    function refreshData() {
      gridApi.value!.forEachNode((rowNode) => {
        rowNode.setDataValue("successful", Math.random() > 0.5);
      });
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        rowData.value = data;
      };

      fetch(
        "https://www.ag-grid.com/example-assets/small-space-mission-data.json",
      )
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      rowData,
      columnDefs,
      defaultColDef,
      onGridReady,
      refreshData,
    };
  },
});

createApp(VueExample).mount("#app");

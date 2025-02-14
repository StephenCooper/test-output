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
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import CompanyLogoRenderer from "./companyLogoRendererVue";
import CompanyRenderer from "./companyRendererVue";
import CustomButtonComponent from "./customButtonComponentVue";
import MissionResultRenderer from "./missionResultRendererVue";
import PriceRenderer from "./priceRendererVue";
ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

interface IRow {
  company: string;
  location: string;
  price: number;
  successful: boolean;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :defaultColDef="defaultColDef"
      :rowData="rowData"
      :columnDefs="columnDefs"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    CompanyLogoRenderer,
    CompanyRenderer,
    CustomButtonComponent,
    MissionResultRenderer,
    PriceRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const defaultColDef = ref<ColDef>({
      flex: 10,
    });
    const rowData = ref<any[] | null>([] as IRow[]);
    const columnDefs = ref<ColDef[]>([
      {
        field: "company",
        flex: 6,
      },
      {
        field: "website",
        cellRenderer: "CompanyRenderer",
      },
      {
        headerName: "Logo",
        field: "company",
        cellRenderer: "CompanyLogoRenderer",
        cellClass: "logoCell",
        minWidth: 100,
      },
      {
        field: "revenue",
        cellRenderer: "PriceRenderer",
      },
      {
        field: "hardware",
        headerName: "Hardware",
        cellRenderer: "MissionResultRenderer",
      },
      {
        field: "actions",
        headerName: "Actions",
        cellRenderer: "CustomButtonComponent",
      },
    ] as ColDef[]);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        rowData.value = data;
      };

      fetch("https://www.ag-grid.com/example-assets/small-company-data.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      defaultColDef,
      rowData,
      columnDefs,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

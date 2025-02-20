import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";

import type {
  ColDef,
  GridApi,
  GridPreDestroyedEvent,
  GridReadyEvent,
} from "ag-grid-community";
import {
  ClientSideRowModelModule,
  ColumnApiModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { AgGridVue } from "ag-grid-vue3";

import { getData } from "./data";
import "./styles.css";

ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
            <div class="test-container">
                <div class="test-header">
                    <div v-if="showExampleButtons" style="margin-bottom: 1rem;">
                        <button v-on:click="updateColumnWidth()">Change Columns Width</button>
                        <button v-on:click="destroyGrid()">Destroy Grid</button>
                    </div>
                    <div v-if="showGridPreDestroyedState">
                        State captured on grid pre-destroyed event:<br />
                        <strong>Column fields and widths</strong>
                        <div class="values">
                            <ul>
                                <li v-for="item in columnsWidthOnPreDestroyed" key="field">
                                    Field: {{item.field}} | Width: {{item.width}}px
                                </li>
                            </ul>
                        </div>
                        <button v-on:click="reloadGrid()">Reload Grid</button>
                    </div>
                </div>
                <ag-grid-vue
                    v-if="showGrid"                
                    style="width: 100%; height: 100%;"
                    :columnDefs="columnDefs"
                    @grid-ready="onGridReady"
                    :rowData="rowData"
                    @grid-pre-destroyed="onGridPreDestroyed"></ag-grid-vue>
            </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const columnDefs = ref<ColDef[]>([
      {
        field: "name",
        headerName: "Athlete",
      },
      {
        field: "medals.gold",
        headerName: "Gold Medals",
      },
      {
        field: "person.age",
        headerName: "Age",
      },
    ]);
    const gridApi = shallowRef<GridApi | null>(null);

    const columnsWidthOnPreDestroyed = ref([]);
    const showGrid = ref(true);
    const showExampleButtons = ref(true);
    const showGridPreDestroyedState = ref(false);
    const rowData = ref<any[]>(null);

    onBeforeMount(() => {
      rowData.value = getData();
    });

    const onGridPreDestroyed = (params: GridPreDestroyedEvent) => {
      const { api } = params;
      const allColumns = api.getColumns();
      if (!allColumns) {
        return;
      }

      columnsWidthOnPreDestroyed.value = allColumns.map((column) => ({
        field: column.getColDef().field || "-",
        width: column.getActualWidth(),
      }));

      showExampleButtons.value = false;
      showGridPreDestroyedState.value = true;
    };
    const updateColumnWidth = () => {
      if (!gridApi.value) {
        return;
      }

      const newWidths = gridApi.value.getColumns().map((column) => {
        return {
          key: column.getColId(),
          newWidth: Math.round((150 + Math.random() * 100) * 100) / 100,
        };
      });
      gridApi.value.setColumnWidths(newWidths);
    };
    const destroyGrid = () => {
      showGrid.value = false;
    };

    const reloadGrid = () => {
      const updatedColDefs = columnsWidthOnPreDestroyed
        ? columnDefs.value.map((val) => {
            const colDef = val;
            const result = {
              ...colDef,
            };

            const restoredColConfig = columnsWidthOnPreDestroyed.value.find(
              (columnWidth) => columnWidth.field === colDef.field,
            );
            if (restoredColConfig && restoredColConfig.width) {
              result.width = restoredColConfig.width;
            }

            return result;
          })
        : columnDefs;

      columnDefs.value = updatedColDefs;
      showGrid.value = true;
      showGridPreDestroyedState.value = false;
      showExampleButtons.value = true;
    };
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      columnDefs,
      gridApi,
      rowData,
      columnsWidthOnPreDestroyed,
      showGrid,
      showExampleButtons,
      showGridPreDestroyedState,
      onGridReady,
      onGridPreDestroyed,
      updateColumnWidth,
      destroyGrid,
      reloadGrid,
    };
  },
});

createApp(VueExample).mount("#app");

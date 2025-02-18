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
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">
        <label>
          <button v-on:click="onBtNoGroups()">No Groups</button>
        </label>
        <label>
          <div class="participant-group legend-box"></div>
          <button v-on:click="onParticipantInGroupOnly()">Participant in Group</button>
        </label>
        <label>
          <div class="medals-group legend-box"></div>
          <button v-on:click="onMedalsInGroupOnly()">Medals in Group</button>
        </label>
        <label>
          <div class="participant-group legend-box"></div>
          <div class="medals-group legend-box"></div>
          <button v-on:click="onParticipantAndMedalsInGroups()">Participant and Medals in Group</button>
        </label>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        class="test-grid"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :maintainColumnOrder="true"
        :rowData="rowData"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", colId: "athlete" },
      { field: "age", colId: "age" },
      { field: "country", colId: "country" },
      { field: "year", colId: "year" },
      { field: "date", colId: "date" },
      { field: "total", colId: "total" },
      { field: "gold", colId: "gold" },
      { field: "silver", colId: "silver" },
      { field: "bronze", colId: "bronze" },
    ]);
    const defaultColDef = ref<ColDef>({
      initialWidth: 150,
      filter: true,
    });
    const rowData = ref<IOlympicData[]>(null);

    function onBtNoGroups() {
      const columnDefs: ColDef[] = [
        { field: "athlete", colId: "athlete" },
        { field: "age", colId: "age" },
        { field: "country", colId: "country" },
        { field: "year", colId: "year" },
        { field: "date", colId: "date" },
        { field: "total", colId: "total" },
        { field: "gold", colId: "gold" },
        { field: "silver", colId: "silver" },
        { field: "bronze", colId: "bronze" },
      ];
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    function onMedalsInGroupOnly() {
      const columnDefs: (ColDef | ColGroupDef)[] = [
        { field: "athlete", colId: "athlete" },
        { field: "age", colId: "age" },
        { field: "country", colId: "country" },
        { field: "year", colId: "year" },
        { field: "date", colId: "date" },
        {
          headerName: "Medals",
          headerClass: "medals-group",
          children: [
            { field: "total", colId: "total" },
            { field: "gold", colId: "gold" },
            { field: "silver", colId: "silver" },
            { field: "bronze", colId: "bronze" },
          ],
        },
      ];
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    function onParticipantInGroupOnly() {
      const columnDefs: (ColDef | ColGroupDef)[] = [
        {
          headerName: "Participant",
          headerClass: "participant-group",
          children: [
            { field: "athlete", colId: "athlete" },
            { field: "age", colId: "age" },
            { field: "country", colId: "country" },
            { field: "year", colId: "year" },
            { field: "date", colId: "date" },
          ],
        },
        { field: "total", colId: "total" },
        { field: "gold", colId: "gold" },
        { field: "silver", colId: "silver" },
        { field: "bronze", colId: "bronze" },
      ];
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    function onParticipantAndMedalsInGroups() {
      const columnDefs: (ColDef | ColGroupDef)[] = [
        {
          headerName: "Participant",
          headerClass: "participant-group",
          children: [
            { field: "athlete", colId: "athlete" },
            { field: "age", colId: "age" },
            { field: "country", colId: "country" },
            { field: "year", colId: "year" },
            { field: "date", colId: "date" },
          ],
        },
        {
          headerName: "Medals",
          headerClass: "medals-group",
          children: [
            { field: "total", colId: "total" },
            { field: "gold", colId: "gold" },
            { field: "silver", colId: "silver" },
            { field: "bronze", colId: "bronze" },
          ],
        },
      ];
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      onGridReady,
      onBtNoGroups,
      onMedalsInGroupOnly,
      onParticipantInGroupOnly,
      onParticipantAndMedalsInGroups,
    };
  },
});

createApp(VueExample).mount("#app");

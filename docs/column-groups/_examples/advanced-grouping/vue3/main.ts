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
  HeaderClassParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

function headerClassFunc(params: HeaderClassParams) {
  let foundC = false;
  let foundG = false;
  // for the bottom row of headers, column is present,
  // otherwise columnGroup is present. we are guaranteed
  // at least one is always present.
  let item = params.column ? params.column : params.columnGroup;
  // walk up the tree, see if we are in C or F groups
  while (item) {
    // if groupId is set then this must be a group.
    const colDef = item.getDefinition() as ColGroupDef;
    if (colDef.groupId === "GroupC") {
      foundC = true;
    } else if (colDef.groupId === "GroupG") {
      foundG = true;
    }
    item = item.getParent();
  }
  if (foundG) {
    return "column-group-g";
  } else if (foundC) {
    return "column-group-c";
  }
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="button-bar">
        <button v-on:click="expandAll(true)">Expand All</button>
        <button v-on:click="expandAll(false)">Contract All</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColGroupDef="defaultColGroupDef"
        :defaultColDef="defaultColDef"
        :icons="icons"
        :rowData="rowData"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<(ColDef | ColGroupDef)[]>([
      {
        headerName: "Group A",
        groupId: "GroupA",
        children: [
          {
            headerName: "Athlete 1",
            field: "athlete",
            width: 150,
            filter: "agTextColumnFilter",
          },
          {
            headerName: "Group B",
            groupId: "GroupB",
            children: [
              { headerName: "Country 1", field: "country", width: 120 },
              {
                headerName: "Group C",
                groupId: "GroupC",
                children: [
                  { headerName: "Sport 1", field: "sport", width: 110 },
                  {
                    headerName: "Group D",
                    groupId: "GroupD",
                    children: [
                      {
                        headerName: "Total 1",
                        field: "total",
                        width: 100,
                        filter: "agNumberColumnFilter",
                      },
                      {
                        headerName: "Group E",
                        groupId: "GroupE",
                        openByDefault: true,
                        children: [
                          {
                            headerName: "Gold 1",
                            field: "gold",
                            width: 100,
                            filter: "agNumberColumnFilter",
                          },
                          {
                            headerName: "Group F",
                            groupId: "GroupF",
                            openByDefault: true,
                            children: [
                              {
                                headerName: "Silver 1",
                                field: "silver",
                                width: 100,
                                filter: "agNumberColumnFilter",
                              },
                              {
                                headerName: "Group G",
                                groupId: "GroupG",
                                children: [
                                  {
                                    headerName: "Bronze",
                                    field: "bronze",
                                    width: 100,
                                    filter: "agNumberColumnFilter",
                                  },
                                ],
                              },
                              {
                                headerName: "Silver 2",
                                columnGroupShow: "open",
                                field: "silver",
                                width: 100,
                                filter: "agNumberColumnFilter",
                              },
                            ],
                          },
                          {
                            headerName: "Gold 2",
                            columnGroupShow: "open",
                            field: "gold",
                            width: 100,
                            filter: "agNumberColumnFilter",
                          },
                        ],
                      },
                      {
                        headerName: "Total 2",
                        columnGroupShow: "open",
                        field: "total",
                        width: 100,
                        filter: "agNumberColumnFilter",
                      },
                    ],
                  },
                  {
                    headerName: "Sport 2",
                    columnGroupShow: "open",
                    field: "sport",
                    width: 110,
                  },
                ],
              },
              {
                headerName: "Country 2",
                columnGroupShow: "open",
                field: "country",
                width: 120,
              },
            ],
          },
          {
            headerName: "Age 2",
            columnGroupShow: "open",
            field: "age",
            width: 90,
            filter: "agNumberColumnFilter",
          },
        ],
      },
      {
        headerName: "Athlete 2",
        columnGroupShow: "open",
        field: "athlete",
        width: 150,
        filter: "agTextColumnFilter",
      },
    ]);
    const defaultColGroupDef = ref<Partial<ColGroupDef>>({
      headerClass: headerClassFunc,
    });
    const defaultColDef = ref<ColDef>({
      headerClass: headerClassFunc,
      filter: true,
    });
    const icons = ref<{
      [key: string]: ((...args: any[]) => any) | string;
    }>({
      columnGroupOpened: '<i class="far fa-minus-square"/>',
      columnGroupClosed: '<i class="far fa-plus-square"/>',
    });
    const rowData = ref<IOlympicData[]>(null);

    function expandAll(expand: boolean) {
      const groupNames = [
        "GroupA",
        "GroupB",
        "GroupC",
        "GroupD",
        "GroupE",
        "GroupF",
        "GroupG",
      ];
      groupNames.forEach((groupId) => {
        gridApi.value!.setColumnGroupOpened(groupId, expand);
      });
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
      defaultColGroupDef,
      defaultColDef,
      icons,
      rowData,
      onGridReady,
      expandAll,
    };
  },
});

createApp(VueExample).mount("#app");

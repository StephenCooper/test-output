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
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GetServerSideGroupKey,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IRowNode,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  IServerSideGetRowsRequest,
  IsServerSideGroup,
  IsServerSideGroupOpenByDefaultParams,
  ModuleRegistry,
  RowModelType,
  RowSelectionOptions,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
  TreeDataModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextFilterModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  TreeDataModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  ValidationModule /* Development Only */,
]);

let fakeServer: {
  getData: (request: IServerSideGetRowsRequest) => void;
  addChildRow: (route: string[], newRow: any) => void;
  toggleEmployment: (route: string[]) => void;
  removeEmployee: (route: string[]) => void;
  moveEmployee: (from: string[], to: string[]) => void;
};

function getRouteToNode(rowNode: IRowNode): string[] {
  if (!rowNode.parent) {
    return [];
  }
  return [
    ...getRouteToNode(rowNode.parent),
    rowNode.key ? rowNode.key : rowNode.data.employeeName,
  ];
}

let latestId = 100000;

function createFakeServer(fakeServerData: any[], api: GridApi) {
  const getDataAtRoute = (route: string[]) => {
    let mutableRoute = [...route];
    let target: any = { underlings: fakeServerData };
    while (mutableRoute.length) {
      const nextRoute = mutableRoute[0];
      mutableRoute = mutableRoute.slice(1);
      target = target.underlings.find((e: any) => e.employeeName === nextRoute);
    }
    return target;
  };
  const sanitizeRowForGrid = (d: any) => {
    return {
      group: !!d.underlings && !!d.underlings.length,
      employeeId: d.employeeId,
      employeeName: d.employeeName,
      employmentType: d.employmentType,
      startDate: d.startDate,
    };
  };
  fakeServer = {
    getData: (request: IServerSideGetRowsRequest) => {
      function extractRowsFromData(groupKeys: string[], data: any[]): any {
        if (groupKeys.length === 0) {
          return data.map(sanitizeRowForGrid);
        }
        const key = groupKeys[0];
        for (let i = 0; i < data.length; i++) {
          if (data[i].employeeName === key) {
            return extractRowsFromData(
              groupKeys.slice(1),
              data[i].underlings.slice(),
            );
          }
        }
      }
      return extractRowsFromData(request.groupKeys, fakeServerData);
    },
    addChildRow: (route: string[], newRow: any) => {
      const target = getDataAtRoute(route);
      if (!target.underlings || target.underlings.length === 0) {
        target.underlings = [newRow];
        // update the parent row via transaction
        api.applyServerSideTransaction({
          route: route.slice(0, route.length - 1),
          update: [sanitizeRowForGrid(target)],
        });
      } else {
        target.underlings.push(newRow);
        // add the child row via transaction
        api.applyServerSideTransaction({
          route,
          add: [sanitizeRowForGrid(newRow)],
        });
      }
    },
    toggleEmployment: (route: string[]) => {
      const target = getDataAtRoute(route);
      // update the data at the source
      target.employmentType =
        target.employmentType === "Contract" ? "Permanent" : "Contract";
      // inform the grid of the changes
      api.applyServerSideTransaction({
        route: route.slice(0, route.length - 1),
        update: [sanitizeRowForGrid(target)],
      });
    },
    removeEmployee: (route: string[]) => {
      const target = getDataAtRoute(route);
      const parent = getDataAtRoute(route.slice(0, route.length - 1));
      parent.underlings = parent.underlings.filter(
        (child: any) => child.employeeName !== target.employeeName,
      );
      if (parent.underlings.length === 0) {
        // update the parent row via transaction, as it's no longer a group
        api.applyServerSideTransaction({
          route: route.slice(0, route.length - 2),
          update: [sanitizeRowForGrid(parent)],
        });
      } else {
        // inform the grid of the changes
        api.applyServerSideTransaction({
          route: route.slice(0, route.length - 1),
          remove: [sanitizeRowForGrid(target)],
        });
      }
    },
    moveEmployee: (route: string[], to: string[]) => {
      const target = getDataAtRoute(route);
      // remove employee from old group
      fakeServer.removeEmployee(route);
      // add employee to new group
      fakeServer.addChildRow(to, target);
    },
  };
  return fakeServer;
}

function createServerSideDatasource(fakeServer: any) {
  const dataSource: IServerSideDatasource = {
    getRows: (params: IServerSideGetRowsParams) => {
      console.log("ServerSideDatasource.getRows: params = ", params);
      const request = params.request;
      const allRows = fakeServer.getData(request);
      const doingInfinite = request.startRow != null && request.endRow != null;
      const result = doingInfinite
        ? {
            rowData: allRows.slice(request.startRow, request.endRow),
            rowCount: allRows.length,
          }
        : { rowData: allRows };
      console.log("getRows: result = ", result);
      setTimeout(() => {
        params.success(result);
      }, 500);
    },
  };
  return dataSource;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button v-on:click="addToSelected()">Add Child to Selected</button>
        <button v-on:click="updateSelected()">Update Selected</button>
        <button v-on:click="deleteSelected()">Delete Selected</button>
        <button v-on:click="moveSelected()">Move Selected to Robert Peterson</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :rowModelType="rowModelType"
        :treeData="true"
        :cacheBlockSize="cacheBlockSize"
        :rowSelection="rowSelection"
        :isServerSideGroupOpenByDefault="isServerSideGroupOpenByDefault"
        :getRowId="getRowId"
        :isServerSideGroup="isServerSideGroup"
        :getServerSideGroupKey="getServerSideGroupKey"
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
      { field: "employeeId", hide: true },
      { field: "employeeName", hide: true },
      { field: "employmentType" },
      { field: "startDate" },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 235,
      flex: 1,
      sortable: false,
    });
    const autoGroupColumnDef = ref<ColDef>({
      field: "employeeName",
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const cacheBlockSize = ref(10);
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "singleRow",
    });
    const isServerSideGroupOpenByDefault = ref<
      (params: IsServerSideGroupOpenByDefaultParams) => boolean
    >((params: IsServerSideGroupOpenByDefaultParams) => {
      const isKathrynPowers =
        params.rowNode.level == 0 &&
        params.data.employeeName == "Kathryn Powers";
      const isMabelWard =
        params.rowNode.level == 1 && params.data.employeeName == "Mabel Ward";
      return isKathrynPowers || isMabelWard;
    });
    const getRowId = ref<GetRowIdFunc>((row: GetRowIdParams) =>
      String(row.data.employeeId),
    );
    const isServerSideGroup = ref<IsServerSideGroup>(
      (dataItem: any) => dataItem.group,
    );
    const getServerSideGroupKey = ref<GetServerSideGroupKey>(
      (dataItem: any) => dataItem.employeeName,
    );
    const rowData = ref<any[]>(null);

    function addToSelected() {
      const selected = gridApi.value!.getSelectedNodes()[0];
      if (!selected) {
        console.warn("No row was selected.");
        return;
      }
      const route = getRouteToNode(selected);
      const newRow = {
        employeeId: ++latestId,
        employeeName: "Bertrand Parker " + latestId,
        employmentType: "Permanent",
        startDate: "20/01/1999",
      };
      fakeServer.addChildRow(route, newRow);
    }
    function updateSelected() {
      const selected = gridApi.value!.getSelectedNodes()[0];
      if (!selected) {
        console.warn("No row was selected.");
        return;
      }
      const route = getRouteToNode(selected);
      fakeServer.toggleEmployment(route);
    }
    function deleteSelected() {
      const selected = gridApi.value!.getSelectedNodes()[0];
      if (!selected) {
        console.warn("No row was selected.");
        return;
      }
      const route = getRouteToNode(selected);
      fakeServer.removeEmployee(route);
    }
    function moveSelected() {
      const selected = gridApi.value!.getSelectedNodes()[0];
      if (!selected) {
        console.warn("No row was selected.");
        return;
      }
      const route = getRouteToNode(selected);
      fakeServer.moveEmployee(route, ["Robert Peterson"]);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        const adjustedData = [
          {
            employeeId: -1,
            employeeName: "Robert Peterson",
            employmentType: "Founder",
            startDate: "24/01/1990",
          },
          ...data,
        ];
        const fakeServer = createFakeServer(adjustedData, params.api!);
        const datasource = createServerSideDatasource(fakeServer);
        params.api!.setGridOption("serverSideDatasource", datasource);
      };

      fetch("https://www.ag-grid.com/example-assets/tree-data.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      rowModelType,
      cacheBlockSize,
      rowSelection,
      isServerSideGroupOpenByDefault,
      getRowId,
      isServerSideGroup,
      getServerSideGroupKey,
      rowData,
      onGridReady,
      addToSelected,
      updateSelected,
      deleteSelected,
      moveSelected,
    };
  },
});

createApp(VueExample).mount("#app");

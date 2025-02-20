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
  GetServerSideGroupKey,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsRequest,
  IsServerSideGroup,
  IsServerSideGroupOpenByDefaultParams,
  ModuleRegistry,
  RowModelType,
  RowSelectionOptions,
  TextFilterModule,
  ValidationModule,
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
  ServerSideRowModelApiModule,
  TextFilterModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  TreeDataModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);

interface FakeServer {
  getData: (request: IServerSideGetRowsRequest) => any;
  addChildRow: (route: string[], newRow: any) => void;
  toggleEmployment: (route: string[]) => void;
  removeEmployee: (route: string[]) => void;
  moveEmployee: (from: string[], to: string[]) => void;
}

let fakeServer: FakeServer;

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
    getData: (request: IServerSideGetRowsRequest): any => {
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

function createServerSideDatasource(fakeServer: FakeServer) {
  const dataSource: IServerSideDatasource = {
    getRows: (params) => {
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
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :rowModelType="rowModelType"
        :treeData="true"
        :columnDefs="columnDefs"
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
    const defaultColDef = ref<ColDef>({
      width: 235,
      flex: 1,
      sortable: false,
    });
    const autoGroupColumnDef = ref<ColDef>({
      field: "employeeName",
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const columnDefs = ref<ColDef[]>([
      { field: "employeeId", hide: true },
      { field: "employeeName", hide: true },
      { field: "employmentType" },
      { field: "startDate" },
    ]);
    const cacheBlockSize = ref(10);
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
      groupSelects: "descendants",
    });
    const isServerSideGroupOpenByDefault = ref<
      (params: IsServerSideGroupOpenByDefaultParams) => boolean
    >((params) => {
      const isKathrynPowers =
        params.rowNode.level == 0 &&
        params.data.employeeName == "Kathryn Powers";
      const isMabelWard =
        params.rowNode.level == 1 && params.data.employeeName == "Mabel Ward";
      return isKathrynPowers || isMabelWard;
    });
    const getRowId = ref<GetRowIdFunc>((row) => String(row.data.employeeId));
    const isServerSideGroup = ref<IsServerSideGroup>(
      (dataItem) => dataItem.group,
    );
    const getServerSideGroupKey = ref<GetServerSideGroupKey>(
      (dataItem) => dataItem.employeeName,
    );
    const rowData = ref<any[]>(null);

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
      defaultColDef,
      autoGroupColumnDef,
      rowModelType,
      columnDefs,
      cacheBlockSize,
      rowSelection,
      isServerSideGroupOpenByDefault,
      getRowId,
      isServerSideGroup,
      getServerSideGroupKey,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

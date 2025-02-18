import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsRequest,
  ModuleRegistry,
  RowModelType,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);

function getServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params) => {
      const request = params.request;
      console.log("[Datasource] - rows requested by grid: ", params.request);
      const response = server.getData(request);
      // add pivot results cols to the grid
      addPivotResultCols(request, response, params.api);
      // simulating real server call with a 500ms delay
      setTimeout(() => {
        if (response.success) {
          // supply data to grid
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          params.fail();
        }
      }, 500);
    },
  };
}

function addPivotResultCols(
  request: IServerSideGetRowsRequest,
  response: any,
  api: GridApi,
) {
  // check if pivot colDefs already exist
  const existingPivotColDefs = api.getPivotResultColumns();
  if (existingPivotColDefs && existingPivotColDefs.length > 0) {
    return;
  }
  // create pivot colDef's based of data returned from the server
  const pivotResultColumns = createPivotResultColumns(
    request,
    response.pivotFields,
  );
  // supply pivot result columns to the grid
  api.setPivotResultColumns(pivotResultColumns);
}

function addColDef(
  colId: string,
  parts: string[],
  res: (ColDef | ColGroupDef)[],
  request: IServerSideGetRowsRequest,
): (ColDef | ColGroupDef)[] {
  if (parts.length === 0) return [];
  const first = parts[0];
  const existing: ColGroupDef = res.find(
    (r: ColDef | ColGroupDef) => "groupId" in r && r.groupId === first,
  ) as ColGroupDef;
  if (existing) {
    existing["children"] = addColDef(
      colId,
      parts.slice(1),
      existing.children,
      request,
    );
  } else {
    const colDef: any = {};
    const isGroup = parts.length > 1;
    if (isGroup) {
      colDef["groupId"] = first;
      colDef["headerName"] = first;
    } else {
      const valueCol = request.valueCols.find((r) => r.field === first);
      if (valueCol) {
        colDef["colId"] = colId;
        colDef["headerName"] = valueCol.displayName;
        colDef["field"] = colId;
      }
    }
    const children = addColDef(colId, parts.slice(1), [], request);
    if (children.length > 0) {
      colDef["children"] = children;
    }
    res.push(colDef);
  }
  return res;
}

function createPivotResultColumns(
  request: IServerSideGetRowsRequest,
  pivotFields: string[],
): ColGroupDef[] {
  if (request.pivotMode && request.pivotCols.length > 0) {
    const pivotResultCols: ColGroupDef[] = [];
    pivotFields.forEach((field) =>
      addColDef(field, field.split("_"), pivotResultCols, request),
    );
    return pivotResultCols;
  }
  return [];
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :autoGroupColumnDef="autoGroupColumnDef"
      :rowModelType="rowModelType"
      :pivotMode="true"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "country", rowGroup: true },
      { field: "year", pivot: true },
      { field: "gold", aggFunc: "sum" },
      { field: "silver", aggFunc: "sum" },
      { field: "bronze", aggFunc: "sum" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 200,
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const rowData = ref<IOlympicData[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        // setup the fake server with entire dataset
        const fakeServer = new FakeServer(data);
        // create datasource with a reference to the fake server
        const datasource = getServerSideDatasource(fakeServer);
        // register the datasource with the grid
        params.api!.setGridOption("serverSideDatasource", datasource);
      };

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      rowModelType,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

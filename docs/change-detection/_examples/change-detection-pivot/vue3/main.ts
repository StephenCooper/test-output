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
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  IRowNode,
  ModuleRegistry,
  ValidationModule,
  ValueGetterParams,
  createGrid,
} from "ag-grid-community";
import { PivotModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  PivotModule,
  HighlightChangesModule,
  ValidationModule /* Development Only */,
]);

interface Student {
  student: number;
  yearGroup: string;
  age: number;
  course: string;
  points: number;
}

function ageRangeValueGetter(params: ValueGetterParams) {
  const age = params.getValue("age");
  if (age === undefined) {
    return null;
  }
  if (age < 20) {
    return "< 20";
  } else if (age > 30) {
    return "> 30";
  } else {
    return "20 to 30";
  }
}

// pretty basic, but deterministic (so same numbers each time we run), random number generator
var seed: number;

function random() {
  seed = ((seed || 1) * 16807) % 2147483647;
  return seed;
}

function getRowData() {
  const rowData = [];
  for (let i = 1; i <= 100; i++) {
    const row = createRow();
    rowData.push(row);
  }
  return rowData;
}

var studentId: number;

function createRow() {
  studentId = studentId ? studentId : 10023;
  const randomNumber = random();
  return {
    student: studentId++,
    points: (randomNumber % 60) + 40,
    course: ["Science", "History"][randomNumber % 3 === 0 ? 0 : 1],
    yearGroup: "Year " + ((randomNumber % 4) + 1),
    age: (randomNumber % 25) + 15, // 15 to 40
  };
}

function createNewRandomScore(data: Student) {
  let randomValue = createRandomNumber();
  // make sure random number is not actually the same number again
  while (randomValue === data.points) {
    randomValue = createRandomNumber();
  }
  return randomValue;
}

function createRandomNumber() {
  return Math.floor(Math.random() * 100);
}

function pickExistingRowNodeAtRandom(api: GridApi) {
  const allItems: IRowNode[] = [];
  api.forEachLeafNode(function (rowNode) {
    allItems.push(rowNode);
  });
  if (allItems.length === 0) {
    return;
  }
  const result = allItems[Math.floor(Math.random() * allItems.length)];
  return result;
}

function pickExistingRowItemAtRandom(api: GridApi): Student | null {
  const rowNode = pickExistingRowNodeAtRandom(api);
  return rowNode ? rowNode.data : null;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header">
        <div>
          <label>
            <input type="checkbox" id="pivot-mode" v-on:click="pivotMode()">
              Group &amp; Pivot
            </label>
          </div>
          <div style="margin-top: 6px">
            <button v-on:click="updateOneRecord()">Set One Value</button>
            <button v-on:click="updateUsingTransaction()">Update Points</button>
            <button v-on:click="addNewGroupUsingTransaction()">Add Year 5</button>
            <button v-on:click="addNewCourse()">Add Physics Row</button>
            <button v-on:click="removePhysics()">Remove All Physics</button>
            <button v-on:click="moveCourse()">Move Course</button>
          </div>
        </div>
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :rowData="rowData"
          :pivotMode="true"
          :groupDefaultExpanded="groupDefaultExpanded"
          :getRowId="getRowId"></ag-grid-vue>
        </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { headerName: "Student ID", field: "student" },
      { headerName: "Year Group", field: "yearGroup", rowGroup: true },
      { headerName: "Age", field: "age" },
      { headerName: "Course", field: "course", pivot: true },
      {
        headerName: "Age Range",
        valueGetter: ageRangeValueGetter,
        pivot: true,
      },
      { headerName: "Points", field: "points", aggFunc: "sum" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 150,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    });
    const rowData = ref<any[] | null>(getRowData());
    const groupDefaultExpanded = ref(1);
    const getRowId = ref<GetRowIdFunc>((params: GetRowIdParams) =>
      String(params.data.student),
    );

    function pivotMode() {
      const pivotModeOn = (
        document.getElementById("pivot-mode") as HTMLInputElement
      ).checked;
      gridApi.value!.setGridOption("pivotMode", pivotModeOn);
      gridApi.value!.applyColumnState({
        state: [
          { colId: "yearGroup", rowGroup: pivotModeOn },
          { colId: "course", pivot: pivotModeOn, pivotIndex: 1 },
          { colId: "ageRange", pivot: pivotModeOn, pivotIndex: 0 },
        ],
      });
    }
    function updateOneRecord() {
      const rowNodeToUpdate = pickExistingRowNodeAtRandom(gridApi.value!);
      if (!rowNodeToUpdate) return;
      const randomValue = createNewRandomScore(rowNodeToUpdate.data);
      console.log(
        "updating points to " + randomValue + " on ",
        rowNodeToUpdate.data,
      );
      rowNodeToUpdate.setDataValue("points", randomValue);
    }
    function updateUsingTransaction() {
      const itemToUpdate = pickExistingRowItemAtRandom(gridApi.value!);
      if (!itemToUpdate) {
        return;
      }
      console.log("updating - before", itemToUpdate);
      itemToUpdate.points = createNewRandomScore(itemToUpdate);
      const transaction = {
        update: [itemToUpdate],
      };
      console.log("updating - after", itemToUpdate);
      gridApi.value!.applyTransaction(transaction);
    }
    function addNewGroupUsingTransaction() {
      const item1 = createRow();
      const item2 = createRow();
      item1.yearGroup = "Year 5";
      item2.yearGroup = "Year 5";
      const transaction = {
        add: [item1, item2],
      };
      console.log("add - ", item1);
      console.log("add - ", item2);
      gridApi.value!.applyTransaction(transaction);
    }
    function addNewCourse() {
      const item1 = createRow();
      item1.course = "Physics";
      const transaction = {
        add: [item1],
      };
      console.log("add - ", item1);
      gridApi.value!.applyTransaction(transaction);
    }
    function removePhysics() {
      const allPhysics: any = [];
      gridApi.value!.forEachLeafNode(function (rowNode) {
        if (rowNode.data.course === "Physics") {
          allPhysics.push(rowNode.data);
        }
      });
      const transaction = {
        remove: allPhysics,
      };
      console.log("removing " + allPhysics.length + " physics items.");
      gridApi.value!.applyTransaction(transaction);
    }
    function moveCourse() {
      const item = pickExistingRowItemAtRandom(gridApi.value!);
      if (!item) {
        return;
      }
      item.course = item.course === "History" ? "Science" : "History";
      const transaction = {
        update: [item],
      };
      console.log("moving ", item);
      gridApi.value!.applyTransaction(transaction);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      (document.getElementById("pivot-mode") as HTMLInputElement).checked =
        true;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      groupDefaultExpanded,
      getRowId,
      onGridReady,
      pivotMode,
      updateOneRecord,
      updateUsingTransaction,
      addNewGroupUsingTransaction,
      addNewCourse,
      removePhysics,
      moveCourse,
    };
  },
});

createApp(VueExample).mount("#app");

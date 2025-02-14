"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
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

const pickExistingRowItemAtRandom: (api: GridApi) => Student | null = (
  api: GridApi,
) => {
  const rowNode = pickExistingRowNodeAtRandom(api);
  return rowNode ? rowNode.data : null;
};

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(getRowData());
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
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
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 150,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    };
  }, []);
  const getRowId = useCallback(
    (params: GetRowIdParams) => String(params.data.student),
    [],
  );

  const onGridReady = useCallback((params: GridReadyEvent) => {
    (document.getElementById("pivot-mode") as HTMLInputElement).checked = true;
  }, []);

  const pivotMode = useCallback(() => {
    const pivotModeOn = (
      document.getElementById("pivot-mode") as HTMLInputElement
    ).checked;
    gridRef.current!.api.setGridOption("pivotMode", pivotModeOn);
    gridRef.current!.api.applyColumnState({
      state: [
        { colId: "yearGroup", rowGroup: pivotModeOn },
        { colId: "course", pivot: pivotModeOn, pivotIndex: 1 },
        { colId: "ageRange", pivot: pivotModeOn, pivotIndex: 0 },
      ],
    });
  }, []);

  const updateOneRecord = useCallback(() => {
    const rowNodeToUpdate = pickExistingRowNodeAtRandom(gridRef.current!.api!);
    if (!rowNodeToUpdate) return;
    const randomValue = createNewRandomScore(rowNodeToUpdate.data);
    console.log(
      "updating points to " + randomValue + " on ",
      rowNodeToUpdate.data,
    );
    rowNodeToUpdate.setDataValue("points", randomValue);
  }, []);

  const updateUsingTransaction = useCallback(() => {
    const itemToUpdate = pickExistingRowItemAtRandom(gridRef.current!.api!);
    if (!itemToUpdate) {
      return;
    }
    console.log("updating - before", itemToUpdate);
    itemToUpdate.points = createNewRandomScore(itemToUpdate);
    const transaction = {
      update: [itemToUpdate],
    };
    console.log("updating - after", itemToUpdate);
    gridRef.current!.api.applyTransaction(transaction);
  }, []);

  const addNewGroupUsingTransaction = useCallback(() => {
    const item1 = createRow();
    const item2 = createRow();
    item1.yearGroup = "Year 5";
    item2.yearGroup = "Year 5";
    const transaction = {
      add: [item1, item2],
    };
    console.log("add - ", item1);
    console.log("add - ", item2);
    gridRef.current!.api.applyTransaction(transaction);
  }, []);

  const addNewCourse = useCallback(() => {
    const item1 = createRow();
    item1.course = "Physics";
    const transaction = {
      add: [item1],
    };
    console.log("add - ", item1);
    gridRef.current!.api.applyTransaction(transaction);
  }, []);

  const removePhysics = useCallback(() => {
    const allPhysics: any = [];
    gridRef.current!.api.forEachLeafNode(function (rowNode) {
      if (rowNode.data.course === "Physics") {
        allPhysics.push(rowNode.data);
      }
    });
    const transaction = {
      remove: allPhysics,
    };
    console.log("removing " + allPhysics.length + " physics items.");
    gridRef.current!.api.applyTransaction(transaction);
  }, []);

  const moveCourse = useCallback(() => {
    const item = pickExistingRowItemAtRandom(gridRef.current!.api!);
    if (!item) {
      return;
    }
    item.course = item.course === "History" ? "Science" : "History";
    const transaction = {
      update: [item],
    };
    console.log("moving ", item);
    gridRef.current!.api.applyTransaction(transaction);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="example-header">
          <div>
            <label>
              <input type="checkbox" id="pivot-mode" onClick={pivotMode} />
              Group &amp; Pivot
            </label>
          </div>

          <div style={{ marginTop: "6px" }}>
            <button onClick={updateOneRecord}>Set One Value</button>
            <button onClick={updateUsingTransaction}>Update Points</button>
            <button onClick={addNewGroupUsingTransaction}>Add Year 5</button>
            <button onClick={addNewCourse}>Add Physics Row</button>
            <button onClick={removePhysics}>Remove All Physics</button>
            <button onClick={moveCourse}>Move Course</button>
          </div>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pivotMode={true}
            groupDefaultExpanded={1}
            getRowId={getRowId}
            onGridReady={onGridReady}
          />
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
(window as any).tearDownExample = () => root.unmount();

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
import { getData } from "./data.jsx";
import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ModuleRegistry,
  RowApiModule,
  RowSelectionModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  RowSelectionModule,
  RowApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let newCount = 1;

const createNewRowData = () => {
  const newData = {
    make: "Toyota " + newCount,
    model: "Celica " + newCount,
    price: 35000 + newCount * 17,
    zombies: "Headless",
    style: "Little",
    clothes: "Airbag",
  };
  newCount++;
  return newData;
};

const printResult = (res) => {
  console.log("---------------------------------------");
  if (res.add) {
    res.add.forEach((rowNode) => {
      console.log("Added Row Node", rowNode);
    });
  }
  if (res.remove) {
    res.remove.forEach((rowNode) => {
      console.log("Removed Row Node", rowNode);
    });
  }
  if (res.update) {
    res.update.forEach((rowNode) => {
      console.log("Updated Row Node", rowNode);
    });
  }
};

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(getData());
  const [columnDefs, setColumnDefs] = useState([
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "zombies" },
    { field: "style" },
    { field: "clothes" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
    };
  }, []);
  const rowSelection = useMemo(() => {
    return { mode: "multiRow" };
  }, []);

  const getRowData = useCallback(() => {
    const rowData = [];
    gridRef.current.api.forEachNode(function (node) {
      rowData.push(node.data);
    });
    console.log("Row Data:");
    console.table(rowData);
  }, []);

  const clearData = useCallback(() => {
    const rowData = [];
    gridRef.current.api.forEachNode(function (node) {
      rowData.push(node.data);
    });
    const res = gridRef.current.api.applyTransaction({
      remove: rowData,
    });
    printResult(res);
  }, []);

  const addItems = useCallback((addIndex) => {
    const newItems = [
      createNewRowData(),
      createNewRowData(),
      createNewRowData(),
    ];
    const res = gridRef.current.api.applyTransaction({
      add: newItems,
      addIndex: addIndex,
    });
    printResult(res);
  }, []);

  const updateItems = useCallback(() => {
    // update the first 2 items
    const itemsToUpdate = [];
    gridRef.current.api.forEachNodeAfterFilterAndSort(
      function (rowNode, index) {
        // only do first 2
        if (index >= 2) {
          return;
        }
        const data = rowNode.data;
        data.price = Math.floor(Math.random() * 20000 + 20000);
        itemsToUpdate.push(data);
      },
    );
    const res = gridRef.current.api.applyTransaction({ update: itemsToUpdate });
    printResult(res);
  }, []);

  const onRemoveSelected = useCallback(() => {
    const selectedData = gridRef.current.api.getSelectedRows();
    const res = gridRef.current.api.applyTransaction({ remove: selectedData });
    printResult(res);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "4px" }}>
          <button onClick={() => addItems(undefined)}>Add Items</button>
          <button onClick={() => addItems(2)}>Add Items addIndex=2</button>
          <button onClick={updateItems}>Update Top 2</button>
          <button onClick={onRemoveSelected}>Remove Selected</button>
          <button onClick={getRowData}>Get Row Data</button>
          <button onClick={clearData}>Clear Data</button>
        </div>
        <div style={{ flexGrow: "1" }}>
          <div style={gridStyle}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowSelection={rowSelection}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
window.tearDownExample = () => root.unmount();

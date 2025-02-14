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
import { createDataItem, getData } from "./data.jsx";
import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  CustomFilterModule,
  HighlightChangesModule,
  ModuleRegistry,
  RowSelectionModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  TextFilterModule,
  RowSelectionModule,
  HighlightChangesModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  CustomFilterModule,
  ValidationModule /* Development Only */,
]);

let aggCallCount = 0;

let compareCallCount = 0;

let filterCallCount = 0;

const myAggFunc = (params) => {
  aggCallCount++;
  let total = 0;
  for (let i = 0; i < params.values.length; i++) {
    total += params.values[i];
  }
  return total;
};

const myComparator = (a, b) => {
  compareCallCount++;
  return a < b ? -1 : 1;
};

const getMyFilter = () => {
  class MyFilter {
    filterParams;
    filterValue;
    eGui;
    eInput;
    init(params) {
      this.filterParams = params;
      this.filterValue = null;
      this.eGui = document.createElement("div");
      this.eGui.innerHTML = '<div>Greater Than: <input type="text"/></div>';
      this.eInput = this.eGui.querySelector("input");
      this.eInput.addEventListener("input", () => {
        this.getValueFromInput();
        params.filterChangedCallback();
      });
    }
    getGui() {
      return this.eGui;
    }
    getValueFromInput() {
      const value = parseInt(this.eInput.value);
      this.filterValue = isNaN(value) ? null : value;
    }
    setModel(model) {
      this.eInput.value = model == null ? null : model.value;
      this.getValueFromInput();
    }
    getModel() {
      if (!this.isFilterActive()) {
        return null;
      }
      return { value: this.eInput.value };
    }
    isFilterActive() {
      return this.filterValue !== null;
    }
    doesFilterPass(params) {
      filterCallCount++;
      const { node } = params;
      const value = this.filterParams.getValue(node);
      return value > (this.filterValue || 0);
    }
  }
  return MyFilter;
};

const myFilter = getMyFilter();

const timeOperation = (name, operation) => {
  aggCallCount = 0;
  compareCallCount = 0;
  filterCallCount = 0;
  const start = new Date().getTime();
  operation();
  const end = new Date().getTime();
  console.log(
    name +
      " finished in " +
      (end - start) +
      "ms, aggCallCount = " +
      aggCallCount +
      ", compareCallCount = " +
      compareCallCount +
      ", filterCallCount = " +
      filterCallCount,
  );
};

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "city", rowGroup: true, hide: true },
    { field: "laptop", rowGroup: true, hide: true },
    { field: "distro", sort: "asc", comparator: myComparator },
    {
      field: "value",
      enableCellChangeFlash: true,
      aggFunc: myAggFunc,
      filter: myFilter,
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      filter: true,
    };
  }, []);
  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
      groupSelects: "descendants",
      headerCheckbox: false,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      field: "name",
    };
  }, []);

  const onGridReady = useCallback((params) => {
    params.api.setFilterModel({
      value: { value: "50" },
    });
    timeOperation("Initialisation", () => {
      params.api.setGridOption("rowData", getData());
    });
  }, []);

  const onBtDuplicate = useCallback(() => {
    // get the first child of the
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      console.log("No rows selected!");
      return;
    }
    const newItems = [];
    selectedRows.forEach((selectedRow) => {
      const newItem = createDataItem(
        selectedRow.name,
        selectedRow.distro,
        selectedRow.laptop,
        selectedRow.city,
        selectedRow.value,
      );
      newItems.push(newItem);
    });
    timeOperation("Duplicate", () => {
      gridRef.current.api.applyTransaction({ add: newItems });
    });
  }, [createDataItem]);

  const onBtUpdate = useCallback(() => {
    // get the first child of the
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      console.log("No rows selected!");
      return;
    }
    const updatedItems = [];
    selectedRows.forEach((oldItem) => {
      const newValue = Math.floor(Math.random() * 100) + 10;
      const newItem = createDataItem(
        oldItem.name,
        oldItem.distro,
        oldItem.laptop,
        oldItem.city,
        newValue,
        oldItem.id,
      );
      updatedItems.push(newItem);
    });
    timeOperation("Update", () => {
      gridRef.current.api.applyTransaction({ update: updatedItems });
    });
  }, [createDataItem]);

  const onBtDelete = useCallback(() => {
    // get the first child of the
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      console.log("No rows selected!");
      return;
    }
    timeOperation("Delete", () => {
      gridRef.current.api.applyTransaction({ remove: selectedRows });
    });
  }, []);

  const onBtClearSelection = useCallback(() => {
    gridRef.current.api.deselectAll();
  }, []);

  const getRowId = useCallback((params) => {
    return String(params.data.id);
  }, []);

  const isGroupOpenByDefault = useCallback((params) => {
    return ["Delhi", "Seoul"].includes(params.key);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          <button onClick={onBtUpdate}>Update</button>
          <button onClick={onBtDuplicate}>Duplicate</button>
          <button onClick={onBtDelete}>Delete</button>
          <button onClick={onBtClearSelection}>Clear Selection</button>
        </div>

        <div style={gridStyle} className="test-grid">
          <AgGridReact
            ref={gridRef}
            getRowId={getRowId}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowSelection={rowSelection}
            autoGroupColumnDef={autoGroupColumnDef}
            isGroupOpenByDefault={isGroupOpenByDefault}
            onGridReady={onGridReady}
          />
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

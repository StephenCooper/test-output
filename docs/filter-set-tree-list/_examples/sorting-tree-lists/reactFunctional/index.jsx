"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
  TreeDataModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TreeDataModule,
  ValidationModule /* Development Only */,
]);

const arrayComparator = (a, b) => {
  if (a == null) {
    return b == null ? 0 : -1;
  } else if (b == null) {
    return 1;
  }
  for (let i = 0; i < a.length; i++) {
    if (i >= b.length) {
      return 1;
    }
    const comparisonValue = reverseOrderComparator(a[i], b[i]);
    if (comparisonValue !== 0) {
      return comparisonValue;
    }
  }
  return 0;
};

const reverseOrderComparator = (a, b) => {
  return a < b ? 1 : a > b ? -1 : 0;
};

function processData(data) {
  const flattenedData = [];
  const flattenRowRecursive = (row, parentPath) => {
    const dateParts = row.startDate.split("/");
    const startDate = new Date(
      parseInt(dateParts[2]),
      dateParts[1] - 1,
      dateParts[0],
    );
    const dataPath = [...parentPath, row.employeeName];
    flattenedData.push({ ...row, dataPath, startDate });
    if (row.underlings) {
      row.underlings.forEach((underling) =>
        flattenRowRecursive(underling, dataPath),
      );
    }
  };
  data.forEach((row) => flattenRowRecursive(row, []));
  return flattenedData;
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: "employmentType" },
    {
      field: "startDate",
      valueFormatter: (params) =>
        params.value ? params.value.toLocaleDateString() : params.value,
      filterParams: {
        treeList: true,
        comparator: reverseOrderComparator,
      },
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 200,
      filter: true,
      floatingFilter: true,
      cellDataType: false,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      headerName: "Employee",
      field: "employeeName",
      cellRendererParams: {
        suppressCount: true,
      },
      filter: "agSetColumnFilter",
      filterParams: {
        treeList: true,
        keyCreator: (params) => (params.value ? params.value.join("#") : null),
        comparator: arrayComparator,
      },
      minWidth: 280,
    };
  }, []);
  const getDataPath = useCallback((data) => {
    return data.dataPath;
  }, []);
  const getRowId = useCallback((params) => String(params.data.employeeId), []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/tree-data.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(processData(data)));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          treeData={true}
          groupDefaultExpanded={-1}
          getDataPath={getDataPath}
          getRowId={getRowId}
          onGridReady={onGridReady}
        />
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

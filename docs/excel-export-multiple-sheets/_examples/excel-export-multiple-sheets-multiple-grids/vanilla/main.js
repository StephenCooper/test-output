class SportRenderer {
  eGui;

  init(params) {
    this.eGui = document.createElement("i");

    this.eGui.addEventListener("click", () => {
      params.api.applyTransaction({ remove: [params.node.data] });
    });

    this.eGui.classList.add("far", "fa-trash-alt");
    this.eGui.style.cursor = "pointer";
  }

  getGui() {
    return this.eGui;
  }

  refresh(params) {
    return false;
  }
}

const leftColumnDefs = [
  {
    rowDrag: true,
    maxWidth: 50,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    rowDragText: (params, dragItemCount) => {
      if (dragItemCount > 1) {
        return dragItemCount + " athletes";
      }
      return params.rowNode.data.athlete;
    },
  },
  { field: "athlete" },
  { field: "sport" },
];

const rightColumnDefs = [
  {
    rowDrag: true,
    maxWidth: 50,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    rowDragText: (params, dragItemCount) => {
      if (dragItemCount > 1) {
        return dragItemCount + " athletes";
      }
      return params.rowNode.data.athlete;
    },
  },
  { field: "athlete" },
  { field: "sport" },
  {
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    maxWidth: 50,
    cellRenderer: SportRenderer,
  },
];

let leftApi;
const leftGridOptions = {
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    filter: true,
  },
  rowSelection: { mode: "multiRow" },
  rowDragMultiRow: true,
  getRowId: (params) => {
    return params.data.athlete;
  },
  rowDragManaged: true,
  suppressMoveWhenRowDragging: true,
  columnDefs: leftColumnDefs,
  onGridReady: (params) => {
    addGridDropZone(params);
  },
};
let rightApi;
const rightGridOptions = {
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    filter: true,
  },
  getRowId: (params) => {
    return params.data.athlete;
  },
  rowDragManaged: true,
  columnDefs: rightColumnDefs,
};

function addGridDropZone(params) {
  const dropZoneParams = rightApi.getRowDropZoneParams({
    onDragStop: (params) => {
      const nodes = params.nodes;

      leftApi.applyTransaction({
        remove: nodes.map(function (node) {
          return node.data;
        }),
      });
    },
  });

  params.api.addRowDropZone(dropZoneParams);
}

function loadGrid(options, oldApi, side, data) {
  const grid = document.querySelector("#e" + side + "Grid");

  oldApi?.destroy();
  options.rowData = data;
  return agGrid.createGrid(grid, options);
}

function loadGrids() {
  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then(function (data) {
      const athletes = [];
      let i = 0;

      while (athletes.length < 20 && i < data.length) {
        const pos = i++;
        if (
          athletes.some(function (rec) {
            return rec.athlete === data[pos].athlete;
          })
        ) {
          continue;
        }
        athletes.push(data[pos]);
      }

      leftApi = loadGrid(
        leftGridOptions,
        leftApi,
        "Left",
        athletes.slice(0, athletes.length / 2),
      );
      rightApi = loadGrid(
        rightGridOptions,
        rightApi,
        "Right",
        athletes.slice(athletes.length / 2),
      );
    });
}

function onExcelExport() {
  const spreadsheets = [];

  spreadsheets.push(
    leftApi.getSheetDataForExcel({ sheetName: "Athletes" }),
    rightApi.getSheetDataForExcel({ sheetName: "Selected Athletes" }),
  );

  // could be leftGridOptions or rightGridOptions
  leftApi.exportMultipleSheetsAsExcel({
    data: spreadsheets,
    fileName: "ag-grid.xlsx",
  });
}

const resetBtn = document.querySelector("button.reset");
const exportBtn = document.querySelector("button.excel");

resetBtn.addEventListener("click", () => {
  loadGrids();
});

exportBtn.addEventListener("click", () => {
  onExcelExport();
});

loadGrids();

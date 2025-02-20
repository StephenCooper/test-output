class FileCellRenderer {
  eGui;

  init(params) {
    const tempDiv = document.createElement("div");
    const value = params.value;
    const icon = this.getFileIcon(params.value);
    tempDiv.innerHTML = icon
      ? '<i class="' +
        icon +
        '"/>' +
        '<span class="filename">' +
        value +
        "</span>"
      : value;
    this.eGui = tempDiv.firstChild;
  }
  getGui() {
    return this.eGui;
  }

  getFileIcon(filename) {
    return filename.endsWith(".mp3") || filename.endsWith(".wav")
      ? "far fa-file-audio"
      : filename.endsWith(".xls")
        ? "far fa-file-excel"
        : filename.endsWith(".txt")
          ? "far fa-file"
          : filename.endsWith(".pdf")
            ? "far fa-file-pdf"
            : "far fa-folder";
  }
}

const valueFormatter = function (params) {
  return params.value ? params.value + " MB" : "";
};

let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "dateModified" },
    {
      field: "size",
      valueFormatter: valueFormatter,
    },
  ],
  defaultColDef: {
    flex: 1,
  },
  rowData: getData(),
  treeData: true,
  groupDefaultExpanded: -1,
  getDataPath: (data) => {
    return data.filePath;
  },
  getRowId: (params) => {
    return String(params.data.id);
  },
  autoGroupColumnDef: {
    rowDrag: true,
    headerName: "Files",
    minWidth: 300,
    cellRendererParams: {
      suppressCount: true,
      innerRenderer: FileCellRenderer,
    },
  },
  onRowDragEnd: onRowDragEnd,
};

function onRowDragEnd(event) {
  // this is the row the mouse is hovering over
  const overNode = event.overNode;
  if (!overNode) {
    return;
  }

  // folder to drop into is where we are going to move the file/folder to
  const folderToDropInto =
    overNode.data.type === "folder"
      ? // if over a folder, we take the immediate row
        overNode
      : // if over a file, we take the parent row (which will be a folder)
        overNode.parent;

  // the data we want to move
  const movingData = event.node.data;

  // take new parent path from parent, if data is missing, means it's the root node,
  // which has no data.
  const newParentPath = folderToDropInto.data
    ? folderToDropInto.data.filePath
    : [];
  const needToChangeParent = !arePathsEqual(newParentPath, movingData.filePath);

  // check we are not moving a folder into a child folder
  const invalidMode = isSelectionParentOfTarget(event.node, folderToDropInto);
  if (invalidMode) {
    console.log("invalid move");
  }

  if (needToChangeParent && !invalidMode) {
    const updatedRows = [];
    moveToPath(newParentPath, event.node, updatedRows);

    gridApi.applyTransaction({
      update: updatedRows,
    });

    gridApi.clearFocusedCell();
  }
}

// this updates the filePath locations in our data, we update the data
// before we send it to AG Grid
function moveToPath(newParentPath, node, allUpdatedNodes) {
  // last part of the file path is the file name
  const oldPath = node.data.filePath;
  const fileName = oldPath[oldPath.length - 1];
  const newChildPath = newParentPath.slice();
  newChildPath.push(fileName);

  node.data.filePath = newChildPath;

  allUpdatedNodes.push(node.data);

  if (node.childrenAfterGroup) {
    node.childrenAfterGroup.forEach((childNode) => {
      moveToPath(newChildPath, childNode, allUpdatedNodes);
    });
  }
}

function isSelectionParentOfTarget(selectedNode, targetNode) {
  const children = [...(selectedNode.childrenAfterGroup || [])];

  if (!targetNode) {
    return false;
  }

  while (children.length) {
    const node = children.shift();
    if (!node) {
      continue;
    }

    if (node.key === targetNode.key) {
      return true;
    }

    if (node.childrenAfterGroup && node.childrenAfterGroup.length) {
      children.push(...node.childrenAfterGroup);
    }
  }

  return false;
}

function arePathsEqual(path1, path2) {
  if (path1.length !== path2.length) {
    return false;
  }

  let equal = true;
  path1.forEach(function (item, index) {
    if (path2[index] !== item) {
      equal = false;
    }
  });

  return equal;
}

// wait for the document to be loaded, otherwise
// AG Grid will not find the div in the document.
document.addEventListener("DOMContentLoaded", function () {
  // lookup the container we want the Grid to use
  const eGridDiv = document.querySelector("#myGrid");

  // create the grid passing in the div to use together with the columns & data we want to use
  gridApi = agGrid.createGrid(eGridDiv, gridOptions);
});

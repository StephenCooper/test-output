import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import {
  CellClassParams,
  CellStyleModule,
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetDataPath,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  IRowNode,
  ModuleRegistry,
  RefreshCellsParams,
  RenderApiModule,
  RowDragEndEvent,
  RowDragLeaveEvent,
  RowDragModule,
  RowDragMoveEvent,
  ValidationModule,
  ValueFormatterParams,
} from "ag-grid-community";
import { TreeDataModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  RowDragModule,
  ClientSideRowModelApiModule,
  RenderApiModule,
  CellStyleModule,
  ClientSideRowModelModule,
  TreeDataModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowData]="rowData"
    [treeData]="true"
    [groupDefaultExpanded]="groupDefaultExpanded"
    [getDataPath]="getDataPath"
    [getRowId]="getRowId"
    [autoGroupColumnDef]="autoGroupColumnDef"
    (rowDragMove)="onRowDragMove($event)"
    (rowDragLeave)="onRowDragLeave($event)"
    (rowDragEnd)="onRowDragEnd($event)"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    {
      field: "dateModified",
      cellClassRules: cellClassRules,
    },
    {
      field: "size",
      valueFormatter: valueFormatter,
      cellClassRules: cellClassRules,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
  };
  rowData: any[] | null = getData();
  groupDefaultExpanded = -1;
  getDataPath: GetDataPath = (data: any) => {
    return data.filePath;
  };
  getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    return String(params.data.id);
  };
  autoGroupColumnDef: ColDef = {
    rowDrag: true,
    headerName: "Files",
    minWidth: 300,
    cellRendererParams: {
      suppressCount: true,
      innerRenderer: FileCellRenderer,
    },
    cellClassRules: {
      "hover-over": (params) => {
        return params.node === potentialParent;
      },
    },
  };

  onRowDragMove(event: RowDragMoveEvent) {
    setPotentialParentForNode(event.api, event.overNode);
  }

  onRowDragLeave(event: RowDragLeaveEvent) {
    // clear node to highlight
    setPotentialParentForNode(event.api, null);
  }

  onRowDragEnd(event: RowDragEndEvent) {
    if (!potentialParent) {
      return;
    }
    const movingData = event.node.data;
    // take new parent path from parent, if data is missing, means it's the root node,
    // which has no data.
    const newParentPath = potentialParent.data
      ? potentialParent.data.filePath
      : [];
    const needToChangeParent = !arePathsEqual(
      newParentPath,
      movingData.filePath,
    );
    // check we are not moving a folder into a child folder
    const invalidMode = isSelectionParentOfTarget(event.node, potentialParent);
    if (invalidMode) {
      console.log("invalid move");
    }
    if (needToChangeParent && !invalidMode) {
      const updatedRows: any[] = [];
      moveToPath(newParentPath, event.node, updatedRows);
      this.gridApi.applyTransaction({
        update: updatedRows,
      });
      this.gridApi.clearFocusedCell();
    }
    // clear node to highlight
    setPotentialParentForNode(event.api, null);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

class FileCellRenderer {
  private eGui!: any;

  init(params: ICellRendererParams) {
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
    this.eGui = tempDiv.firstChild!;
  }
  getGui() {
    return this.eGui;
  }

  getFileIcon(filename: string) {
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

const valueFormatter = function (params: ValueFormatterParams) {
  return params.value ? params.value + " MB" : "";
};
const cellClassRules = {
  "hover-over": (params: CellClassParams) => {
    return params.node === potentialParent;
  },
};
var potentialParent: any = null;
function moveToPath(
  newParentPath: string[],
  node: IRowNode,
  allUpdatedNodes: any[],
) {
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
function isSelectionParentOfTarget(selectedNode: IRowNode, targetNode: any) {
  const children = selectedNode.childrenAfterGroup || [];
  for (let i = 0; i < children.length; i++) {
    if (targetNode && children[i].key === targetNode.key) return true;
    isSelectionParentOfTarget(children[i], targetNode);
  }
  return false;
}
function arePathsEqual(path1: string[], path2: string[]) {
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
function setPotentialParentForNode(
  api: GridApi,
  overNode: IRowNode | undefined | null,
) {
  let newPotentialParent;
  if (overNode) {
    newPotentialParent =
      overNode.data.type === "folder"
        ? // if over a folder, we take the immediate row
          overNode
        : // if over a file, we take the parent row (which will be a folder)
          overNode.parent;
  } else {
    newPotentialParent = null;
  }
  const alreadySelected = potentialParent === newPotentialParent;
  if (alreadySelected) {
    return;
  }
  // we refresh the previous selection (if it exists) to clear
  // the highlighted and then the new selection.
  const rowsToRefresh = [];
  if (potentialParent) {
    rowsToRefresh.push(potentialParent);
  }
  if (newPotentialParent) {
    rowsToRefresh.push(newPotentialParent);
  }
  potentialParent = newPotentialParent;
  refreshRows(api, rowsToRefresh);
}
function refreshRows(api: GridApi, rowsToRefresh: IRowNode[]) {
  const params: RefreshCellsParams = {
    // refresh these rows only.
    rowNodes: rowsToRefresh,
    // because the grid does change detection, the refresh
    // will not happen because the underlying value has not
    // changed. to get around this, we force the refresh,
    // which skips change detection.
    force: true,
  };
  api.refreshCells(params);
}

import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import {
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
  RowDragEndEvent,
  RowDragModule,
  ValidationModule,
  ValueFormatterParams,
} from "ag-grid-community";
import { TreeDataModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  RowDragModule,
  ClientSideRowModelApiModule,
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
    (rowDragEnd)="onRowDragEnd($event)"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "dateModified" },
    {
      field: "size",
      valueFormatter: valueFormatter,
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
  };

  onRowDragEnd(event: RowDragEndEvent) {
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
    const newParentPath = folderToDropInto!.data
      ? folderToDropInto!.data.filePath
      : [];
    const needToChangeParent = !arePathsEqual(
      newParentPath,
      movingData.filePath,
    );
    // check we are not moving a folder into a child folder
    const invalidMode = isSelectionParentOfTarget(event.node, folderToDropInto);
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
// this updates the filePath locations in our data, we update the data
// before we send it to AG Grid
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
function isSelectionParentOfTarget(
  selectedNode: IRowNode,
  targetNode: IRowNode | null,
) {
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

import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetDataPath,
  GridApi,
  GridOptions,
  GridReadyEvent,
  GroupSelectionMode,
  ModuleRegistry,
  QuickFilterModule,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  TreeDataModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  RowSelectionModule,
  QuickFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  TreeDataModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div class="example-header">
      <label>
        <span>Group selects:</span>
        <select
          id="input-group-selection-mode"
          (change)="onSelectionModeChange()"
        >
          <option value="self">self</option>
          <option value="descendants">descendants</option>
          <option value="filteredDescendants">filteredDescendants</option>
        </select>
      </label>

      <label>
        <span>Quick Filter:</span>
        <input
          type="text"
          id="input-quick-filter"
          (input)="onQuickFilterChanged()"
        />
      </label>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [rowSelection]="rowSelection"
      [groupDefaultExpanded]="groupDefaultExpanded"
      [suppressAggFuncInHeader]="true"
      [rowData]="rowData"
      [treeData]="true"
      [getDataPath]="getDataPath"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "created" },
    { field: "modified" },
    {
      field: "size",
      aggFunc: "sum",
      valueFormatter: (params) => {
        const sizeInKb = params.value / 1024;
        if (sizeInKb > 1024) {
          return `${+(sizeInKb / 1024).toFixed(2)} MB`;
        } else {
          return `${+sizeInKb.toFixed(2)} KB`;
        }
      },
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
  };
  autoGroupColumnDef: ColDef = {
    headerName: "File Explorer",
    minWidth: 280,
    cellRenderer: "agGroupCellRenderer",
    cellRendererParams: {
      suppressCount: true,
    },
  };
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
    groupSelects: "self",
  };
  groupDefaultExpanded = -1;
  rowData: any[] | null = getData();
  getDataPath: GetDataPath = (data) => data.path;

  onSelectionModeChange() {
    this.gridApi.setGridOption("rowSelection", {
      mode: "multiRow",
      groupSelects: getGroupSelectsValue(),
    });
  }

  onQuickFilterChanged() {
    this.gridApi.setGridOption(
      "quickFilterText",
      document.querySelector<HTMLInputElement>("#input-quick-filter")?.value,
    );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

function getGroupSelectsValue(): GroupSelectionMode {
  return (
    (document.querySelector<HTMLSelectElement>("#input-group-selection-mode")
      ?.value as any) ?? "self"
  );
}

import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IsFullWidthRowParams,
  ModuleRegistry,
  SuppressKeyboardEventParams,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import FullWidthCellRenderer from "./fullWidthCellRendererVue";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const GRID_CELL_CLASSNAME = "ag-full-width-row";

function getAllFocusableElementsOf(el: HTMLElement) {
  return Array.from<HTMLElement>(
    el.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((focusableEl) => {
    return focusableEl.tabIndex !== -1;
  });
}

function getEventPath(event: Event): HTMLElement[] {
  const path: HTMLElement[] = [];
  let currentTarget: any = event.target;
  while (currentTarget) {
    path.push(currentTarget);
    currentTarget = currentTarget.parentElement;
  }
  return path;
}

/**
 * Capture whether the user is tabbing forwards or backwards and suppress keyboard event if tabbing
 * outside of the children
 */
function suppressKeyboardEvent({ event }: SuppressKeyboardEventParams<any>) {
  const { key, shiftKey } = event;
  const path = getEventPath(event);
  const isTabForward = key === "Tab" && shiftKey === false;
  const isTabBackward = key === "Tab" && shiftKey === true;
  let suppressEvent = false;
  // Handle cell children tabbing
  if (isTabForward || isTabBackward) {
    const eGridCell = path.find((el) => {
      if (el.classList === undefined) return false;
      return el.classList.contains(GRID_CELL_CLASSNAME);
    });
    if (!eGridCell) {
      return suppressEvent;
    }
    const focusableChildrenElements = getAllFocusableElementsOf(eGridCell);
    const lastCellChildEl =
      focusableChildrenElements[focusableChildrenElements.length - 1];
    const firstCellChildEl = focusableChildrenElements[0];
    // Suppress keyboard event if tabbing forward within the cell and the current focused element is not the last child
    if (isTabForward && focusableChildrenElements.length > 0) {
      const isLastChildFocused =
        lastCellChildEl && document.activeElement === lastCellChildEl;
      if (!isLastChildFocused) {
        suppressEvent = true;
      }
    }
    // Suppress keyboard event if tabbing backwards within the cell, and the current focused element is not the first child
    else if (isTabBackward && focusableChildrenElements.length > 0) {
      const cellHasFocusedChildren =
        eGridCell.contains(document.activeElement) &&
        eGridCell !== document.activeElement;
      // Manually set focus to the last child element if cell doesn't have focused children
      if (!cellHasFocusedChildren) {
        lastCellChildEl.focus();
        // Cancel keyboard press, so that it doesn't focus on the last child and then pass through the keyboard press to
        // move to the 2nd last child element
        event.preventDefault();
      }
      const isFirstChildFocused =
        firstCellChildEl && document.activeElement === firstCellChildEl;
      if (!isFirstChildFocused) {
        suppressEvent = true;
      }
    }
  }
  return suppressEvent;
}

function isFullWidth(data: any) {
  // return true when country is Peru, France or Italy
  return ["Peru", "France", "Italy"].includes(data.name);
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rowData"
      :isFullWidthRow="isFullWidthRow"
      :fullWidthCellRenderer="fullWidthCellRenderer"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    FullWidthCellRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "name" },
      { field: "continent" },
      { field: "language" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      filter: true,
      suppressKeyboardEvent,
    });
    const rowData = ref<any[] | null>(getData());
    const isFullWidthRow = ref<(params: IsFullWidthRowParams) => boolean>(
      (params: IsFullWidthRowParams) => {
        return isFullWidth(params.rowNode.data);
      },
    );
    const fullWidthCellRenderer = ref<any>("FullWidthCellRenderer");

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      isFullWidthRow,
      fullWidthCellRenderer,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");

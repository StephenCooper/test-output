import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  ModuleRegistry,
  NumberEditorModule,
  QuickFilterModule,
  RowApiModule,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  RowApiModule,
  QuickFilterModule,
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const getMedalString = function ({
  gold,
  silver,
  bronze,
}: {
  gold: number;
  silver: number;
  bronze: number;
}) {
  const goldStr = gold > 0 ? `Gold: ${gold} ` : "";
  const silverStr = silver > 0 ? `Silver: ${silver} ` : "";
  const bronzeStr = bronze > 0 ? `Bronze: ${bronze}` : "";
  return goldStr + silverStr + bronzeStr;
};

const MedalRenderer = function (params: ICellRendererParams) {
  return getMedalString(params.value);
};

let includeHiddenColumns = false;

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header">
        <input type="text" id="filter-text-box" placeholder="Filter..." v-on:input="onFilterTextBoxChanged()">
          <button style="margin-left: 20px" v-on:click="onPrintQuickFilterTexts()">Print Quick Filter Cache Texts</button>
          <button id="includeHiddenColumns" style="margin-left: 20px" v-on:click="onIncludeHiddenColumnsToggled()">
            Include Hidden Columns
          </button>
        </div>
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :rowData="rowData"
          :cacheQuickFilter="true"
          :quickFilterParser="quickFilterParser"
          :quickFilterMatcher="quickFilterMatcher"></ag-grid-vue>
        </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      // simple column, easy to understand
      { field: "name" },
      // the grid works with embedded fields
      { headerName: "Age", field: "person.age" },
      // or use value getter, all works with quick filter
      { headerName: "Country", valueGetter: "data.person.country" },
      // or use the object value, so value passed around is an object
      {
        headerName: "Results",
        field: "medals",
        cellRenderer: MedalRenderer,
        // this is needed to avoid toString=[object,object] result with objects
        getQuickFilterText: (params) => {
          return getMedalString(params.value);
        },
        cellDataType: false,
      },
      {
        headerName: "Hidden",
        field: "hidden",
        hide: true,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      editable: true,
    });
    const rowData = ref<any[] | null>(getData());

    function onIncludeHiddenColumnsToggled() {
      includeHiddenColumns = !includeHiddenColumns;
      gridApi.value!.setGridOption(
        "includeHiddenColumnsInQuickFilter",
        includeHiddenColumns,
      );
      document.querySelector("#includeHiddenColumns")!.textContent =
        `${includeHiddenColumns ? "Exclude" : "Include"} Hidden Columns`;
    }
    function onFilterTextBoxChanged() {
      gridApi.value!.setGridOption(
        "quickFilterText",
        (document.getElementById("filter-text-box") as HTMLInputElement).value,
      );
    }
    function onPrintQuickFilterTexts() {
      gridApi.value!.forEachNode(function (rowNode, index) {
        console.log(
          "Row " +
            index +
            " quick filter text is " +
            rowNode.quickFilterAggregateText,
        );
      });
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };
    function quickFilterParser(quickFilter: string) {
      const quickFilterParts = [];
      let lastSpaceIndex = -1;
      const isQuote = (index: number) => quickFilter[index] === '"';
      const getQuickFilterPart = (
        lastSpaceIndex: number,
        currentIndex: number,
      ) => {
        const startsWithQuote = isQuote(lastSpaceIndex + 1);
        const endsWithQuote = isQuote(currentIndex - 1);
        const startIndex =
          startsWithQuote && endsWithQuote
            ? lastSpaceIndex + 2
            : lastSpaceIndex + 1;
        const endIndex =
          startsWithQuote && endsWithQuote ? currentIndex - 1 : currentIndex;
        return quickFilter.slice(startIndex, endIndex);
      };
      for (let i = 0; i < quickFilter.length; i++) {
        const char = quickFilter[i];
        if (char === " ") {
          if (!isQuote(lastSpaceIndex + 1) || isQuote(i - 1)) {
            quickFilterParts.push(getQuickFilterPart(lastSpaceIndex, i));
            lastSpaceIndex = i;
          }
        }
      }
      if (lastSpaceIndex !== quickFilter.length - 1) {
        quickFilterParts.push(
          getQuickFilterPart(lastSpaceIndex, quickFilter.length),
        );
      }
      return quickFilterParts;
    }
    function quickFilterMatcher(
      quickFilterParts: string[],
      rowQuickFilterAggregateText: string,
    ) {
      let result: boolean;
      try {
        result = quickFilterParts.every((part) =>
          rowQuickFilterAggregateText.match(part),
        );
      } catch {
        result = false;
      }
      return result;
    }

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      quickFilterParser,
      quickFilterMatcher,
      onGridReady,
      onIncludeHiddenColumnsToggled,
      onFilterTextBoxChanged,
      onPrintQuickFilterTexts,
    };
  },
});

createApp(VueExample).mount("#app");

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
  ExcelExportParams,
  ExcelHeaderFooterConfig,
  ExcelHeaderFooterContent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const getValues = (type: string) => {
  const value = (
    document.querySelector("#" + type + "Value") as HTMLInputElement
  ).value;
  if (value == null) {
    return;
  }
  const obj: ExcelHeaderFooterContent = {
    value: value,
  };
  obj.position = (
    document.querySelector("#" + type + "Position") as HTMLInputElement
  ).value as "Left" | "Center" | "Right";
  const fontName = (
    document.querySelector("#" + type + "FontName") as HTMLInputElement
  ).value;
  const fontSize = (
    document.querySelector("#" + type + "FontSize") as HTMLInputElement
  ).value;
  const fontWeight = (
    document.querySelector("#" + type + "FontWeight") as HTMLInputElement
  ).value;
  const underline = (
    document.querySelector("#" + type + "Underline") as HTMLInputElement
  ).checked;
  if (
    fontName !== "Calibri" ||
    fontSize != "11" ||
    fontWeight !== "Regular" ||
    underline
  ) {
    obj.font = {};
    if (fontName !== "Calibri") {
      obj.font.fontName = fontName;
    }
    if (fontSize != "11") {
      obj.font.size = Number.parseInt(fontSize);
    }
    if (fontWeight !== "Regular") {
      if (fontWeight.indexOf("Bold") !== -1) {
        obj.font.bold = true;
      }
      if (fontWeight.indexOf("Italic") !== -1) {
        obj.font.italic = true;
      }
    }
    if (underline) {
      obj.font.underline = "Single";
    }
  }
  return obj;
};

const getParams: () => ExcelExportParams | undefined = () => {
  const header = getValues("header");
  const footer = getValues("footer");
  if (!header && !footer) {
    return undefined;
  }
  const obj: ExcelExportParams = {
    headerFooterConfig: {
      all: {},
    },
  };
  if (header) {
    obj.headerFooterConfig!.all!.header = [header];
  }
  if (footer) {
    obj.headerFooterConfig!.all!.footer = [footer];
  }
  return obj;
};

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="container">
      <div class="columns">
        <fieldset class="column">
          <legend>Header</legend>
          <div class="row">
            Position
            <select id="headerPosition">
              <option>Left</option>
              <option>Center</option>
              <option>Right</option>
            </select>
          </div>
          <div class="row">
            Font
            <select id="headerFontName">
              <option>Calibri</option>
              <option>Arial</option>
            </select>
            <select id="headerFontSize">
              <option>11</option>
              <option>12</option>
              <option>13</option>
              <option>14</option>
              <option>16</option>
              <option>20</option>
            </select>
            <select id="headerFontWeight">
              <option>Regular</option>
              <option>Bold</option>
              <option>Italic</option>
              <option>Bold Italic</option>
            </select>
            <label class="option underline" for="headerUnderline">
              <input type="checkbox" id="headerUnderline"><u>U</u>
            </label>
          </div>
          <div class="row option">
            Value
            <input id="headerValue">
            </div>
          </fieldset>
          <fieldset class="column">
            <legend>Footer</legend>
            <div class="row">
              Position
              <select id="footerPosition">
                <option>Left</option>
                <option>Center</option>
                <option>Right</option>
              </select>
            </div>
            <div class="row">
              Font
              <select id="footerFontName">
                <option>Calibri</option>
                <option>Arial</option>
              </select>
              <select id="footerFontSize">
                <option>11</option>
                <option>12</option>
                <option>13</option>
                <option>14</option>
                <option>16</option>
                <option>20</option>
              </select>
              <select id="footerFontWeight">
                <option>Regular</option>
                <option>Bold</option>
                <option>Italic</option>
                <option>Bold Italic</option>
              </select>
              <label class="option underline" for="footerUnderline">
                <input type="checkbox" id="footerUnderline"><u>U</u>
              </label>
            </div>
            <div class="row">
              Value
              <input id="footerValue">
              </div>
            </fieldset>
          </div>
          <div>
            <button v-on:click="onBtExport()" style="margin: 5px 0px; font-weight: bold">Export to Excel</button>
          </div>
          <div class="grid-wrapper">
            <ag-grid-vue
              style="width: 100%; height: 100%;"
              @grid-ready="onGridReady"
              :columnDefs="columnDefs"
              :defaultColDef="defaultColDef"
              :popupParent="popupParent"
              :rowData="rowData"></ag-grid-vue>
            </div>
          </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", minWidth: 200 },
      { field: "country", minWidth: 200 },
      { field: "sport", minWidth: 150 },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ]);
    const defaultColDef = ref<ColDef>({
      filter: true,
      minWidth: 100,
      flex: 1,
    });
    const popupParent = ref<HTMLElement | null>(document.body);
    const rowData = ref<IOlympicData[]>(null);

    function onBtExport() {
      gridApi.value!.exportDataAsExcel(getParams());
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) =>
        (rowData.value = data.filter((rec: any) => rec.country != null));

      fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      popupParent,
      rowData,
      onGridReady,
      onBtExport,
    };
  },
});

createApp(VueExample).mount("#app");

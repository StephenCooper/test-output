import { createApp, defineComponent, ref } from "vue";

import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridVue } from "ag-grid-vue3";

ModuleRegistry.registerModules([AllCommunityModule]);

// Row Data Interface
interface IRow {
  make: string;
  model: string;
  price: number;
  electric: boolean;
}

// Define the component configuration
const App = defineComponent({
  name: "App",
  template: `
    <ag-grid-vue
        style="width: 100%; height: 100%"
        :columnDefs="colDefs"
        :rowData="rowData"
    >
    </ag-grid-vue>
    `,
  components: {
    AgGridVue,
  },
  setup() {
    const rowData = ref<IRow[]>([
      { make: "Tesla", model: "Model Y", price: 64950, electric: true },
      { make: "Ford", model: "F-Series", price: 33850, electric: false },
      { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    ]);

    const colDefs = ref<ColDef<IRow>[]>([
      { field: "make" },
      { field: "model" },
      { field: "price" },
      { field: "electric" },
    ]);

    return {
      rowData,
      colDefs,
    };
  },
});

createApp(App).mount("#app");

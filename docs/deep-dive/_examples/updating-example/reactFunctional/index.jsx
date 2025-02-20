'use client';
// React Grid Logic
import React, { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
// Core CSS
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([AllCommunityModule]);

// Create new GridExample component
const GridExample = () => {
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState([]);

  // Column Definitions: Defines & controls grid columns.
  const [colDefs] = useState([
    { field: "mission" },
    { field: "company" },
    { field: "location" },
    { field: "date" },
    { field: "price" },
    { field: "successful" },
    { field: "rocket" },
  ]);

  // Fetch data & update rowData state
  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/space-mission-data.json") // Fetch data from server
      .then((result) => result.json()) // Convert to JSON
      .then((rowData) => setRowData(rowData)); // Update state of `rowData`
  }, []);

  // Container: Defines the grid's theme & dimensions.
  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* The AG Grid component, with Row Data & Column Definition props */}
      <AgGridReact rowData={rowData} columnDefs={colDefs} />
    </div>
  );
};

// Render GridExample
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);

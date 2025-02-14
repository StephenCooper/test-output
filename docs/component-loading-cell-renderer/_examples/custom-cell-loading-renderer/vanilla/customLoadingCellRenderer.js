class CustomLoadingCellRenderer {
    eGui;

    init() {
        this.eGui = document.createElement('img');
        this.eGui.src = 'https://www.ag-grid.com/example-assets/loading.gif';
    }

    getGui() {
        return this.eGui;
    }
}

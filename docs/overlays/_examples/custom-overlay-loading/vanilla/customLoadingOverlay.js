


class CustomLoadingOverlay  {
    eGui;

    init(params) {
        this.eGui = document.createElement('div');
        this.refresh(params);
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        this.eGui.innerHTML = `<div class="ag-overlay-loading-center" role="presentation">
        <div role="presentation" style="height:100px; width:100px; background: url(https://www.ag-grid.com/images/ag-grid-loading-spinner.svg) center / contain no-repeat; margin: 0 auto;"></div>
        <div aria-live="polite" aria-atomic="true">${params.loadingMessage}</div>
     </div>`;
    }
}

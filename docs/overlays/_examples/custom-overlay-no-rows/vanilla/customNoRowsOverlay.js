


class CustomNoRowsOverlay  {
    eGui;

    init(params) {
        this.eGui = document.createElement('div');
        this.refresh(params);
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        this.eGui.innerHTML = `
            <div role="presentation" class="ag-overlay-loading-center" style="background-color: #b4bebe;">
                <i class="far fa-frown" aria-live="polite" aria-atomic="true"> ${params.noRowsMessageFunc()} </i>
            </div>
        `;
    }
}

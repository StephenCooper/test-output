
class FullWidthCellRenderer  {
    eGui;
     cssClass;
     message;

    init(params) {
        // pinned rows will have node.rowPinned set to either 'top' or 'bottom' - see docs for row pinning
        if (params.node.rowPinned) {
            this.cssClass = 'example-full-width-pinned-row';
            this.message = `Pinned full width row at index ${params.node.rowIndex}`;
        } else {
            this.cssClass = 'example-full-width-row';
            this.message = `Normal full width row at index ${params.node.rowIndex}`;
        }

        this.eGui = document.createElement('div');

        this.eGui.innerHTML = `<div class="${this.cssClass}"><button>Click</button> ${this.message}</div>`;

        const eButton = this.eGui.querySelector('button');
        eButton.addEventListener('click', function () {
            alert('button clicked');
        });
    }

    getGui() {
        return this.eGui.firstChild ;
    }

    refresh() {
        return false;
    }
}

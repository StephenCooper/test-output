
class ClickableStatusBarComponent  {
    params;
    eGui;
    buttonListener;
    visible;
    eButton;

    init(params) {
        this.params = params;

        this.visible = true;
        this.eGui = document.createElement('div');
        this.eGui.className = 'ag-status-name-value';

        const label = document.createElement('span');
        label.textContent = 'Status Bar Component  ';
        this.eGui.appendChild(label);

        this.eButton = document.createElement('button');

        this.buttonListener = this.onButtonClicked.bind(this);
        this.eButton.addEventListener('click', this.buttonListener);
        this.eButton.textContent = 'Click Me';

        this.eGui.appendChild(this.eButton);
    }

    getGui() {
        return this.eGui;
    }

    destroy() {
        this.eButton.removeEventListener('click', this.buttonListener);
    }

    onButtonClicked() {
        alert('Selected Row Count: ' + this.params.api.getSelectedRows().length);
    }

    setVisible(visible) {
        this.visible = visible;
        this.eGui.style.display = this.visible ? 'block' : 'none';
    }

    isVisible() {
        return this.visible;
    }
}

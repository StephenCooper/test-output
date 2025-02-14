
class CustomHeader {
     eGui;

    init(params) {
        this.eGui = document.createElement('div');
        this.eGui.classList.add('custom-header');
        this.eGui.innerHTML = `
        <span>${params.displayName}</span>
        <button>Click me</button>
        <input value="120"/>
        <a href="https://www.ag-grid.com" target="_blank">Link</a>`;
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        return false;
    }
}

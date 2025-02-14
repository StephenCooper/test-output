
class DetailCellRenderer  {
    eGui;

    init(params) {
        this.eGui = document.createElement('div');
        this.eGui.setAttribute('role', 'gridcell');
        this.eGui.innerHTML = '<h1 style="padding: 20px;">My Custom Detail</h1>';
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        return false;
    }
}

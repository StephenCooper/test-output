
class DetailCellRenderer  {
    eGui;

    init(params) {
        this.eGui = document.createElement('div');
        this.eGui.innerHTML =
            '<h1 class="custom-detail" style="padding: 20px;">' + (params.pinned ? params.pinned : 'center') + '</h1>';
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        return false;
    }
}

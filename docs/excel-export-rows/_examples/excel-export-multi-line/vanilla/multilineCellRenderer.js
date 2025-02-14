
class MultilineCellRenderer  {
    eGui;

    init(params) {
        this.eGui = document.createElement('div');
        this.eGui.innerHTML = params.value.replace('\n', '<br/>');
    }

    getGui() {
        return this.eGui;
    }

    refresh() {
        return false;
    }
}

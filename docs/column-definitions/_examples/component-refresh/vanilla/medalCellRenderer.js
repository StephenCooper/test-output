
class MedalCellRenderer  {
     eGui;

    init(params) {
        console.log('renderer created');
        this.eGui = document.createElement('span');
        this.updateDisplayValue(params);
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        console.log('renderer refreshed');
        this.updateDisplayValue(params);
        return true;
    }

     updateDisplayValue(params) {
        this.eGui.textContent = new Array(params.value).fill('#').join('');
    }
}

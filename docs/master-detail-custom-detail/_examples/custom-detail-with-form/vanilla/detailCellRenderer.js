
class DetailCellRenderer  {
    eGui;

    init(params) {
        const firstRecord = params.data.callRecords[0];

        this.eGui = document.createElement('div');
        this.eGui.setAttribute('role', 'gridcell');
        this.eGui.className = 'cell-renderer-outer';
        this.eGui.innerHTML =
            '<form>' +
            '  <div>' +
            '  <div>' +
            '    <label>' +
            '      Call Id:<br>' +
            '    <input type="text" value="' +
            firstRecord.callId +
            '">' +
            '    </label>' +
            '  </div>' +
            '  <div>' +
            '    <label>' +
            '      Number:<br>' +
            '    <input type="text" value="' +
            firstRecord.number +
            '">' +
            '    </label>' +
            '  </div>' +
            '  <div>' +
            '    <label>' +
            '      Direction:<br>' +
            '    <input type="text" value="' +
            firstRecord.direction +
            '">' +
            '    </label>' +
            '  </div>' +
            '</form>' +
            '</div>';
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        return false;
    }
}

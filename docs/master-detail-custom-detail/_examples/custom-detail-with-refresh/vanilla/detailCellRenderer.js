
class DetailCellRenderer  {
    eGui;

    init(params) {
        this.eGui = document.createElement('div');
        this.eGui.setAttribute('role', 'gridcell');
        this.refresh(params);
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        this.eGui.innerHTML =
            '<form>' +
            '  <div>' +
            '  <p>' +
            '    <label>' +
            '      Calls:<br>' +
            '    <input type="text" value="' +
            params.data.calls +
            '">' +
            '    </label>' +
            '  </p>' +
            '  <p>' +
            '    <label>' +
            '        Last Updated: ' +
            new Date().toLocaleTimeString() +
            '    </label>' +
            '  </p>' +
            '</form>' +
            '</div>';
        // tell the grid not to destroy and recreate
        return true;
    }
}

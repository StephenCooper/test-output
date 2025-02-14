
class DetailCellRenderer  {
    eGui;
    eParentEl;

    init(params) {
        const firstRecord = params.data.callRecords[0];

        this.eParentEl = params.eParentOfValue;
        this.eParentEl.addEventListener('focus', this.onParentElFocus);
        this.eGui = document.createElement('div');
        this.eGui.setAttribute('role', 'gridcell');
        this.eGui.innerHTML =
            '<form>' +
            '  <div>' +
            '  <p>' +
            '    <label>' +
            '      Call Id:<br>' +
            '    <input type="text" value="' +
            firstRecord.callId +
            '">' +
            '    </label>' +
            '  </p>' +
            '  <p>' +
            '    <label>' +
            '      Number:<br>' +
            '    <input type="text" value="' +
            firstRecord.number +
            '">' +
            '    </label>' +
            '  </p>' +
            '  <p>' +
            '    <label>' +
            '      Direction:<br>' +
            '    <input type="text" value="' +
            firstRecord.direction +
            '">' +
            '    </label>' +
            '  </p>' +
            '</form>' +
            '</div>';
    }

    getGui() {
        return this.eGui;
    }

    refresh() {
        return false;
    }

    onParentElFocus(event) {
        const currentEl = event.target ;
        const previousEl = event.relatedTarget ;
        const previousRowEl = findRowForEl(previousEl);
        const currentRow = currentEl && parseInt(currentEl.getAttribute('row-index'), 10);
        const previousRow = previousRowEl && parseInt(previousRowEl.getAttribute('row-index'), 10);

        const inputs = Array.from(currentEl.querySelectorAll('input')).filter((el) => {
            if (el.checkVisibility) {
                return el.checkVisibility({
                    checkOpacity: true,
                    checkVisibilityCSS: true,
                });
            }
            return !!el.offsetParent && window.getComputedStyle(el).visibility === 'visible';
        });

        // Navigating forward, or unknown previous row
        if (!previousRow || currentRow >= previousRow) {
            // Focus on the first input
            inputs[0].focus();
        } else {
            // Navigating backwards
            // Focus on the last input
            inputs[inputs.length - 1].focus();
        }
    }

    destroy() {
        this.eParentEl.removeEventListener('focus', this.onParentElFocus);
    }
}

const findRowForEl = (el) => {
    let rowEl = el;
    while (rowEl) {
        rowEl = rowEl.parentElement;
        if (rowEl && rowEl.getAttribute('role') === 'row') {
            return rowEl;
        }
    }

    return null;
};

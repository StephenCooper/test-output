
class AthleteCellRenderer  {
    eGui;
    params;

    // init method gets the details of the cell to be renderer
    init(params) {
        this.params = params;
        const div = document.createElement('div');
        div.style.overflow = 'hidden';
        div.style.textOverflow = 'ellipsis';
        div.textContent = params.value || '';
        this.eGui = div;
        params.setTooltip(`Dynamic Tooltip for ${params.value}`, () => this.eGui.scrollWidth > this.eGui.clientWidth);
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        return false;
    }
}

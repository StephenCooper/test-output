




class MenuItem  {
    eGui;
    eOption;
    eFilterWrapper;
    eIcon;
    filterDisplayed = false;
    clickListener;
    mouseEnterListener;
    mouseLeaveListener;
    optionKeyDownListener;
    filterWrapperKeyDownListener;

    init(params) {
        this.eGui = document.createElement('div');
        this.eGui.innerHTML = `
            <div tabindex="-1" class="ag-menu-option">
                <span class="ag-menu-option-part ag-menu-option-icon" role="presentation">
                    <span class="ag-icon ag-icon-filter" unselectable="on" role="presentation"></span>
                </span>
                <span class="ag-menu-option-part ag-menu-option-text">Filter</span>
                <span class="ag-menu-option-part ag-menu-option-popup-pointer">
                    <span class="ag-icon ag-icon-tree-closed" unselectable="on" role="presentation"></span>
                </span>
            </div>
            <div class="filter-wrapper"></div>
        `;
        this.eOption = this.eGui.querySelector('.ag-menu-option');
        this.eFilterWrapper = this.eGui.querySelector('.filter-wrapper');
        this.eIcon = this.eGui.querySelector('.ag-icon-tree-closed');
        this.eFilterWrapper.style.display = 'none';
        params.api.getColumnFilterInstance(params.column).then((filter) => {
            this.eFilterWrapper.appendChild(filter.getGui());
        });

        this.clickListener = () => {
            // expand/collapse the filter
            this.eFilterWrapper.style.display = this.filterDisplayed ? 'none' : 'block';
            this.eIcon.classList.toggle('ag-icon-tree-closed', this.filterDisplayed);
            this.eIcon.classList.toggle('ag-icon-tree-open', !this.filterDisplayed);
            this.filterDisplayed = !this.filterDisplayed;
        };
        this.eOption.addEventListener('click', this.clickListener);
        this.mouseEnterListener = () => {
            this.setActive(true);
            params.onItemActivated();
        };
        this.eOption.addEventListener('mouseenter', this.mouseEnterListener);
        this.mouseLeaveListener = () => this.setActive(false);
        this.eOption.addEventListener('mouseleave', this.mouseLeaveListener);
        this.optionKeyDownListener = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.clickListener();
            }
        };
        this.eOption.addEventListener('keydown', this.optionKeyDownListener);
        this.filterWrapperKeyDownListener = (e) => {
            // stop the menu from handling keyboard navigation inside the filter
            e.stopPropagation();
        };
        this.eFilterWrapper.addEventListener('keydown', this.filterWrapperKeyDownListener);
    }

    getGui() {
        return this.eGui;
    }

    setActive(active) {
        if (active) {
            this.eOption.classList.add('ag-menu-option-active');
            this.eOption.focus();
        } else {
            this.eOption.classList.remove('ag-menu-option-active');
        }
    }

    destroy() {
        // remove the listeners
        this.eOption.removeEventListener('click', this.clickListener);
        this.eOption.removeEventListener('mouseenter', this.mouseEnterListener);
        this.eOption.removeEventListener('mouseleave', this.mouseLeaveListener);
        this.eOption.removeEventListener('keydown', this.optionKeyDownListener);
        this.eFilterWrapper.removeEventListener('keydown', this.filterWrapperKeyDownListener);
    }
}

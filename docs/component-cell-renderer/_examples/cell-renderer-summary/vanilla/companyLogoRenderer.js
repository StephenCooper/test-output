
class CompanyLogoRenderer  {
    eGui;

    // Optional: Params for rendering. The same params that are passed to the cellRenderer function.
    init(params) {
        const companyLogo = document.createElement('img');
        companyLogo.src = `https://www.ag-grid.com/example-assets/software-company-logos/${params.value.toLowerCase()}.svg`;
        companyLogo.setAttribute('class', 'logo');

        this.eGui = document.createElement('span');
        this.eGui.setAttribute('class', 'imgSpanLogo');
        this.eGui.appendChild(companyLogo);
    }

    // Required: Return the DOM element of the component, this is what the grid puts into the cell
    getGui() {
        return this.eGui;
    }

    // Required: Get the cell to refresh.
    refresh(params) {
        return false;
    }
}

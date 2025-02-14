
class CountryFlagCellRenderer  {
    eGui;

    init(params) {
        this.eGui = document.createElement('img');
        this.eGui.src = this.getFlagForCountry(params.value);
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        return false;
    }

    getFlagForCountry = (country) => {
        if (country === 'USA') {
            return 'https://www.ag-grid.com/example-assets/flags/us-flag.png';
        }

        if (country === 'China') {
            return 'https://www.ag-grid.com/example-assets/flags/cn-flag.png';
        }

        if (country === 'Kazakhstan') {
            return 'https://www.ag-grid.com/example-assets/flags/kz-flag.png';
        }

        return '';
    };
}

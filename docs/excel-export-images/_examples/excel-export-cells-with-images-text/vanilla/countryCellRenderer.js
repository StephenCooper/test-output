

class CountryCellRenderer  {
    eGui;

    init(params) {
        const { data } = params;
        const { country } = data;

        this.eGui = document.createElement('div');
        const img = document.createElement('img');
        const text = document.createTextNode(` ${country}`);
        img.alt = country;

        const context = params.context;
        img.src = context.base64flags[context.countryCodes[country]];
        this.eGui.appendChild(img);
        this.eGui.appendChild(text);
    }

    getGui() {
        return this.eGui;
    }

    refresh() {
        return false;
    }
}

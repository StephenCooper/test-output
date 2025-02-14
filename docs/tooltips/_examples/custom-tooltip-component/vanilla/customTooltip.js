
class CustomTooltip  {
    eGui;
    init(params) {
        const eGui = (this.eGui = document.createElement('div'));
        const color = params.color || '#999';

        eGui.classList.add('custom-tooltip');
        //@ts-ignore
        eGui.style['background-color'] = color;
        eGui.innerHTML = `
            <div><b>Custom Tooltip</b></div>
            <div>${params.value}</div>
        `;
    }

    getGui() {
        return this.eGui;
    }
}

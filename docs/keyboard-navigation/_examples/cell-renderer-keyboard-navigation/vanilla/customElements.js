
class CustomElements  {
    eGui;

    init(params) {
        this.eGui = document.createElement('div');
        this.eGui.classList.add('custom-element');
        this.eGui.innerHTML = `
        <button>Age: ${params.data.age ? params.data.age : '?'}</button>
        <input value="${params.data.country ? params.data.country : ''}"/>
        <a href="https://www.google.com/search?q=${params.data.sport}" target="_blank">${params.data.sport}</a>
    `;
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        return false;
    }
}

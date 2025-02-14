
function setStyle(element, propertyObject) {
    for (const property in propertyObject) {
        element.style[property] = propertyObject[property];
    }
}
class CustomPinnedRowRenderer  {
     eGui;

    init(params) {
        this.eGui = document.createElement('div');
        setStyle(this.eGui, params.style);
        this.eGui.innerHTML = params.value;
    }

    getGui() {
        return this.eGui;
    }

    refresh() {
        return false;
    }
}

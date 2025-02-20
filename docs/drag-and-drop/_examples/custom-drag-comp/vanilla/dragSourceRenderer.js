
class DragSourceRenderer  {
    eGui;
    rowNode;
    onDragStartListener;

    init(params) {
        const eTemp = document.createElement('div');
        eTemp.innerHTML = '<div draggable="true">Drag Me!</div>';

        this.eGui = eTemp.firstChild ;
        this.rowNode = params.node;

        this.onDragStartListener = this.onDragStart.bind(this);
        this.eGui.addEventListener('dragstart', this.onDragStartListener);
    }

    onDragStart(dragEvent) {
        dragEvent.dataTransfer.setData('text/plain', 'Dragged item with ID: ' + this.rowNode.data.id);
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        return false;
    }

    destroy() {
        this.eGui.removeEventListener('dragstart', this.onDragStartListener);
    }
}

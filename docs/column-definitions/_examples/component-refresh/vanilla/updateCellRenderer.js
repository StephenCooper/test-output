
class UpdateCellRenderer  {
     eGui;
     params;

    init(params) {
        this.eGui = document.createElement('div');
        this.eGui.innerHTML = '<button>Update Data</button>';
        this.eGui.addEventListener('click', () => this.onClick());
        this.params = params;
    }

    getGui() {
        return this.eGui;
    }

    refresh() {
        return false;
    }

    onClick() {
        const { node } = this.params;
        const { gold, silver, bronze } = node.data;
        node.updateData({
            ...node.data,
            gold: gold + 1,
            silver: silver + 1,
            bronze: bronze + 1,
        });
    }
}

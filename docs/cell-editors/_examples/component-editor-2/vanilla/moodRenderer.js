
class MoodRenderer  {
    eGui;
    init(params) {
        const div = (this.eGui = document.createElement('div'));
        div.className = 'mood-renderer';

        if (params.value !== '' || params.value !== undefined) {
            const imgForMood =
                params.value === 'Happy'
                    ? 'https://www.ag-grid.com/example-assets/smileys/happy.png'
                    : 'https://www.ag-grid.com/example-assets/smileys/sad.png';
            this.eGui.innerHTML = `<img width="20px" src="${imgForMood}" />`;
        }
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        return false;
    }
}

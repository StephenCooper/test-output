
class MedalRenderer  {
    eGui;
    eButton;
    buttonListener;
    total;

    init(params) {
        this.total = params.data.total;

        this.eGui = document.createElement('span');
        this.eGui.classList.add('total-value-renderer');

        const label = document.createElement('span');
        label.innerText = params.valueFormatted ? params.valueFormatted : params.value;
        this.eGui.appendChild(label);

        this.eButton = document.createElement('button');
        this.buttonListener = this.buttonClicked.bind(this);
        this.eButton.addEventListener('click', this.buttonListener);
        this.eButton.textContent = 'Push For Total';

        this.eGui.appendChild(label);
        this.eGui.appendChild(this.eButton);
    }

    buttonClicked() {
        alert(`${this.total} medals won!`);
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        return false;
    }

    destroy() {
        this.eButton.removeEventListener('click', this.buttonListener);
    }
}

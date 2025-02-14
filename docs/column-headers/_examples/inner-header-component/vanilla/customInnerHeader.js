




class CustomInnerHeader  {
     agParams;
     eGui;
     eText;

    init(agParams) {
        const eGui = (this.eGui = document.createElement('div'));
        eGui.classList.add('customInnerHeader');
        const textNode = document.createElement('span');
        this.eText = textNode;

        textNode.textContent = agParams.displayName;

        if (agParams.icon) {
            const icon = document.createElement('i');
            icon.classList.add('fa', `${agParams.icon}`);
            eGui.appendChild(icon);
        }

        eGui.appendChild(textNode);
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        this.eText.textContent = params.displayName;
        return true;
    }
}

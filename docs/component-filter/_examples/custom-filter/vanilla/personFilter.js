
class PersonFilter  {
    filterParams;
    filterText;
    gui;
    eFilterText;

    init(params) {
        this.filterParams = params;
        this.filterText = null;
        this.setupGui(params);
    }

    // not called by AG Grid, just for us to help setup
    setupGui(params) {
        this.gui = document.createElement('div');
        this.gui.innerHTML = `<div class="person-filter">
                <div>Custom Athlete Filter</div>
                <div>
                    <input type="text" id="filterText" placeholder="Full name search..."/>
                </div>
                <div>This filter does partial word search on multiple words, eg "mich phel" still brings back Michael Phelps.</div>
            </div>
        `;

        const listener = (event) => {
            this.filterText = event.target.value;
            params.filterChangedCallback();
        };

        this.eFilterText = this.gui.querySelector('#filterText');
        this.eFilterText.addEventListener('changed', listener);
        this.eFilterText.addEventListener('paste', listener);
        this.eFilterText.addEventListener('input', listener);
    }

    getGui() {
        return this.gui;
    }

    doesFilterPass(params) {
        const { node } = params;

        // make sure each word passes separately, ie search for firstname, lastname
        let passed = true;
        this.filterText
            ?.toLowerCase()
            .split(' ')
            .forEach((filterWord) => {
                const value = this.filterParams.getValue(node);

                if (value.toString().toLowerCase().indexOf(filterWord) < 0) {
                    passed = false;
                }
            });

        return passed;
    }

    isFilterActive() {
        return this.filterText != null && this.filterText !== '';
    }

    getModel() {
        if (!this.isFilterActive()) {
            return null;
        }

        return { value: this.filterText };
    }

    setModel(model) {
        const newValue = model == null ? null : model.value;
        this.eFilterText.value = newValue;
        this.filterText = newValue;
    }

    afterGuiAttached(params) {
        if (!params?.suppressFocus) {
            // focus the input element for keyboard navigation
            this.eFilterText.focus();
        }
    }
}

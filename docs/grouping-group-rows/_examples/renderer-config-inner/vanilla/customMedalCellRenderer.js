
function CustomMedalCellRenderer(params) {
    const paramsNumber = Number(params.value);
    const priceSpan = document.createElement('span');
    priceSpan.setAttribute('class', 'imgSpan');
    for (let i = 0; i < paramsNumber ?? 0; i++) {
        const priceElement = document.createElement('img');
        priceElement.src = `https://www.ag-grid.com/example-assets/gold-star.png`;
        priceElement.setAttribute('class', 'medalIcon');
        priceSpan.appendChild(priceElement);
    }
    return priceSpan;
}

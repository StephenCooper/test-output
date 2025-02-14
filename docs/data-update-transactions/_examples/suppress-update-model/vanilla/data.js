const LAPTOPS = ['Hewlett Packard', 'Lenovo', 'Dell', 'Asus', 'Apple', 'Acer', 'Microsoft', 'Razer'];

let idCounter = 0;

function letter(i) {
    return 'abcdefghijklmnopqrstuvwxyz'.substring(i, i + 1);
}

function randomLetter() {
    return letter(Math.floor(Math.random() * 26 + 1));
}

function getData() {
    const myRowData = [];
    for (let i = 0; i < 20; i++) {
        const name = 'Mr ' + randomLetter().toUpperCase();
        const fixed = Boolean(Math.round(Math.random()));
        const laptop = LAPTOPS[i % LAPTOPS.length];
        const value = Math.floor(Math.random() * 100) + 10; // between 10 and 110

        myRowData.push(createDataItem(name, laptop, fixed, value));
    }
    return myRowData;
}

function createDataItem(
    name,
    laptop,
    fixed,
    value,
    idToUse = undefined
) {
    const id = idToUse != null ? idToUse : idCounter++;
    return {
        id: id,
        name: name,
        fixed: fixed,
        laptop: laptop,
        value: value,
    };
}

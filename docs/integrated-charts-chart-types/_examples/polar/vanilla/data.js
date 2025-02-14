async function getData(delay = 100) {
    return new Promise((resolve) => setTimeout(() => resolve(generateData()), delay));
}

function generateData() {
    return [
        { division: 'Sales', recurring: 485829, individual: 263971 },
        { division: 'Finance', recurring: 291245, individual: 46821 },
        { division: 'Consultancy', recurring: 315284, individual: 216473 },
        { division: 'Operations', recurring: 154319, individual: 29867 },
        { division: 'Media', recurring: 215284, individual: 61473 },
    ];
}

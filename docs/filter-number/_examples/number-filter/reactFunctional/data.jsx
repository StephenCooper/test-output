export function getData() {
    const rows = [];

    for (let i = 0; i < 1000; i++) {
        rows.push({ sale: parseFloat(getRandomNumber(-500, 1000).toFixed(2)) });
    }

    return rows;
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

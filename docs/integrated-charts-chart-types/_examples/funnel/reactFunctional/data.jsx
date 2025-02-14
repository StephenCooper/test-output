export async function getData(delay = 100) {
    return new Promise((resolve) => setTimeout(() => resolve(generateData()), delay));
}

function generateData() {
    return [
        { group: 'Page Visit', count: 490 },
        { group: 'Enquiry', count: 340 },
        { group: 'Quote', count: 300 },
        { group: 'Sale', count: 290 },
    ];
}

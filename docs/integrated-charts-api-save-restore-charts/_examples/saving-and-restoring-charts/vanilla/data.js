async function getData(delay = 100) {
    return new Promise((resolve) => setTimeout(() => resolve(generateData()), delay));
}

function generateData() {
    const countries = [
        'Ireland',
        'Spain',
        'United Kingdom',
        'France',
        'Germany',
        'Luxembourg',
        'Sweden',
        'Norway',
        'Italy',
        'Greece',
        'Iceland',
        'Portugal',
        'Malta',
        'Brazil',
        'Argentina',
        'Colombia',
        'Peru',
        'Venezuela',
        'Uruguay',
        'Belgium',
    ];

    return countries.map((country) => ({
        country,
        sugar: getRandomNumber(0, 50),
        fat: getRandomNumber(0, 100),
        weight: getRandomNumber(0, 200),
    }));
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

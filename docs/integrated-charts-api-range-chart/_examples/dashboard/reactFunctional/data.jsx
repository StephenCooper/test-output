export async function getData(delay = 100) {
    // Simulate a server delay using setTimeout wrapped in a Promise
    return await new Promise((resolve) => setTimeout(() => resolve(generateData()), delay));
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

    return countries.map((country, index) => ({
        country,
        group: index % 2 === 0 ? 'Group A' : 'Group B',
        gold: Math.floor(((index + 1 / 7) * 333) % 100),
        silver: Math.floor(((index + 1 / 3) * 555) % 100),
        bronze: Math.floor(((index + 1 / 7.3) * 777) % 100),
    }));
}

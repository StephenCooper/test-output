export const zzzLocale = (locale) => {
    const modifiedLocale = {};
    Object.keys(locale).forEach(function (key) {
        if (key === 'thousandSeparator' || key === 'decimalSeparator') {
            return;
        }
        modifiedLocale[key] = 'zzz-' + locale[key];
    });

    return modifiedLocale;
};

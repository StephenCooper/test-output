
function CompanyRenderer(params) {
    const link = `<a href="${params.value}" target="_blank">${new URL(params.value).hostname}</a>`;
    return link;
}

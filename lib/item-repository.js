
var items = {
    banana: '275280804',
    milk: '260569996'
};

exports.getItemIdentifier = function getItemIdentifier(itemName) {
    return items[itemName];
};
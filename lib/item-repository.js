'use strict';

const items = {
    banana: '275280804',
    milk: '260569996',
    plums: '292275580',
    strawberries: '272202380',
    raspberries: '2873776670',
    blackberries: '292248554',
    kiwis: '256644151',
    mango: '255805844',
    carrot: '254638565',
    parsnip: '253557408',
    'butternut squash': '277492902',
    courgette: '253554596',
    mushrooms: '273796618',
    'new potatoes': '266125635',
    'maris piper potatoes': '258423755',
    avocados: '256074560',
    salad: '293172353',
    'cherry tomatoes': '285212132',
    houmous: '260084012',
    butter: '254263685',
    eggs: '250802567',
    cheddar: '277925449',
    mozzarella: '268328438',
    feta: '260671607',
    halloumi: '264245536',
    chicken: '292285280',
    turkey: '266507796'
};
exports.getItemIdentifier = function getItemIdentifier(itemName) {
    return items[itemName];
};

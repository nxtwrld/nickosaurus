/**
 * Vraci nahodne cislo od 0 do maxima
 * @param {integer} max 
 */
export function nahodneCislo(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Nahodne rozhazi prvky pole
 * @param {array} pole 
 */
export function rozhazetPole(pole) {
    let soucasnyIndex = pole.length,
        docasnaHodnota, nahodnyIndex;

    // While there remain elements to shuffle...
    while (0 !== soucasnyIndex) {

        // Pick a remaining element...
        nahodnyIndex = Math.floor(Math.random() * soucasnyIndex);
        soucasnyIndex -= 1;

        // And swap it with the current element.
        docasnaHodnota = pole[soucasnyIndex];
        pole[soucasnyIndex] = pole[nahodnyIndex];
        pole[nahodnyIndex] = docasnaHodnota;
    }

    return pole;
}

/**
 * V pripade pole vrati prvni prvek, jinak vraci vlozeny parametr
 * @param {string|array} slovo 
 */
export function vyberPrvni(slovo) {
    return (Array.isArray(slovo)) ? slovo[0] : slovo;
}

/**
 * Odstrani zbytecne interpunkcni znaky
 * @param {string} slovo 
 */
export function odstranZbytecneZnaky(slovo) {
    let zbytecneZnaky = '?!.,'.split();
    return zbytecneZnaky.reduce(function(slovo, znak) {
        return slovo.replace(znak, '');
    }, slovo);
}

/**
 *  Porovna odpoved se zadanim, pripadne polem zadani
 * @param {string} zadani 
 * @param {string} odpoved 
 */
export function porovnejVarianty(zadani, odpoved) {
    odpoved = odstranZbytecneZnaky(odpoved.trim().toLowerCase());
    if (Array.isArray(zadani)) {
        return zadani.filter(slovo => {
            return odpoved == odstranZbytecneZnaky(slovo.toLowerCase());
        }).length > 0;
    } else {
        return odpoved == odstranZbytecneZnaky(zadani.toLowerCase());
    }
}
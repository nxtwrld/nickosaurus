export function nahodneCislo(max) {
    return Math.floor(Math.random() * Math.floor(max));
}



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
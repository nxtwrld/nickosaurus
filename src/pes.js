export let typyPrikazu = ['sedni', 'jdi', 'bez', 'skoc'];


export let prikazy = typyPrikazu.reduce((prikazy, prikaz) => {

    prikazy[prikaz] = function() {
        document.dispatchEvent(new CustomEvent('nicku-' + prikaz, {
            bubbles: true
        }));
    }
    return prikazy;
}, {});
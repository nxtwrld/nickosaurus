<script>

import { onMount, createEventDispatcher } from 'svelte';
import { cesky, nemecky } from './povidac.js';
import { nahodneCislo, rozhazetPole } from './sdileneFunkce.js';

const dispatch = createEventDispatcher();

export let slovicka;
export let slovicko;
export let odpoved;
export let jazykZadani = nahodneCislo(2) ? 'cj' : 'nj';
export let jazykMoznosti = (jazykZadani == 'cj') ? 'nj' : 'cj';

$: moznosti = vyberDalsiSlova(slovicka, slovicko);


function vyberDalsiSlova(slovicka, slovicko) {
    // jedno slovo musi byt vzdy to spravne
    let vybrana = [slovicko[jazykMoznosti]];
    // nahodne vybirej dalsi slova. Ne vic jak 3
    while (vybrana.length  < 3) {
        // nohodne si jedno vybereme
        let slovo = slovicka[nahodneCislo(slovicka.length)][jazykMoznosti];
        // jestli ho jeste nema v nasich moznostech, tak to tam pridame
        if (vybrana.indexOf(slovo) == -1) vybrana.push(slovo);
    }
    return rozhazetPole(vybrana);
}
onMount(() => {

    if (jazykZadani == 'cj') cesky(slovicko.cj);
    else nemecky(slovicko.nj);

});

</script>

<p>Vyber:</p>
{slovicko[jazykZadani]} {#if slovicko.poznamka}({slovicko.poznamka}){/if}

{#each moznosti as moznost}
<button on:click={ () => { odpoved = moznost; dispatch('zkontrolovat', jazykMoznosti) }}>{moznost}</button>
{/each}

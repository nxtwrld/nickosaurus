<script>

import { onMount, createEventDispatcher } from 'svelte';
import { cesky, nemecky } from './povidac.js';
import { nahodneCislo, rozhazetPole, vyberPrvni } from './sdileneFunkce.js';


const dispatch = createEventDispatcher();

export let slovicka;
export let slovicko;
export let odpoved;
export let jazykZadani = nahodneCislo(2) ? 'mj' : 'cj';
export let jazykMoznosti = (jazykZadani == 'mj') ? 'cj' : 'mj';

$: moznosti = vyberDalsiSlova(slovicka, slovicko);


function vyberDalsiSlova(slovicka, slovicko) {
    // jedno slovo musi byt vzdy to spravne
    let vybrana = [vyberPrvni(slovicko[jazykMoznosti])];
    // nahodne vybirej dalsi slova. Ne vic jak 3
    while (vybrana.length  < 3) {
        // nohodne si jedno vybereme
        let slovo = vyberPrvni(slovicka[nahodneCislo(slovicka.length)][jazykMoznosti]);
        // jestli ho jeste nema v nasich moznostech, tak to tam pridame
        if (vybrana.indexOf(slovo) == -1) vybrana.push(slovo);
    }
    return rozhazetPole(vybrana);
}
onMount(() => {

    precti();

});

function precti() {
    if (jazykZadani == 'mj') cesky(vyberPrvni(slovicko.mj));
    else nemecky(vyberPrvni(slovicko.cj));
}


</script>
    <div class="zadani">
        <p class="slovo" on:click={precti}>{vyberPrvni(slovicko[jazykZadani])} {#if slovicko.poznamka}({slovicko.poznamka}){/if}</p>
    </div>
    <div class="odpoved">
        <div>
            <p class="instrukce">Vyber:</p>
            {#each moznosti as moznost}
            <button class="button {(odpoved == moznost) ? '-vybrane' : ''}" on:click={ () => { odpoved = moznost;}}>{moznost}</button>
            {/each}
            <div class="zalom"></div>
            <button class="zkontrolovat" on:click={() =>  dispatch('zkontrolovat', jazykMoznosti) }>Zkontrolovat</button>
        </div>
    </div>

<script>
import { onMount, createEventDispatcher } from 'svelte';
import { nahodneCislo } from './sdileneFunkce.js';
import { nemecky } from './povidac.js';
import { vyberPrvni } from './sdileneFunkce.js';

const dispatch = createEventDispatcher();

export let slovicko;
export let odpoved;
export let slovicka;

let input;

function zmacknulEnter (event) {
    if (event.code == 'Enter') dispatch('zkontrolovat');
}

function udelejChybu (slovo) {
    // tady se musi to slovo nejak zkazit
    if (slovo.indexOf('ß') > -1) {
        return slovo.replace('ß', 's');
    } else if (slovo.indexOf('tt') > -1) {
        return slovo.replace('tt', 't');
    } else if (slovo.indexOf('ei') > -1) {
        return slovo.replace('ei', 'ie');
    } else if (slovo.indexOf('ie') > -1) {
        return slovo.replace('ie', 'ei');
    } else {
        return prohod(slovo.split('')).join('');
    }
}

function prohod (pole) {
    let index1 = nahodneCislo(pole.length-2);
    let index2 = index1+1;
    
    if (pole[index1] == ' ' || pole[index2] == ' ' || pole[index1] == pole[index2]) return prohod(pole);

    let pismeno = pole[index1];
    pole[index1] = pole[index2];
    pole[index2] = pismeno;
    return pole;
}


onMount(() => {
    odpoved = udelejChybu(vyberPrvni(slovicko.cj));
    precti();
});

function precti () {
    nemecky(vyberPrvni(slovicko.cj));
    input.focus();
}

</script>

<div class="zadani">
    <p class="slovo" on:click={precti}>{vyberPrvni(slovicko.mj)} {#if slovicko.poznamka}({slovicko.poznamka}){/if}</p>
</div>
<div class="odpoved">
    <p class="instrukce">Oprav:</p>
    <input bind:this={input} type="text" bind:value={odpoved} on:keyup|preventDefault={zmacknulEnter} />
    <div class="zalom"></div>
    <button class="zkontrolovat" on:click={() => dispatch('zkontrolovat')}>Zkontrolovat</button>
</div>


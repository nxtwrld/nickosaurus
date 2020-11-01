<script>
import { onMount, createEventDispatcher } from 'svelte';
import { nahodneCislo } from './sdileneFunkce.js';
import { nemecky } from './povidac.js';

const dispatch = createEventDispatcher();

export let slovicko;
export let odpoved;

let input;

function zmacknulEnter (event) {
    if (event.code == 'Enter') dispatch('zkontrolovat');
}

function udelejChybu (slovo) {
    // tady se musi to slovo nejak zkazit
    
    return prohod(slovo.split('')).join('');
}

function prohod (pole) {
    let index1 = nahodneCislo(pole.length-2);
    let index2 = nahodneCislo(pole.length-2);
    
    if (pole[index1] == ' ' || pole[index2] == ' ' || pole[index1] == pole[index2]) return prohod(pole);

    let pismeno = pole[index1];
    pole[index1] = pole[index2];
    pole[index2] = pismeno;
    return pole;
}


onMount(() => {
    nemecky(slovicko.cj);
    odpoved = udelejChybu(slovicko.cj);
    input.focus();
});


</script>

<div class="zadani">
    <p class="slovo">{slovicko.mj} {#if slovicko.poznamka}({slovicko.poznamka}){/if}</p>
</div>
<div class="odpoved">
    <p class="instrukce">Oprav:</p>
    <input bind:this={input} type="text" bind:value={odpoved} on:keyup|preventDefault={zmacknulEnter} />
</div>


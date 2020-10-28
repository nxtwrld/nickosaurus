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
    input.focus();
    nemecky(slovicko.nj);
    odpoved = udelejChybu(slovicko.nj);
});


</script>

<p>Oprav:</p>
{slovicko.cj} {#if slovicko.poznamka}({slovicko.poznamka}){/if}
<input bind:this={input} type="text" bind:value={odpoved}  on:click={() => dispatch('zkontrolovat')} on:keyup|preventDefault={zmacknulEnter} />
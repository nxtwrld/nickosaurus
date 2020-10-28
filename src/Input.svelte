<script>

import { onMount, createEventDispatcher } from 'svelte';
import { cesky } from './povidac.js';

const dispatch = createEventDispatcher();

export let slovicko;
export let odpoved;

let input;

function zmacknulEnter (event) {
    if (event.code == 'Enter') dispatch('zkontrolovat');
}

onMount(() => {
    cesky(slovicko.cj);
    input.focus();
});

</script>

<p>Přelož:</p>

{slovicko.cj} {#if slovicko.poznamka}({slovicko.poznamka}){/if}
<input bind:this={input} type="text" bind:value={odpoved}  on:click={() => dispatch('zkontrolovat')} on:keyup|preventDefault={zmacknulEnter} />

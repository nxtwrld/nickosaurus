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
    cesky(slovicko.mj);
    input.focus();
});

</script>

<p>Přelož:</p>

{slovicko.mj} {#if slovicko.poznamka}({slovicko.poznamka}){/if}
<input bind:this={input} type="text" bind:value={odpoved}  on:keyup|preventDefault={zmacknulEnter} />

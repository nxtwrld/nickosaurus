<script>

import { onMount, createEventDispatcher } from 'svelte';
import { vyberPrvni } from './sdileneFunkce.js';
import { cesky } from './povidac.js';


const dispatch = createEventDispatcher();

export let slovicko;
export let odpoved;

let input;

function zmacknulEnter (event) {
    if (event.code == 'Enter') dispatch('zkontrolovat');
}

onMount(() => {
    cesky(vyberPrvni(slovicko.mj));
    input.focus();
});

</script>

    <div class="zadani">
        <p class="slovo">{vyberPrvni(slovicko.mj)} {#if slovicko.poznamka}({slovicko.poznamka}){/if}</p>
    </div>
    <div class="odpoved">
        <div>
            <p class="instrtukce">Přelož:</p>
            <input bind:this={input} type="text" bind:value={odpoved}  on:keyup|preventDefault={zmacknulEnter} />
            <div class="zalom"></div>
            <button class="zkontrolovat" on:click={() => dispatch('zkontrolovat')}>Zkontrolovat</button>
        </div>
    </div>


    

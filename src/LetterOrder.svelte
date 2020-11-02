<script>
import { onMount, createEventDispatcher } from 'svelte';
import { rozhazetPole, vyberPrvni, porovnejVarianty } from './sdileneFunkce.js';
import { nemecky } from './povidac.js';
import { dndzone } from 'svelte-dnd-action';
import { flip } from 'svelte/animate';

const flipDurationMs = 200;
const dispatch = createEventDispatcher();

export let slovicko;
export let odpoved;


let casovac;
let items = rozdelNaPismena(odpoved);
let dropTargetStyle;



function udelejChybu (slovo) {
    // pojdme to slovo nejak pozkazit
    let chybneSlovo = rozhazetPole(slovo.split('')).join('');
    if (slovo == chybneSlovo) return udelejChybu(slovo);
    return chybneSlovo;
}


function rozdelNaPismena (odpoved) {
    return odpoved.split('').map((title, id) => {
        return {
            id,
            title
        }
    });
}

onMount(() => {
    nemecky(vyberPrvni(slovicko.cj));
    odpoved = udelejChybu(vyberPrvni(slovicko.cj));
    items = rozdelNaPismena(odpoved);
});

// pismenko bylo prehozeno
function handleSort(e) {
    clearTimeout(casovac);
    items = e.detail.items;
    dropTargetStyle = {
        outline: 0
    }
    odpoved = items.map(item => item.title).join('');
    // uz je to slovo spravne?
    if (porovnejVarianty(slovicko.cj, odpoved)) {
        // ano - pojdme se posunout dal
        casovac = setTimeout(() => {
            dispatch('zkontrolovat');
        }, 1000);
    }
}

</script>

<div class="zadani">
    <p class="slovo">{vyberPrvni(slovicko.mj)} {#if slovicko.poznamka}({slovicko.poznamka}){/if}</p>
</div>
<div class="odpoved">
    <div>
        <p class="instrukce">Seřaď písmena:</p>
        <div class="serazovacka" use:dndzone={{items, flipDurationMs, dropTargetStyle}} on:consider={handleSort} on:finalize={handleSort}>
            {#each items as item(item.id)}
                <div class="pismeno" animate:flip={{duration:flipDurationMs}} >{item.title}</div>
            {/each}
        </div>
    </div>
</div>

<style>
.serazovacka {
    width: 100%;
    display: flex;
    align-items: auto;
    justify-content: center;
    flex-wrap: wrap;
}
.pismeno {
    outline: 0 !important;
    min-width: 2rem;
}
</style>
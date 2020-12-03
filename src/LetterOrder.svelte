<script>
import { onMount, createEventDispatcher } from 'svelte';
import { rozhazetPole, vyberPrvni, porovnejVarianty } from './sdileneFunkce.js';
import { nemecky } from './povidac.js';
import { dndzone } from 'svelte-dnd-action';
import { flip } from 'svelte/animate';

const flipDurationMs = 200;
const dispatch = createEventDispatcher();
const POCET_SLOV = 2;


export let slovicko;
export let odpoved;
export let slovicka;

let casovac;
let items = rozdelNaPismena(odpoved);
let dropTargetStyle;
let poSlovech = false;


function udelejChybu (slovo, poSlovech = false) {
    // pojdme to slovo nejak pozkazit
    let chybneSlovo = rozhazetPole(slovo.split((poSlovech) ? ' ' : '')).join((poSlovech) ? ' ' : '');
    if (slovo == chybneSlovo) return udelejChybu(slovo, poSlovech);
    return chybneSlovo;
}


function rozdelNaPismena (odpoved, slova = false) {
    if (slova) {
        return odpoved.split(' ').map((title, id) => {
            return {
                id,
                title
            }
        });
    } else {
        return odpoved.split('').map((title, id) => {
            return {
                id,
                title
            }
        });
    }
}

onMount(() => {
    let aktivniSlovicko = vyberPrvni(slovicko.cj);
    nemecky(aktivniSlovicko);
    poSlovech = aktivniSlovicko.split(' ').length > POCET_SLOV;

    odpoved = udelejChybu(aktivniSlovicko, poSlovech);
    items = rozdelNaPismena(odpoved, poSlovech);
});

// pismenko bylo prehozeno
function handleSort(e) {
    clearTimeout(casovac);
    items = e.detail.items;
    dropTargetStyle = {
        outline: 0
    }
    odpoved = items.map(item => item.title).join((poSlovech) ? ' ' : '');
}

function precti() {
    nemecky(aktivniSlovicko);
}

</script>
    <div class="zadani">
        <p class="slovo" on:click={precti}>{vyberPrvni(slovicko.mj)} {#if slovicko.poznamka}({slovicko.poznamka}){/if}</p>
    </div>
    <div class="odpoved">
        <div>
            <p class="instrukce">Seřaď písmena:</p>
            <div class="serazovacka" use:dndzone={{items, flipDurationMs, dropTargetStyle}} on:consider={handleSort} on:finalize={handleSort}>
                {#each items as item(item.id)}
                    <div class="pismeno" animate:flip={{duration:flipDurationMs}} >{item.title}</div>
                {/each}
            </div>
            <div class="zalom"></div>
            <button class="zkontrolovat" on:click={() => dispatch('zkontrolovat')}>Zkontrolovat</button>
        </div>
    </div>


<style>

.serazovacka {
    width: 100%;
    display: flex;
    align-items: auto;
    justify-content: center;
    flex-wrap: wrap;
    padding: 0 5vw;
}
.pismeno {
    outline: 0 !important;
}
</style>
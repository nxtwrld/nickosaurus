<script>
import { onMount } from 'svelte';
import Input from './Input.svelte';
import MultipleChoice from './MultipleChoice.svelte';
import LetterOrder from './LetterOrder.svelte';
import TypoFix from './TypoFix.svelte';
import { nemecky } from './povidac.js';
import { nahodneCislo, vyberPrvni, porovnejVarianty } from './sdileneFunkce.js';
import { prikazy } from './pes';
import { fly } from 'svelte/transition';
import uzivatel from './uzivatel';

console.log($uzivatel)
let komponenty = [
	Input,
    MultipleChoice,
    LetterOrder,
    TypoFix
];

export let pocetHvezd = 3;
export let lekce = null;

let aktivniKomponenta = 1;

let chyby = 0;
let slovicka = [];
let ucimeSeSlovicka = [];
let naucenaSlovicka = [];
let i = 0;
let odpoved = '';
let vysledek = null;

// nahrajeme slovicka ze souboru v adresari /public/lekce/
fetch('lekce/'+lekce+'.json')
	.then(r => r.json())
	.then(lekce => {
		slovicka = [...lekce.slovicka];
		ucimeSeSlovicka = [...lekce.slovicka];
        i = nahodneCislo(ucimeSeSlovicka.length);
	});

function vyberPouziteSlovo(odpoved, slovo) {
    if (Array.isArray(slovo)) {
        let nalezeno = slovo.filter(slovo => {
            return odpoved.trim().toLowerCase() == slovo.toLowerCase();
        });
        return (nalezeno.length > 0) ? nalezeno : slovo[0];
    } else {
        return slovo;
    }

}


function zkontrolovat(event) {
	// v jakem jazyce kontrolujeme odpoved?
	let jazyk = event.detail || 'cj';
    let precteno;

	if (odpoved == '') return;
	// zadane slovo odpovida  vzoru (kontrolovat mala pismena a odstranit prebytecne mezery)
	if (porovnejVarianty(ucimeSeSlovicka[i][jazyk], odpoved)) {

        vysledek = 'skvele';
        
        prikazy.bez();
		// precti spravne slovicko
		precteno = nemecky(
            ((ucimeSeSlovicka[i].clen) ? ucimeSeSlovicka[i].clen +' ' : '') 
            + vyberPouziteSlovo(odpoved, ucimeSeSlovicka[i].cj)
            ).then(function(){ 
			// pridame slovo do naucenych slovicek
			naucenaSlovicka = [...naucenaSlovicka, ucimeSeSlovicka[i]];
			// odebereme ho ze slovnicku
            ucimeSeSlovicka = [...ucimeSeSlovicka.slice(0, i), ...ucimeSeSlovicka.slice(i+1)];
            return;
		});

	} else {
        prikazy.jdi();
		chyby = chyby+1;
		vysledek = 'chyba';
		// precti spravne slovicko
		precteno = nemecky(vyberPrvni(ucimeSeSlovicka[i].cj));
    }
    precteno.then(() => {
        // ulozime vysledek, je-li lepsi nez drivejsi
        if (ucimeSeSlovicka.length == 0) {
            if(!$uzivatel.lekce[lekce] || $uzivatel.lekce[lekce] > chyby) {
                console.log('Jeste neni nebo mel vic chyb', lekce, $uzivatel.lekce[lekce], 'vs.',chyby);
                uzivatel.aktualizujLekci(lekce, chyby);
            }
        }
        // vymazeme vysledek
        vysledek = null;
        // vybereme nahodne dalsi slovicko
        i = nahodneCislo(ucimeSeSlovicka.length-1);
        // vymazeme odpoved
        odpoved = '';
        // vybrat komponentu
        dalsiKomponenta(ucimeSeSlovicka[i]);
        prikazy.sedni();
    });

}

function dalsiKomponenta (slovo) {

    if (aktivniKomponenta + 1 < komponenty.length)  aktivniKomponenta++;
    else aktivniKomponenta = 0;
}
function hlavniStranka () {
    prikazy.jdi();
    location.hash = "#";
}


onMount(() => {
    setTimeout(() => { prikazy.sedni(); }, 2000);
});


</script>


<div class="lekce -{vysledek}"  in:fly="{{ x: window.innerWidth, duration: 2000 }}" out:fly="{{ x: 0-window.innerWidth, duration: 2000 }}">


	<div class="hvezdicky">
        {#each Array(pocetHvezd) as hvezda, poradi}
            {#if pocetHvezd - chyby >= poradi+1}
                <span class="zlata">★</span>
            {:else}
                <span class="ztracena">☆</span>
            {/if}
        {/each}
	</div>
	<p>Zbýva {ucimeSeSlovicka.length} slov. Počet chyb: {chyby}</p>
</div>

<div class="otazka" in:fly="{{ x: window.innerWidth, duration: 2000 }}" out:fly="{{ x: 0-window.innerWidth, duration: 2000 }}">
	{#if ucimeSeSlovicka.length == 0} 
        <div class="lekce-dokoncena">
            <div class="vysledek">
                <h2>Hotovo! Všechno už umíš.</h2>
                <button on:click={hlavniStranka}>Vyber si další lekci</button>
            </div>

            <div class="opakovani">
            <div class="slovicka-prehled">
                <table>
                {#each naucenaSlovicka as {cj, mj, poznamka} }
                    <tr class="slovicko">
                        <td><span class="mj">{vyberPrvni(mj)}</span></td>
                        <td> : </td>
                        <td><span class="cj">{vyberPrvni(cj)}</span> {#if poznamka}({poznamka}){/if}</td>
                    </tr>
                {/each}
                </table>
            </div>
            </div>


		</div>

	{:else if ucimeSeSlovicka[i]}
        <div class="uloha -{vysledek}">
		    <svelte:component this={komponenty[aktivniKomponenta]} slovicko={ucimeSeSlovicka[i]} bind:odpoved={odpoved} on:zkontrolovat={zkontrolovat} slovicka={slovicka} />
            {#if vysledek != null}
                <div class="odpoved -spravna">
                    <div>
                        {#if vysledek == 'skvele'}
                            <p class="instrukce">Skvělé</p>
                            <p class="slovo">
                                {#if ucimeSeSlovicka[i].clen}{ucimeSeSlovicka[i].clen}{/if}
                                {vyberPouziteSlovo(odpoved, ucimeSeSlovicka[i].cj)}
                            </p>
                        {:else}
                            <p class="instrukce">Chyba</p>
                            <p class="slovo">
                                {#if ucimeSeSlovicka[i].clen}{ucimeSeSlovicka[i].clen}{/if}
                                {vyberPrvni(ucimeSeSlovicka[i].cj)}
                            </p>
                        {/if}

                    </div>
                </div>
            {/if}
        </div>
	{/if}
</div>

<style>
.slovicka-prehled {
    column-count: 2;
}
</style>

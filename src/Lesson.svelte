<script>
import Input from './Input.svelte';
import MultipleChoice from './MultipleChoice.svelte';
import LetterOrder from './LetterOrder.svelte';
import { nemecky } from './povidac.js';
import { nahodneCislo, vyberPrvni, porovnejVarianty } from './sdileneFunkce.js';
       
let komponenty = [
	Input,
    MultipleChoice,
    LetterOrder
];

export let pocetHvezd = 3;
.2
let aktivniKomponenta = 2;

let chyby = 0;
let slovicka = [];
let ucimeSeSlovicka = [];
let naucenaSlovicka = [];
let i = 0;
let odpoved = '';
let vysledek = null;
export let lekce = null;

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
		// precti spravne slovicko
		precteno = nemecky(vyberPouziteSlovo(odpoved, ucimeSeSlovicka[i][jazyk])).then(function(){ 
			// pridame slovo do naucenych slovicek
			naucenaSlovicka = [...naucenaSlovicka, ucimeSeSlovicka[i]];
			// odebereme ho ze slovnicku
			ucimeSeSlovicka = [...ucimeSeSlovicka.slice(0, i), ...ucimeSeSlovicka.slice(i+1)];
            return;
		});

	} else {
		chyby = chyby+1;
		vysledek = 'chyba';
		// precti spravne slovicko
		precteno = nemecky(vyberPrvni(ucimeSeSlovicka[i].cj));
    }
    precteno.then(() => {
        // vymazeme vysledek
        vysledek = null;
        // vybereme nahodne dalsi slovicko
        i = nahodneCislo(ucimeSeSlovicka.length-1);
        // vymazeme odpoved
        odpoved = '';
        // vybrat komponentu
        dalsiKomponenta();
    });

}

function dalsiKomponenta () {
    if (aktivniKomponenta + 1 < komponenty.length)  aktivniKomponenta++;
    else aktivniKomponenta = 0;
}
function hlavniStranka () {
    location.hash = "#";
}

</script>


<div class="lekce -{vysledek}">


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

<div class="otazka">
	{#if ucimeSeSlovicka.length == 0} 
        <div class="lekce-dokoncena">
            <div>
                <h2>Hotovo! Všechno už umíš.</h2>
                <table>
                {#each naucenaSlovicka as {cj, mj, poznamka} }
                    <tr class="slovicko">
                        <td><span class="mj">{mj}</span></td>
                        <td> : </td>
                        <td><span class="cj">{vyberPrvni(cj)}</span> {#if poznamka}({poznamka}){/if}</td>
                    </tr>
                {/each}
                </table>
                <button on:click={hlavniStranka}>Vyber si další lekci</button>
            </div>


		</div>

	{:else if ucimeSeSlovicka[i]}
        <div class="-{vysledek}">
		    <svelte:component this={komponenty[aktivniKomponenta]} slovicko={ucimeSeSlovicka[i]} bind:odpoved={odpoved} on:zkontrolovat={zkontrolovat} slovicka={slovicka} />
            {#if vysledek != null}
                <div class="odpoved -spravna">
                    <div>
                        {#if vysledek == 'skvele'}
                            <p class="instrukce">Skvělé</p>
                            <p class="slovo">{vyberPouziteSlovo(odpoved, ucimeSeSlovicka[i].cj)}</p>
                        {:else}
                            <p class="instrukce">Chyba</p>
                            <p class="slovo">{vyberPrvni(ucimeSeSlovicka[i].cj)}</p>
                        {/if}

                    </div>
                </div>
            {/if}
        </div>
	{/if}
</div>



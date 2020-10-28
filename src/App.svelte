<script>
import Input from './Input.svelte';
import Typo from './TypoFix.svelte';
import MultipleChoice from './MultipleChoice.svelte';
import { nemecky } from './povidac.js';
import { nahodneCislo } from './sdileneFunkce.js';
       


let komponenty = [
	Input,
	Typo,
	MultipleChoice
];

let aktivniKomponenta = 2;

let chyby = 0;
let slovicka = [];
let ucimeSeSlovicka = [];
let naucenaSlovicka = [];
let i = 0;
let odpoved = '';
let vysledek = null;

// nahrajeme slovicka ze souboru v adresari /public/lekce/
fetch('lekce/pozdravy.json')
	.then(r => r.json())
	.then(lekce => {
		slovicka = [...lekce];
		ucimeSeSlovicka = [...lekce];
		i = nahodneCislo(ucimeSeSlovicka.length);
	});



function zkontrolovat(event) {
	// v jakem jazyce kontrolujeme odpoved?
	let jazyk = event.detail || 'nj';

	if (odpoved == '') return;
	// zadane slovo odpovida  vzoru (kontrolovat mala pismena a odstranit prebytecne mezery)
	if (odpoved.trim().toLowerCase() == ucimeSeSlovicka[i][jazyk].toLowerCase()) {
		vysledek = 'skvele';
		// precti spravne slovicko
		nemecky(ucimeSeSlovicka[i].nj).then(function(){ 
			// pridame slovo do naucenych slovicek
			naucenaSlovicka = [...naucenaSlovicka, ucimeSeSlovicka[i]];
			// odebereme ho ze slovnicku
			ucimeSeSlovicka = [...ucimeSeSlovicka.slice(0, i), ...ucimeSeSlovicka.slice(i+1)];
			// vybereme nahodne dalsi slovicko
			i = nahodneCislo(ucimeSeSlovicka.length);
			// vymazeme vysledek
			vysledek = null;
			odpoved = '';
		});

	} else {
		chyby = chyby+1;
		vysledek = 'chyba';
		// precti spravne slovicko
		nemecky(ucimeSeSlovicka[i].nj).then(function(){ 
			// pak jdeme na jine nahodne slovicko
			i = nahodneCislo(ucimeSeSlovicka.length);
			vysledek = null;
			odpoved = '';
		});
	}
	aktivniKomponenta = nahodneCislo(komponenty.length);
}

</script>


<div class={vysledek}>
	<h1>Nickster</h1>
	<h3>Učíme se s profesorem Nickem!</h3>
	<p>Zbýva {ucimeSeSlovicka.length} slov. Počet chyb: {chyby}</p>

	<div class="hvezdicky">
		{#if chyby == 0}
			★★★
		{:else if chyby == 1}
			★★☆
		{:else if chyby == 2}
			★☆☆
		{:else}
			☆☆☆
		{/if}
	</div>

	{#if ucimeSeSlovicka.length == 0} 

		<p>	Hotovo! Všechno už umíš.</p>

		{#each naucenaSlovicka as {nj, cj, poznamka} }
			<div>{cj} : {nj} {#if poznamka}({poznamka}){/if}</div>
		{/each}

		

	{:else}

		{#if vysledek}
			{#if vysledek == 'skvele'}
				Skvělé
			{:else}
				Chyba
			{/if}
			: {ucimeSeSlovicka[i].nj}
		{:else}
			<svelte:component this={komponenty[aktivniKomponenta]} slovicko={ucimeSeSlovicka[i]} bind:odpoved={odpoved} on:zkontrolovat={zkontrolovat} slovicka={slovicka} />
			<div>
				<button on:click={zkontrolovat}>Zkontrolovat</button>
			</div>

		{/if}

	{/if}
</div>


<style>
	.chyba {
 		background: red;
        color: white;
	 }
	.skvele {
  		background: green;
	}
	.hvezdicky {
		font-size: 3rem;
		color: rgb(255, 208, 0);
	}
</style>

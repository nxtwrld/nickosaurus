<script>
import { onMount } from 'svelte';
import Lekce from './Lesson.svelte';
import Scena from './Scena.svelte';
import { prikazy, typyPrikazu } from './pes';
import uzivatel from './uzivatel';
import { nahodneCislo } from './sdileneFunkce';

export let pocetHvezd = 3;

uzivatel.init();

let lekce = null;

let seznamLekci = {};
let poradi = {};

fetch('lekce.json')
	.then(r => r.json())
	.then(odpoved => {
		console.log(odpoved);
		seznamLekci = odpoved;
		Object.keys(seznamLekci).forEach(jazyk => {
			poradi[jazyk] = Object.keys(seznamLekci[jazyk])
								.map(lekce => {
									seznamLekci[jazyk][lekce].id = lekce;
									return seznamLekci[jazyk][lekce];
								})
								.sort((a, b) => a.poradi - b.poradi);
			
		});
		console.log(poradi);
	})

window.addEventListener('hashchange', () => {
	loadLocation(location.hash)
})

loadLocation(location.hash);

function loadLocation(hash) {
	prikazy.bez();
	hash =  hash.replace('#', '');
	if (hash != '') {
		lekce = hash;
	} else{
		lekce = null;
		setTimeout(() => { prikazy.sedni(); }, 2000);
	}

}

onMount(() => {
    setTimeout(() => { prikazy.sedni(); }, 2000);
});

</script>


<div class="aplikace">
	<Scena pohled={(lekce) ? 'vyuka' : 'obsah' } />

	<div class="hlavicka {(lekce) ? '-vyuka' : '-obsah' }">
		<a class="logo" href="#">Nick-o-saurus</a>
		<h3>Učíme se s profesorem Nickem!</h3>
	</div>



	<div class="obsah">
	{#if lekce}
		<Lekce lekce={lekce} pocetHvezd={pocetHvezd} />
	{:else}
		<div class="seznam">
		{#each Object.keys(poradi) as jazyk}
			{#each poradi[jazyk] as lekce}
			<a href="#{jazyk}/{lekce.id}" class="tlacitko-lekce">
				<strong>{lekce.nazev}</strong>
				{lekce.czNazev}<br>
				{#if $uzivatel.lekce[jazyk+'/'+lekce.id] != undefined}
					{#each Array(pocetHvezd) as hvezda, index}
						{#if pocetHvezd - $uzivatel.lekce[jazyk+'/'+lekce.id] >= index+1}
							<span class="zlata">★</span>
						{:else}
							<span class="ztracena">☆</span>
						{/if}
					{/each}
				{/if}
			</a>
			{/each}

		{/each}
		</div>

	{/if}
	</div>
</div>


<style>
	
</style>

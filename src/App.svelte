<script>
import { onMount } from 'svelte';
import Lekce from './Lesson.svelte';
import Scena from './Scena.svelte';
import { prikazy, typyPrikazu } from './pes';

let lekce = null;

let seznamLekci = {};

fetch('lekce.json')
	.then(r => r.json())
	.then(odpoved => {
		console.log(odpoved);
		seznamLekci = odpoved;
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
		<h1 class="logo">Nick-o-saurus</h1>
		<h3>Učíme se s profesorem Nickem!</h3>
	</div>



	<div class="obsah">
	{#if lekce}
		<Lekce lekce={lekce} />
	{:else}
		<div class="seznam">
		{#each Object.keys(seznamLekci) as jazyk}
			{#each Object.keys(seznamLekci[jazyk]) as lekce}
			<a href="#{jazyk}/{lekce}" class="">{seznamLekci[jazyk][lekce].nazev}</a><br/>
			{/each}

		{/each}
		</div>

	{/if}
	</div>
</div>


<style>
	
</style>

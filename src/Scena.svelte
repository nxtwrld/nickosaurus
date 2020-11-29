<script>

let pes;
let pohyb = 'bez';
export let pohled = 'obsah';

function skoc () {
    pes.classList.add('skoc');
    setTimeout(()=>{
        pes.classList.remove('skoc');
    }, 950)
}
document.addEventListener('nicku-sedni', () => {
    pohyb = 'sedni';
});

document.addEventListener('nicku-bez', () => {
    pohyb = 'bez';
});

document.addEventListener('nicku-jdi', () => {
    pohyb = 'jdi';
});

</script>

<div class="scena -{pohled} {pohyb}" >
    <div class="krajina">
        <div class="krajina-hory"></div>
        <div class="krajina-more"></div>
        <div class="krajina-zem"></div>
    </div>
    <div bind:this={pes} on:click={skoc} class="pes"></div>

</div>
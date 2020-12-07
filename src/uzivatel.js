import { writable } from 'svelte/store';


const store = () => {
    console.log('*: playerStore -> store()');

    const state = {
        jmeno: null,
        email: null,
        skore: 0,
        lekce: {}
    };


    const { subscribe, get, set, update } = writable(state);

    function ulozStav(state) {
        console.log('Ukladame', state.lekce);
        localStorage.setItem('lekce', JSON.stringify(state.lekce));
    }

    const metody = {
        init() {
            console.log('*: playerStore -> init()');
            update(state => {
                state.lekce = JSON.parse(localStorage.getItem('lekce')) || {};
                return state;
            });

        },

        aktualizujLekci(lekce, pocetChyb) {
            console.log('*: playerStore -> updateLesson()');
            update(state => {
                state.lekce[lekce] = pocetChyb;
                ulozStav(state);
                return state;
            });
        }
    };

    return {
        subscribe,
        set,
        update,
        ...metody
    }
}

export default store();
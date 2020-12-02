let voices = window.speechSynthesis.getVoices();
let Zuzana = voices.filter((v) => (v.lang == 'cs-CZ' && v.name == 'Zuzana'))[0];
let Anna = voices.filter((v) => (v.lang == 'de-DE' && v.name == 'Anna'))[0];
const zpozdeni = 1000;

export function nemecky(slovo) {
    let msg = new SpeechSynthesisUtterance();
    msg.voice = Anna;
    msg.text = slovo;
    msg.lang = 'de-DE';
    speechSynthesis.speak(msg);
    return new Promise(function(hotovo, chyba) {
        msg.onend = function() {
            setTimeout(() => {
                hotovo();
            }, zpozdeni);
        }
        msg.onerror = function() {
            setTimeout(() => {
                chyba();
            }, zpozdeni);
        }
    });
}


export function cesky(slovo) {
    let msg = new SpeechSynthesisUtterance();
    msg.voice = Zuzana;
    msg.text = slovo;
    msg.lang = 'cs-CZ';
    speechSynthesis.speak(msg);
    return new Promise(function(hotovo, chyba) {
        msg.onend = function() {
            setTimeout(() => {
                hotovo();
            }, zpozdeni);
        }
        msg.onerror = function() {
            setTimeout(() => {
                chyba();
            }, zpozdeni);
        }
    });
}
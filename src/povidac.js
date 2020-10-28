let voices = window.speechSynthesis.getVoices();
const zpozdeni = 1000;

export function nemecky(slovo) {
    let msg = new SpeechSynthesisUtterance();
    msg.voice = voices[4];
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
    msg.voice = voices[47];
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
// potrebne moduly pro praci se soubory
const path = require('path');
const fs = require('fs');
// vyvorime cestu k adreari
const directoryPath = path.join(__dirname, 'public/lekce');
//nacteme obsah adresare
var files = readDirectory(directoryPath);

console.log(files);
// zapiseme vysledek do souboru
fs.writeFileSync("public/lekce.json", JSON.stringify(files, null, 2), 'utf8');

function readDirectory(directoryPath, result = {}) {
    var files = fs.readdirSync(directoryPath, { withFileTypes: true });
    //projdeme vsechny soubory
    files.forEach(function(file) {
        // pridame soubory do stromu
        result[file.name.replace('.json', '')] = {};
        if (fs.lstatSync(path.join(directoryPath, file.name)).isDirectory()) {
            result[file.name] = readDirectory(path.join(directoryPath, file.name), );
        } else {
            var lesson = JSON.parse(fs.readFileSync(path.join(directoryPath, file.name)))
            result[file.name.replace('.json', '')] = {
                nazev: lesson.nazev,
                czNazev: lesson.czNazev
            }

        }
    });
    return result;
}
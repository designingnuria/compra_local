#!/usr/bin/env node
/**
 * Sella los assets de index.html con ?v=<hash del contenido>.
 *
 * Los ficheros no llevan el hash en el nombre, así que sin esto el navegador
 * puede quedarse con una copia vieja de app.js junto a un index.html nuevo:
 * la página arranca, peta a mitad y se queda sin resultados. Al cambiar la URL
 * cuando cambia el contenido, la copia vieja deja de usarse sola.
 *
 *   node scripts/versionar.js            comprueba (falla si está desfasado)
 *   node scripts/versionar.js --escribir  actualiza index.html
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const raiz = path.join(__dirname, "..");
const INDICE = path.join(raiz, "index.html");
const ASSETS = ["assets/css/styles.css", "assets/js/app.js", "assets/js/enviar.js", "assets/js/analitica.js", "data/negocios.js"];

function hash(rel) {
  const buf = fs.readFileSync(path.join(raiz, rel));
  return crypto.createHash("sha256").update(buf).digest("hex").slice(0, 8);
}

function sellar(html) {
  let salida = html;
  for (const rel of ASSETS) {
    const v = hash(rel);
    const re = new RegExp(rel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '(\\?v=[0-9a-z]+)?(")', "g");
    let encontrado = false;
    salida = salida.replace(re, function (_m, _viejo, cierre) {
      encontrado = true;
      return rel + "?v=" + v + cierre;
    });
    if (!encontrado) throw new Error("index.html no enlaza " + rel);
  }
  return salida;
}

const actual = fs.readFileSync(INDICE, "utf8");
const esperado = sellar(actual);
const escribir = process.argv.includes("--escribir");

if (actual === esperado) {
  console.log("✓ assets sellados al día");
  process.exit(0);
}
if (escribir) {
  fs.writeFileSync(INDICE, esperado);
  console.log("✓ index.html actualizado con las versiones nuevas");
  process.exit(0);
}
console.error("✗ los ?v= de index.html no cuadran con el contenido de los assets");
console.error("  arréglalo con: node scripts/versionar.js --escribir");
process.exit(1);

#!/usr/bin/env node
/* ---------------------------------------------------------------
   Genera REVISAR.md: la lista de negocios que toca comprobar, en
   orden de urgencia, con un enlace de Google Maps por ficha.

       node scripts/revisar.js

   Por qué hace falta: el comercio de barrio cierra constantemente y
   una ficha de un negocio cerrado es peor que no tener ficha. El
   registro de comercios centenarios del Ayuntamiento tampoco sirve
   para esto: es un archivo histórico, no un listado de quién sigue
   abierto. Al cruzarlo aparecieron cinco comercios ya cerrados.

   Cuando compruebes uno, ponle en data/negocios.js:

       revisado: "2026-09"

   y si ha cerrado, borra la ficha entera.
   --------------------------------------------------------------- */

const fs = require("fs");
const path = require("path");
const { NEGOCIOS, CATEGORIAS } = require("../data/negocios.js");

const nombreCat = Object.fromEntries(CATEGORIAS.map((c) => [c.id, c.nombre]));
const hoy = new Date();
const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`;

/* Meses transcurridos desde la última comprobación. Sin comprobar nunca
   cuenta como infinito, para que salga lo primero. */
function antiguedad(n) {
  if (!n.revisado) return Infinity;
  const [a, m] = n.revisado.split("-").map(Number);
  return (hoy.getFullYear() - a) * 12 + (hoy.getMonth() + 1 - m);
}

/* Se revisa antes lo que más papeletas tiene de estar mal: lo que nunca
   se ha comprobado, lo que no está verificado y lo que lleva más tiempo
   sin mirarse. */
function urgencia(n) {
  return (n.revisado ? 0 : 1000) + (n.verificado ? 0 : 500) + Math.min(antiguedad(n), 400);
}

function mapa(n) {
  const q = [n.nombre, n.direccion, n.barrio, "Madrid"].filter(Boolean).join(", ");
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
}

const lista = NEGOCIOS.slice().sort(
  (a, b) => urgencia(b) - urgencia(a) || a.nombre.localeCompare(b.nombre, "es")
);

const sinRevisar = lista.filter((n) => !n.revisado);
const caducados = lista.filter((n) => n.revisado && antiguedad(n) >= 12);
const alDia = NEGOCIOS.length - sinRevisar.length - caducados.length;

const linea = (n) =>
  `- [ ] [${n.nombre}](${mapa(n)}) — ${nombreCat[n.categoria] || n.categoria}` +
  `${n.barrio ? ` · ${n.barrio}` : ""}${n.direccion ? ` · ${n.direccion}` : ""}` +
  `${n.revisado ? ` · revisado ${n.revisado}` : ""}` +
  `${n.verificado ? "" : " · **datos sin verificar**"}`;

const doc = `# Lista de revisión

Generado el ${mesActual} con \`node scripts/revisar.js\`. No lo edites a mano:
se regenera a partir de \`data/negocios.js\`.

Abre el enlace de cada negocio, mira en Google Maps si sigue abierto y:

- **Sigue abierto** → añádele \`revisado: "${mesActual}"\` a su ficha.
- **Cerrado permanentemente** → borra la ficha entera.
- **Se ha mudado** → corrige \`direccion\` (y \`coords\`, si la tenía).

| | |
|---|---|
| Negocios en el directorio | ${NEGOCIOS.length} |
| Sin comprobar nunca | ${sinRevisar.length} |
| Comprobados hace un año o más | ${caducados.length} |
| Al día | ${alDia} |

## Sin comprobar nunca (${sinRevisar.length})

${sinRevisar.map(linea).join("\n") || "_Ninguno._"}

## Toca repasarlos, hace un año o más (${caducados.length})

${caducados.map(linea).join("\n") || "_Ninguno._"}
`;

const destino = path.join(__dirname, "..", "REVISAR.md");
fs.writeFileSync(destino, doc);
console.log(`REVISAR.md generado: ${sinRevisar.length} sin comprobar, ${caducados.length} caducados, ${alDia} al día.`);

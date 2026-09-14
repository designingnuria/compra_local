#!/usr/bin/env node
/**
 * Cambia el dominio de la web en todos los sitios donde está escrito.
 *
 * La dirección aparece en las etiquetas para compartir (canonical, Open Graph),
 * en el sitemap y en robots.txt. Si se cambia el nombre del proyecto en Vercel,
 * la URL cambia y hay que actualizarlos todos: si se queda uno viejo, WhatsApp
 * y Twitter siguen enseñando la vista previa de la dirección antigua.
 *
 *   node scripts/dominio.js                      dice cuál está puesto
 *   node scripts/dominio.js consume-local.vercel.app   lo cambia
 */

const fs = require("fs");
const path = require("path");

const raiz = path.join(__dirname, "..");
const FICHEROS = ["index.html", "sitemap.xml", "robots.txt"];
const PATRON = /https:\/\/[a-z0-9-]+\.vercel\.app/g;

const leer = (f) => fs.readFileSync(path.join(raiz, f), "utf8");

const actuales = new Set();
FICHEROS.forEach((f) => (leer(f).match(PATRON) || []).forEach((u) => actuales.add(u)));

const nuevo = process.argv[2];

if (!nuevo) {
  console.log("Dominio actual: " + [...actuales].join(", "));
  console.log("Para cambiarlo:  node scripts/dominio.js consume-local.vercel.app");
  process.exit(0);
}

const limpio = nuevo.replace(/^https?:\/\//, "").replace(/\/+$/, "");
if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(limpio)) {
  console.error("✗ eso no parece un dominio: " + nuevo);
  process.exit(1);
}

let total = 0;
FICHEROS.forEach((f) => {
  const antes = leer(f);
  const despues = antes.replace(PATRON, "https://" + limpio);
  if (antes !== despues) {
    fs.writeFileSync(path.join(raiz, f), despues);
    const n = (antes.match(PATRON) || []).length;
    total += n;
    console.log(`  ${f}: ${n} ${n === 1 ? "mención" : "menciones"}`);
  }
});

console.log(total ? `\n✓ ${total} direcciones apuntan ya a https://${limpio}` : "Ya estaba puesto.");

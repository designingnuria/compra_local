#!/usr/bin/env node
/* ---------------------------------------------------------------
   Empaqueta la web en un único archivo HTML con el CSS y el
   JavaScript incrustados.

       node scripts/construir.js

   Genera dos versiones en dist/:

     consume-local.html  Página completa y autónoma. Se puede abrir con
                        doble clic, mandar por correo o subir a cualquier
                        sitio sin llevarse la carpeta de assets detrás.

     artefacto.html     La misma página sin las etiquetas <html>, <head>
                        y <body>, para publicarla como Artifact en
                        claude.ai, que aporta su propio esqueleto.

   La web normal (index.html) no necesita este paso para nada: funciona
   tal cual. Esto es solo para repartirla de una pieza.
   --------------------------------------------------------------- */

const fs = require("fs");
const path = require("path");

const raiz = path.join(__dirname, "..");
const dist = path.join(raiz, "dist");

const leer = (rel) => fs.readFileSync(path.join(raiz, rel), "utf8");

/* Un "</script>" dentro del código cerraría la etiqueta antes de tiempo. */
const aSalvo = (js) => js.replace(/<\/script/gi, "<\\/script");

const html = leer("index.html");

const head = html.match(/<head>([\s\S]*?)<\/head>/i)[1];
const body = html.match(/<body>([\s\S]*?)<\/body>/i)[1];

const estilos = [...head.matchAll(/<link rel="stylesheet" href="(assets\/[^"]+)">/g)];
const fuentes = head.match(/<link rel="preconnect"[\s\S]*?<link rel="stylesheet" href="https:\/\/fonts[^"]+">/);
const titulo = head.match(/<title>[\s\S]*?<\/title>/i)[0];
const descripcion = head.match(/<meta name="description"[^>]*>/i)[0];

const css = estilos.map((m) => leer(m[1])).join("\n");

const guiones = [...body.matchAll(/<script src="([^"]+)"><\/script>/g)];
const js = guiones
  .map((m) => `<script>\n${aSalvo(leer(m[1]))}\n</script>`)
  .join("\n");

const cuerpo = body.replace(/\s*<script src="[^"]+"><\/script>/g, "").trimEnd();

fs.mkdirSync(dist, { recursive: true });

/* --- versión autónoma -------------------------------------------------- */
const autonoma = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${titulo}
${descripcion}
<meta name="color-scheme" content="light dark">
${fuentes ? fuentes[0] : ""}
<style>
${css}
</style>
</head>
<body>
${cuerpo}
${js}
</body>
</html>
`;
fs.writeFileSync(path.join(dist, "consume-local.html"), autonoma);

/* --- versión para Artifact (sin html/head/body propios) ----------------- */
/* En la galería de Artifacts el título es un nombre, no un titular: se queda
   con lo de antes del separador («Consume Local»), sin el subtítulo. */
const tituloCorto = titulo.replace(/(<title>[^·<]*).*(<\/title>)/i, (_, a, b) => a.trim() + b);

const artefacto = `${tituloCorto}
${fuentes ? fuentes[0] : ""}
<style>
${css}
</style>
${cuerpo}
${js}
<script>document.documentElement.lang = "es";</script>
`;
fs.writeFileSync(path.join(dist, "artefacto.html"), artefacto);

const kb = (f) => (fs.statSync(path.join(dist, f)).size / 1024).toFixed(0) + " KB";
console.log(`dist/consume-local.html  ${kb("consume-local.html")}  (autónoma)`);
console.log(`dist/artefacto.html     ${kb("artefacto.html")}  (para Artifact)`);

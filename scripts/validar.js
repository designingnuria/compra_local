#!/usr/bin/env node
/* ---------------------------------------------------------------
   Comprueba que `data/negocios.js` está bien formado antes de subirlo.

       node scripts/validar.js

   Sale con código 1 si encuentra errores, para que el CI lo detenga.
   --------------------------------------------------------------- */

const fs = require("fs");
const path = require("path");
const { CATEGORIAS, NEGOCIOS } = require("../data/negocios.js");

const OBLIGATORIOS = ["id", "nombre", "categoria", "descripcion"];
const OPCIONALES = ["barrio", "direccion", "web", "instagram", "desde", "etiquetas", "verificado", "coords", "revisado"];
const PERMITIDOS = new Set([...OBLIGATORIOS, ...OPCIONALES]);

const errores = [];
const avisos = [];
const vistos = new Map();
const categorias = new Set(CATEGORIAS.map((c) => c.id));
const anyoActual = new Date().getFullYear();

NEGOCIOS.forEach((n, i) => {
  const donde = `#${i + 1} «${n.nombre || n.id || "sin nombre"}»`;

  OBLIGATORIOS.forEach((campo) => {
    if (typeof n[campo] !== "string" || !n[campo].trim()) {
      errores.push(`${donde}: falta el campo obligatorio "${campo}"`);
    }
  });

  Object.keys(n).forEach((campo) => {
    if (!PERMITIDOS.has(campo)) avisos.push(`${donde}: campo desconocido "${campo}"`);
  });

  if (n.id) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(n.id)) {
      errores.push(`${donde}: el id "${n.id}" debe ir en minúsculas y separado por guiones`);
    }
    if (vistos.has(n.id)) {
      errores.push(`${donde}: el id "${n.id}" ya lo usa ${vistos.get(n.id)}`);
    } else {
      vistos.set(n.id, donde);
    }
  }

  if (n.categoria && !categorias.has(n.categoria)) {
    errores.push(
      `${donde}: la categoría "${n.categoria}" no existe. Disponibles: ${[...categorias].join(", ")}`
    );
  }

  if (n.barrio !== undefined && (typeof n.barrio !== "string" || !n.barrio.trim())) {
    errores.push(`${donde}: si pones "barrio", que no vaya vacío`);
  }

  if (typeof n.verificado !== "boolean") {
    errores.push(`${donde}: "verificado" debe ser true o false`);
  }

  if (n.web !== undefined && !/^https?:\/\/\S+$/.test(n.web)) {
    errores.push(`${donde}: "web" debe ser una URL completa (https://…)`);
  }

  if (n.instagram !== undefined && /[@/\s]/.test(n.instagram)) {
    errores.push(`${donde}: "instagram" es solo el usuario, sin arroba ni URL`);
  }

  if (n.desde !== undefined) {
    if (!Number.isInteger(n.desde) || n.desde < 1500 || n.desde > anyoActual) {
      errores.push(`${donde}: "desde" debe ser un año entre 1500 y ${anyoActual}`);
    }
  }

  /* Se guardan aunque ahora mismo no se pinte ningún mapa: son datos
     costosos de reunir y estarán ahí el día que el mapa vuelva. */
  if (n.coords !== undefined) {
    const c = n.coords;
    const valida = Array.isArray(c) && c.length === 2 &&
      typeof c[0] === "number" && typeof c[1] === "number" &&
      c[0] > 40.2 && c[0] < 40.7 && c[1] > -4.0 && c[1] < -3.4;
    if (!valida) {
      errores.push(`${donde}: "coords" debe ser [latitud, longitud] dentro de Madrid`);
    }
  }

  if (n.revisado !== undefined && !/^\d{4}-(0[1-9]|1[0-2])$/.test(n.revisado)) {
    errores.push(`${donde}: "revisado" debe ser un mes con formato AAAA-MM`);
  }

  if (n.etiquetas !== undefined) {
    if (!Array.isArray(n.etiquetas) || n.etiquetas.some((t) => typeof t !== "string")) {
      errores.push(`${donde}: "etiquetas" debe ser una lista de textos`);
    }
  }

  if (typeof n.descripcion === "string") {
    if (n.descripcion.length < 40) avisos.push(`${donde}: la descripción se queda muy corta`);
    if (n.descripcion.length > 320) avisos.push(`${donde}: la descripción es demasiado larga`);
  }
});

const huerfanas = CATEGORIAS.filter(
  (c) => !NEGOCIOS.some((n) => n.categoria === c.id)
).map((c) => c.id);
if (huerfanas.length) avisos.push(`Categorías sin ningún negocio: ${huerfanas.join(", ")}`);

/* vercel.json no admite claves que no estén en su esquema, y una sola de más
   hace que el despliegue falle entero: la web se queda en la última versión
   buena sin avisar de nada. Pasó con un "comment" puesto a modo de nota, que
   dejó cuatro cambios sin publicar. JSON no tiene comentarios. */
const CLAVES_VERCEL = new Set(["$schema", "cleanUrls", "trailingSlash", "headers",
  "redirects", "rewrites", "cleanUrlsRedirect", "regions", "framework",
  "buildCommand", "outputDirectory", "installCommand", "devCommand", "ignoreCommand", "public"]);
const CLAVES_REGLA = new Set(["source", "headers", "has", "missing", "destination", "permanent", "statusCode"]);

try {
  const vercel = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "vercel.json"), "utf8"));
  Object.keys(vercel).forEach((k) => {
    if (!CLAVES_VERCEL.has(k)) errores.push(`vercel.json: la clave "${k}" no está en el esquema de Vercel`);
  });
  (vercel.headers || []).concat(vercel.redirects || [], vercel.rewrites || []).forEach((regla, i) => {
    Object.keys(regla).forEach((k) => {
      if (!CLAVES_REGLA.has(k)) {
        errores.push(`vercel.json: la regla #${i + 1} lleva una clave "${k}" que Vercel no acepta`);
      }
    });
  });
} catch (e) {
  errores.push(`vercel.json no se puede leer: ${e.message}`);
}

const sinVerificar = NEGOCIOS.filter((n) => n.verificado === false).length;
const sinRevisar = NEGOCIOS.filter((n) => !n.revisado).length;
const sinBarrio = NEGOCIOS.filter((n) => !n.barrio).length;
if (sinBarrio) avisos.push(`Fichas sin barrio (se muestran solo como "Madrid"): ${sinBarrio}`);

console.log(`Negocios: ${NEGOCIOS.length}  ·  categorías: ${CATEGORIAS.length}`);
console.log(
  `Verificados: ${NEGOCIOS.length - sinVerificar}  ·  pendientes de comprobar: ${sinVerificar}`
);
console.log(
  `Comprobado que siguen abiertos: ${NEGOCIOS.length - sinRevisar}  ·  sin comprobar: ${sinRevisar}` +
  `   (node scripts/revisar.js)`
);

/* Los assets no llevan hash en el nombre: si index.html no los sella con el
   ?v= correcto, un navegador puede mezclar HTML nuevo con app.js viejo. */
try {
  require("child_process").execFileSync(process.execPath, [__dirname + "/versionar.js"], { stdio: "pipe" });
} catch (e) {
  errores.push("los ?v= de index.html están desfasados (node scripts/versionar.js --escribir)");
}

if (avisos.length) {
  console.log(`\nAvisos (${avisos.length}):`);
  avisos.forEach((a) => console.log(`  · ${a}`));
}

if (errores.length) {
  console.error(`\nErrores (${errores.length}):`);
  errores.forEach((e) => console.error(`  ✗ ${e}`));
  process.exit(1);
}

console.log("\nTodo correcto.");

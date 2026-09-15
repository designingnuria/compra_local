/* ---------------------------------------------------------------
   Consume Local — canal común hacia Tinybird.

   Lo usan dos cosas distintas: la analítica y, sobre todo, las propuestas
   de negocios. Por eso vive en su propio archivo y se carga el primero: si
   un bloqueador tumba la analítica, las propuestas siguen guardándose.

   El token solo puede añadir filas. Está a la vista a propósito.
   --------------------------------------------------------------- */

(function () {
  "use strict";

  var API   = "https://api.europe-west2.gcp.tinybird.co";
  var TOKEN = "p.eyJ1IjogIjAwNzIwOGFjLTIyMmQtNGNkNi04NmIxLTVkZmM0OTNmZDgxYSIsICJpZCI6ICJlZmExMGVmMC1mMzk5LTQ5ODYtYTFiOC1kNGEyYTU2YWFlMzUiLCAiaG9zdCI6ICJnY3AtZXVyb3BlLXdlc3QyIn0.iPqeCsgn-Gz7R9dAKWJ-FhBSOSD0bH6TkNgAO7L9MH4";

  /* Las pruebas en local no ensucian los datos de verdad. */
  var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) ||
              location.protocol === "file:";

  /* Un identificador que vive lo que la pestaña: ni cookie, ni permanente,
     ni compartido entre sitios. Sirve para no contar diez veces a la misma
     persona; al cerrar la pestaña, desaparece. */
  var sesion = (function () {
    var clave = "cl_sesion";
    var nuevo = (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : String(Date.now()) + "-" + Math.random().toString(36).slice(2);
    try {
      var guardado = sessionStorage.getItem(clave);
      if (guardado) return guardado;
      sessionStorage.setItem(clave, nuevo);
    } catch (e) { /* modo privado: se usa el de memoria */ }
    return nuevo;
  })();

  function ahora() {
    return new Date().toISOString().replace("T", " ").slice(0, 23);
  }

  /* Devuelve una promesa: quien llama decide qué hacer si no sale.
     El token viaja en la URL y no en una cabecera a propósito: así el
     navegador no tiene que pedir permiso antes (CORS) y no se pierden
     envíos cuando la página se está cerrando. */
  function mandar(fuente, fila, opciones) {
    if (!API || !TOKEN) return Promise.reject(new Error("sin configurar"));
    if (local) return Promise.reject(new Error("en local no se manda"));

    fila = fila || {};
    if (!fila.timestamp) fila.timestamp = ahora();
    if (!fila.session_id) fila.session_id = sesion;

    return fetch(
      API.replace(/\/+$/, "") + "/v0/events?name=" + encodeURIComponent(fuente) +
      "&token=" + encodeURIComponent(TOKEN),
      {
        method: "POST",
        body: JSON.stringify(fila),
        /* keepalive deja terminar la petición aunque la página se cierre.
           En las propuestas no se usa: son grandes y conviene esperar la
           respuesta para saber si se guardó. */
        keepalive: !(opciones && opciones.esperar),
        mode: "cors",
        headers: { "Content-Type": "text/plain" }
      }
    ).then(function (r) {
      if (!r.ok) throw new Error("Tinybird respondió " + r.status);
      return r;
    });
  }

  window.TB = { mandar: mandar, sesion: sesion, activo: !local && !!TOKEN };
})();

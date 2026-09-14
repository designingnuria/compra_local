/* ---------------------------------------------------------------
   Consume Local — analítica en Tinybird.

   Manda eventos al Events API de Tinybird. Sin cookies, sin perfiles,
   sin terceros más allá del propio Tinybird, y sin nada que identifique
   a una persona: ni IP guardada por nosotros, ni huella del navegador.

   Mientras TOKEN esté vacío, este archivo no hace absolutamente nada,
   así que se puede subir a producción sin configurar.

   Para ponerlo en marcha hacen falta dos datos del workspace de Tinybird
   (Workspace → ... → Copy API host, y Tokens → el token de escritura):

       API      el host de tu región, p. ej. https://api.europe-west2.gcp.tinybird.co
       TOKEN    un token con permiso SOLO de append sobre el Data Source

   El token queda a la vista en el código de la página: es así a propósito y
   es como funciona el kit de analítica web de Tinybird. Por eso tiene que ser
   de append y nada más. Con un token de admin ahí, cualquiera podría leer o
   borrar los datos del workspace.
   --------------------------------------------------------------- */

(function () {
  "use strict";

  var API    = "https://api.europe-west2.gcp.tinybird.co";
  var TOKEN  = "";                   // token de append, no de admin
  var FUENTE = "analytics_events";   // nombre del Data Source
  var VERSION = "1";

  /* -------------------------------------------------- cuándo no medir */

  /* Sin configurar no se hace nada: el archivo puede estar subido y en paz. */
  if (!API || !TOKEN) return;

  /* Si el navegador pide no ser rastreado, se respeta y punto. */
  var nav = window.navigator || {};
  if (nav.doNotTrack === "1" || nav.globalPrivacyControl === true) return;

  /* Las pruebas en local no ensucian los datos de verdad. */
  var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  if (local || location.protocol === "file:") return;

  /* --------------------------------------------------------- sesión */

  /* Un identificador que vive lo que la pestaña: ni cookie, ni permanente,
     ni compartido entre sitios. Sirve para no contar diez veces a la misma
     persona; cuando cierra la pestaña, desaparece. */
  var sesion = (function () {
    var clave = "cl_sesion";
    var nuevo = (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : String(Date.now()) + "-" + Math.random().toString(36).slice(2);
    try {
      var guardado = sessionStorage.getItem(clave);
      if (guardado) return guardado;
      sessionStorage.setItem(clave, nuevo);
    } catch (e) {
      /* Modo privado o almacenamiento bloqueado: se usa y ya está. */
    }
    return nuevo;
  })();

  /* --------------------------------------------------------- envío */

  var destino = API.replace(/\/+$/, "") +
    "/v0/events?name=" + encodeURIComponent(FUENTE) +
    "&token=" + encodeURIComponent(TOKEN);

  function mandar(accion, datos) {
    var fila = JSON.stringify({
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 23),
      action: accion,
      version: VERSION,
      session_id: sesion,
      payload: JSON.stringify(datos || {})
    });

    try {
      /* keepalive deja que la petición termine aunque la página se cierre,
         que es justo lo que pasa al pulsar el enlace de un negocio. El token
         va en la URL y no en una cabecera a propósito: así el navegador no
         tiene que pedir permiso antes (CORS) y no se pierden eventos. */
      fetch(destino, {
        method: "POST",
        body: fila,
        keepalive: true,
        mode: "cors",
        headers: { "Content-Type": "text/plain" }
      }).catch(function () {});
    } catch (e) {
      /* Que la analítica falle no puede romper la web. */
    }
  }

  /* ---------------------------------------------------- qué se mide */

  /* 1. La visita. */
  mandar("page_hit", {
    "user-agent": nav.userAgent,
    locale: nav.language,
    referrer: document.referrer || "",
    pathname: location.pathname,
    href: location.href
  });

  var $ = function (sel) { return document.querySelector(sel); };

  /* 2. Las búsquedas, con cuántos resultados salieron. Es el dato más útil
        de todos: lo que la gente busca y no encuentra dice qué negocios
        faltan en el directorio. */
  var q = $("#q");
  var contador = $("#count");
  if (q) {
    var reloj;
    var ultima = "";
    q.addEventListener("input", function () {
      clearTimeout(reloj);
      reloj = setTimeout(function () {
        var texto = q.value.trim();
        /* Se espera a que deje de teclear: si no, «quesos» manda seis eventos. */
        if (texto.length < 3 || texto === ultima) return;
        ultima = texto;
        var n = contador ? parseInt(contador.textContent, 10) : NaN;
        mandar("busqueda", {
          termino: texto.slice(0, 80),
          resultados: isNaN(n) ? null : n
        });
      }, 1500);
    });
  }

  /* 3. Qué categorías se filtran. */
  var chips = $("#chips");
  if (chips) {
    chips.addEventListener("click", function (ev) {
      var chip = ev.target.closest ? ev.target.closest(".chip") : null;
      if (!chip) return;
      mandar("filtro", { categoria: chip.dataset.cat || "todo" });
    });
  }

  /* 4. Los clics hacia la web o el Instagram de un negocio. Esto es lo que
        de verdad mide si el directorio sirve para algo. */
  var rejilla = $("#grid");
  if (rejilla) {
    rejilla.addEventListener("click", function (ev) {
      var enlace = ev.target.closest ? ev.target.closest("a[href]") : null;
      if (!enlace) return;
      var ficha = enlace.closest(".card");
      mandar("negocio", {
        id: ficha ? ficha.dataset.id : null,
        destino: /instagram\.com/.test(enlace.href) ? "instagram" : "web"
      });
    });
  }

  /* 5. Las propuestas enviadas. Se detecta mirando cuándo aparece el aviso
        de "enviada", para no tener que tocar el código del formulario. */
  var ok = $("#form-ok");
  if (ok && window.MutationObserver) {
    new MutationObserver(function () {
      if (!ok.hidden) mandar("propuesta", {});
    }).observe(ok, { attributes: true, attributeFilter: ["hidden"] });
  }
})();

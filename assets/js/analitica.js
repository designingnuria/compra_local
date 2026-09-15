/* ---------------------------------------------------------------
   Consume Local — analítica.

   Qué se mide y qué no: la visita, las búsquedas con su número de
   resultados, los filtros, los clics hacia cada negocio y las propuestas.
   Sin cookies, sin perfiles, sin nada que identifique a una persona.

   El envío en sí no está aquí: lo comparte con el formulario en
   assets/js/enviar.js, que se carga antes. Así el token vive en un solo
   sitio y, si un bloqueador tumba este archivo, las propuestas de negocios
   se siguen guardando.
   --------------------------------------------------------------- */

(function () {
  "use strict";

  var VERSION = "1";

  /* El envío vive en enviar.js, que se carga antes y lo comparte con el
     formulario de propuestas. Si un bloqueador tumba este archivo, las
     propuestas se siguen guardando igual. */
  if (!window.TB || !window.TB.activo) return;

  var nav = window.navigator || {};

  /* Si el navegador pide no ser rastreado, se respeta y punto. Esto vale
     para la analítica; una propuesta que alguien escribe a propósito no es
     rastreo y se guarda igualmente. */
  if (nav.doNotTrack === "1" || nav.globalPrivacyControl === true) return;

  function mandar(accion, datos) {
    try {
      window.TB.mandar("analytics_events", {
        action: accion,
        version: VERSION,
        payload: JSON.stringify(datos || {})
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

  /* 6. El botón de proponer que sale cuando una búsqueda no encuentra nada.
        Comparado con las búsquedas sin resultados, dice qué parte de la gente
        que no encuentra lo suyo se molesta en contarlo. */
  var botonVacio = $("#empty-proponer");
  if (botonVacio && q) {
    botonVacio.addEventListener("click", function () {
      mandar("proponer_desde_vacio", { termino: q.value.trim().slice(0, 80) });
    });
  }

  /* 7. Y las que NO salen. Si el envío falla, la persona ve el panel de
        rescate; que quede registrado, porque un formulario roto en silencio
        es peor que no tener formulario. */
  var falloPanel = $("#form-hecho");
  if (falloPanel && window.MutationObserver) {
    new MutationObserver(function () {
      if (!falloPanel.hidden) mandar("propuesta_fallida", {});
    }).observe(falloPanel, { attributes: true, attributeFilter: ["hidden"] });
  }
})();

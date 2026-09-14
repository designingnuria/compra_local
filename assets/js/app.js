/* ---------------------------------------------------------------
   Compra Local — lógica del directorio.

   Sin dependencias ni paso de compilación: se lee `data/negocios.js`
   y se pinta todo aquí. El estado de los filtros vive en la URL, así
   que cualquier búsqueda se puede compartir tal cual.
   --------------------------------------------------------------- */

(function () {
  "use strict";

  var $ = function (sel) { return document.querySelector(sel); };

  var els = {
    q: $("#q"),
    qClear: $("#q-clear"),
    chips: $("#chips"),
    barrio: $("#barrio"),
    orden: $("#orden"),
    reset: $("#reset"),
    count: $("#count"),
    grid: $("#grid"),
    empty: $("#empty"),
    heroCount: $("#hero-count"),
    controles: $(".controls"),
    centinela: $("#centinela")
  };

  var estado = { q: "", categoria: "", barrio: "", orden: "relevancia" };

  /* Orden aleatorio estable durante toda la visita: si se recalculara en
     cada tecla, las tarjetas bailarían mientras escribes. */
  var semilla = NEGOCIOS.map(function (n) { return n.id; })
    .sort(function () { return Math.random() - 0.5; });

  var catPorId = {};
  CATEGORIAS.forEach(function (c) { catPorId[c.id] = c; });

  /* ------------------------------------------------------- utilidades */

  function normalizar(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function escapar(texto) {
    return String(texto)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escaparRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /* Resalta los términos buscados respetando tildes: se busca sobre el
     texto normalizado y se recortan los tramos del texto original. */
  function resaltar(texto, terminos) {
    var seguro = escapar(texto);
    if (!terminos.length) return seguro;

    var plano = normalizar(texto);
    var tramos = [];

    terminos.forEach(function (t) {
      var re = new RegExp(escaparRegex(t), "g");
      var m;
      while ((m = re.exec(plano)) !== null) {
        tramos.push([m.index, m.index + t.length]);
        if (re.lastIndex === m.index) re.lastIndex++;
      }
    });
    if (!tramos.length) return seguro;

    tramos.sort(function (a, b) { return a[0] - b[0]; });

    var fusionados = [tramos[0]];
    for (var i = 1; i < tramos.length; i++) {
      var ultimo = fusionados[fusionados.length - 1];
      if (tramos[i][0] <= ultimo[1]) {
        ultimo[1] = Math.max(ultimo[1], tramos[i][1]);
      } else {
        fusionados.push(tramos[i]);
      }
    }

    var salida = "";
    var cursor = 0;
    fusionados.forEach(function (tramo) {
      salida += escapar(texto.slice(cursor, tramo[0]));
      salida += "<mark>" + escapar(texto.slice(tramo[0], tramo[1])) + "</mark>";
      cursor = tramo[1];
    });
    return salida + escapar(texto.slice(cursor));
  }

  /* El índice se guarda troceado por campos, no como un único texto, para
     poder puntuar después según dónde aparezca cada palabra: no vale lo
     mismo acertar en el nombre que en mitad de la descripción. */
  function partesDe(negocio) {
    if (!negocio._partes) {
      var cat = catPorId[negocio.categoria] || {};
      var partes = {
        nombre: normalizar(negocio.nombre),
        etiquetas: normalizar((negocio.etiquetas || []).join(" ")),
        categoria: normalizar(cat.nombre),
        lugar: normalizar([negocio.barrio, negocio.direccion].filter(Boolean).join(" ")),
        descripcion: normalizar(negocio.descripcion),
        sinonimos: normalizar((cat.sinonimos || []).join(" "))
      };
      partes.todo = [
        partes.nombre, partes.etiquetas, partes.categoria,
        partes.lugar, partes.descripcion, partes.sinonimos
      ].join(" ");
      negocio._partes = partes;
    }
    return negocio._partes;
  }

  var PESOS = [
    ["nombre", 100],
    ["etiquetas", 30],
    ["categoria", 20],
    ["lugar", 15],
    ["descripcion", 10],
    ["sinonimos", 5]
  ];

  function puntuar(negocio, terminos) {
    var partes = partesDe(negocio);
    var total = 0;
    terminos.forEach(function (t) {
      for (var i = 0; i < PESOS.length; i++) {
        if (partes[PESOS[i][0]].indexOf(t) !== -1) {
          total += PESOS[i][1];
          break; // solo cuenta el campo de más peso donde aparece
        }
      }
      // Acertar el nombre entero, o el principio de una palabra, pesa más.
      if (partes.nombre === t) total += 60;
      else if (new RegExp("(^| )" + escaparRegex(t)).test(partes.nombre)) total += 25;
    });
    return total;
  }

  function enlaceMapa(negocio) {
    var consulta = [negocio.nombre, negocio.direccion, negocio.barrio, "Madrid"]
      .filter(Boolean).join(", ");
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(consulta);
  }

  /* ---------------------------------------------------------- filtrado */

  /* Palabras que la gente escribe sin pensar («una tienda de quesos») y que, al
     exigirse todas, dejarían la búsqueda a cero. Además de preposiciones y
     artículos, van aquí los genéricos que no distinguen nada en un directorio
     donde absolutamente todo es una tienda. */
  var VACIAS = ["de", "del", "la", "el", "los", "las", "un", "una", "unos", "unas",
    "y", "o", "en", "con", "para", "por", "al", "a", "que", "donde", "me", "mi", "su",
    "tienda", "tiendas", "sitio", "sitios", "local", "locales", "negocio", "negocios",
    "comprar", "compro", "busco", "quiero"];

  function terminos() {
    var brutos = normalizar(estado.q).split(/\s+/).filter(Boolean);
    var utiles = brutos.filter(function (t) {
      return VACIAS.indexOf(t) === -1 && t.length > 1;
    });
    // Si al limpiar no queda nada («de», «la»), se busca lo que se escribió.
    return utiles.length ? utiles : brutos;
  }

  function filtrar() {
    var ts = terminos();

    var lista = NEGOCIOS.filter(function (n) {
      if (estado.categoria && n.categoria !== estado.categoria) return false;
      if (estado.barrio && n.barrio !== estado.barrio) return false;
      var todo = partesDe(n).todo;
      return ts.every(function (t) { return todo.indexOf(t) !== -1; });
    });

    var porNombre = function (a, b) { return a.nombre.localeCompare(b.nombre, "es"); };

    if (estado.orden === "azar") {
      lista.sort(function (a, b) {
        return semilla.indexOf(a.id) - semilla.indexOf(b.id);
      });
    } else if (estado.orden === "antiguos") {
      lista.sort(function (a, b) {
        var da = a.desde || Infinity;
        var db = b.desde || Infinity;
        return da !== db ? da - db : porNombre(a, b);
      });
    } else if (estado.orden === "relevancia" && ts.length) {
      lista.sort(function (a, b) {
        var d = puntuar(b, ts) - puntuar(a, ts);
        return d !== 0 ? d : porNombre(a, b);
      });
    } else {
      lista.sort(porNombre);
    }

    return lista;
  }

  /* ---------------------------------------------------------- pintado */

  var ICONO_WEB =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/></svg>';
  var ICONO_MAPA =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
    '<path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
  var ICONO_IG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
    '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/>' +
    '<circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>';

  function tarjeta(negocio, ts) {
    var cat = catPorId[negocio.categoria];
    var li = document.createElement("li");
    li.className = "card";

    var html = '<div class="card__top">' +
      '<h3 class="card__name">' + resaltar(negocio.nombre, ts) + "</h3>";
    if (negocio.desde) {
      html += '<span class="card__since" title="Abierto desde ' + negocio.desde + '">' +
        negocio.desde + "</span>";
    } else if (negocio.verificado === false) {
      html += '<span class="card__since" title="Datos pendientes de comprobar">por confirmar</span>';
    }
    html += "</div>";

    html += '<p class="card__cat">' +
      (cat ? '<span aria-hidden="true">' + cat.icono + "</span> " + escapar(cat.nombre) : "") +
      "</p>";

    html += '<p class="card__desc">' + resaltar(negocio.descripcion, ts) + "</p>";

    var donde = negocio.direccion
      ? resaltar(negocio.direccion, ts) + " <span>· " + resaltar(negocio.barrio, ts) + "</span>"
      : "<span>" + resaltar(negocio.barrio, ts) + "</span>";
    html += '<p class="card__where">' + donde + "</p>";

    if (negocio.etiquetas && negocio.etiquetas.length) {
      html += '<ul class="card__tags">' +
        negocio.etiquetas.map(function (t) { return "<li>" + resaltar(t, ts) + "</li>"; }).join("") +
        "</ul>";
    }

    html += '<div class="card__links">';
    if (negocio.web) {
      html += '<a href="' + escapar(negocio.web) + '" target="_blank" rel="noopener noreferrer">' +
        ICONO_WEB + "Web</a>";
    }
    if (negocio.instagram) {
      html += '<a href="https://instagram.com/' + escapar(negocio.instagram) +
        '" target="_blank" rel="noopener noreferrer">' + ICONO_IG + "Instagram</a>";
    }
    html += '<a href="' + escapar(enlaceMapa(negocio)) + '" target="_blank" rel="noopener noreferrer">' +
      ICONO_MAPA + "Cómo llegar</a>";
    html += "</div>";

    li.innerHTML = html;
    return li;
  }

  function pintar() {
    var lista = filtrar();
    var ts = terminos();

    els.grid.innerHTML = "";
    var fragmento = document.createDocumentFragment();
    lista.forEach(function (n) { fragmento.appendChild(tarjeta(n, ts)); });
    els.grid.appendChild(fragmento);

    els.empty.hidden = lista.length > 0;
    els.count.textContent = lista.length === 0
      ? "Ningún negocio"
      : lista.length === 1 ? "1 negocio" : lista.length + " negocios";

    var hayFiltros = !!(estado.q || estado.categoria || estado.barrio);
    els.reset.hidden = !hayFiltros;
    els.qClear.hidden = !estado.q;

    actualizarContadoresChips();
    guardarEnURL();
  }

  /* --------------------------------------------------------- controles */

  function construirChips() {
    var frag = document.createDocumentFragment();

    var todos = document.createElement("button");
    todos.type = "button";
    todos.className = "chip";
    todos.dataset.cat = "";
    todos.setAttribute("aria-pressed", "true");
    todos.innerHTML = 'Todo <span class="chip__n">' + NEGOCIOS.length + "</span>";
    frag.appendChild(todos);

    CATEGORIAS.forEach(function (c) {
      var n = NEGOCIOS.filter(function (x) { return x.categoria === c.id; }).length;
      if (!n) return; // no mostramos categorías todavía vacías
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.dataset.cat = c.id;
      b.setAttribute("aria-pressed", "false");
      b.innerHTML = '<span aria-hidden="true">' + c.icono + "</span> " + escapar(c.nombre) +
        ' <span class="chip__n">' + n + "</span>";
      frag.appendChild(b);
    });

    els.chips.appendChild(frag);

    ajustarChips();
    els.chips.addEventListener("scroll", marcarBordesChips, { passive: true });
    window.addEventListener("resize", ajustarChips);

    /* El centinela va justo encima de la barra: en cuanto sale por arriba,
       sabemos que la barra se ha quedado pegada y toca recoger las categorías. */
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entradas) {
        pegada = !entradas[0].isIntersecting;
        ajustarChips();
      }).observe(els.centinela);
    }

    els.chips.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      estado.categoria = chip.dataset.cat === estado.categoria ? "" : chip.dataset.cat;
      pintar();
    });
  }

  var pegada = false;

  function ajustarChips() {
    var tira = pegada || window.innerWidth <= 760;
    els.chips.classList.toggle("es-tira", tira);
    if (!tira) els.chips.removeAttribute("data-borde");
    else marcarBordesChips();
  }

  /* Cuando las categorías van en una tira, el degradado de los extremos avisa
     de que hay más fuera de la pantalla. */
  function marcarBordesChips() {
    var el = els.chips;
    var sobra = el.scrollWidth - el.clientWidth;
    if (sobra <= 1) { el.removeAttribute("data-borde"); return; }
    var bordes = [];
    if (el.scrollLeft > 4) bordes.push("izquierda");
    if (el.scrollLeft < sobra - 4) bordes.push("derecha");
    el.setAttribute("data-borde", bordes.join(" "));
  }

  /* Los contadores reflejan lo que quedaría al pulsar cada categoría,
     teniendo en cuenta el texto buscado y el barrio elegido. */
  function actualizarContadoresChips() {
    var ts = terminos();
    var base = NEGOCIOS.filter(function (n) {
      if (estado.barrio && n.barrio !== estado.barrio) return false;
      var todo = partesDe(n).todo;
      return ts.every(function (t) { return todo.indexOf(t) !== -1; });
    });

    Array.prototype.forEach.call(els.chips.children, function (chip) {
      var cat = chip.dataset.cat;
      var n = cat ? base.filter(function (x) { return x.categoria === cat; }).length : base.length;
      chip.querySelector(".chip__n").textContent = n;
      chip.setAttribute("aria-pressed", String(cat === estado.categoria));
      chip.disabled = n === 0 && cat !== estado.categoria;
      chip.style.opacity = chip.disabled ? ".45" : "";
    });
  }

  function construirBarrios() {
    var barrios = NEGOCIOS.map(function (n) { return n.barrio; })
      .filter(function (b, i, arr) { return b && arr.indexOf(b) === i; })
      .sort(function (a, b) { return a.localeCompare(b, "es"); });

    els.barrio.innerHTML = '<option value="">Todos</option>' +
      barrios.map(function (b) {
        return '<option value="' + escapar(b) + '">' + escapar(b) + "</option>";
      }).join("");
  }

  /* --------------------------------------------------------- URL */

  function leerDeURL() {
    var p = new URLSearchParams(location.search);
    estado.q = p.get("q") || "";
    estado.categoria = catPorId[p.get("cat")] ? p.get("cat") : "";
    estado.barrio = p.get("barrio") || "";
    var orden = p.get("orden");
    if (["alfabetico", "antiguos", "azar"].indexOf(orden) !== -1) estado.orden = orden;

    els.q.value = estado.q;
    els.barrio.value = estado.barrio;
    els.orden.value = estado.orden;

    // Si el barrio de la URL ya no existe, el select vuelve a "Todos".
    if (els.barrio.value !== estado.barrio) estado.barrio = "";
  }

  function guardarEnURL() {
    var p = new URLSearchParams();
    if (estado.q) p.set("q", estado.q);
    if (estado.categoria) p.set("cat", estado.categoria);
    if (estado.barrio) p.set("barrio", estado.barrio);
    if (estado.orden !== "relevancia") p.set("orden", estado.orden);
    var qs = p.toString();
    history.replaceState(null, "", qs ? "?" + qs : location.pathname);
  }

  /* --------------------------------------------------------- eventos */

  function conRetardo(fn, ms) {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, ms);
    };
  }

  function enlazarEventos() {
    els.q.addEventListener("input", conRetardo(function () {
      estado.q = els.q.value.trim();
      pintar();
    }, 120));

    els.q.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && els.q.value) {
        els.q.value = "";
        estado.q = "";
        pintar();
      }
    });

    els.qClear.addEventListener("click", function () {
      els.q.value = "";
      estado.q = "";
      els.q.focus();
      pintar();
    });

    els.barrio.addEventListener("change", function () {
      estado.barrio = els.barrio.value;
      pintar();
    });

    els.orden.addEventListener("change", function () {
      estado.orden = els.orden.value;
      pintar();
    });

    els.reset.addEventListener("click", function () {
      estado.q = "";
      estado.categoria = "";
      estado.barrio = "";
      els.q.value = "";
      els.barrio.value = "";
      pintar();
      els.q.focus();
    });

    // "/" enfoca el buscador, como en tantas webs de documentación.
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== els.q) {
        e.preventDefault();
        els.q.focus();
        els.q.select();
      }
    });
  }

  /* ---------------------------------------------------------- arranque */

  els.heroCount.textContent = NEGOCIOS.length;
  construirChips();
  construirBarrios();
  leerDeURL();
  enlazarEventos();
  pintar();
})();

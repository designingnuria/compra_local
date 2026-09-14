# Consume Local

Directorio de **223 tiendas y talleres independientes de Madrid**. Sin franquicias ni cadenas:
solo negocios pequeños, regentados por la gente que los levantó, donde las cosas se hacen
despacio y con cariño.

Desde una quesería a una librería de poesía, pasando por el taller donde te enmarcan un cuadro.

## Qué hay

- **Buscador** por nombre, oficio, barrio o etiqueta, insensible a mayúsculas y tildes
  (buscar `panaderia` encuentra «Panadería»).
- Encuentra por **la raíz de la palabra**: buscar «encuadernar» da con los talleres que se
  anuncian como «encuadernación», y «zapatería» con los que dicen «zapatero». La raíz solo
  cuenta al principio de una palabra, para que «cuaderno» no acabe sacando encuadernadores.
- Entiende **frases sueltas**: «busco un sitio para enmarcar cuadros» encuentra los tres
  talleres de enmarcación aunque ninguno use ese verbo. Cada categoría tiene una lista de
  sinónimos y las palabras de relleno («una», «para», «tienda») se descartan.
- Resultados **ordenados por relevancia**: acertar en el nombre pesa más que aparecer de
  pasada en una descripción.
- **Filtros** por categoría y por barrio, con contadores que se actualizan solos.
- **Orden** alfabético, por antigüedad del negocio o aleatorio, para descubrir sin buscar.
- **Fichas** con nombre, descripción, categoría, barrio, dirección, web y enlace al mapa.
- Los filtros viven en la URL, así que cualquier búsqueda se puede compartir tal cual.
- **Formulario para proponer negocios** que se envía solo, sin abrirle a nadie el programa de
  correo. Si el envío falla, enseña el texto para copiarlo y no perder la propuesta.
- Modo claro y oscuro, sin cookies ni rastreo.
- **Pensada para el móvil**, que es desde donde se mira casi siempre: el buscador se queda
  fijo arriba, las fichas se pintan de veinticuatro en veinticuatro según bajas y las fuentes
  no bloquean el pintado.

## Cómo se usa

No hay nada que instalar ni compilar. Abre `index.html` en el navegador y ya está.

Si prefieres servirlo por HTTP:

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000
```

Si usas `npx http-server`, añádele `-c-1`. Por defecto manda cabeceras de caché de una
hora y acabas probando el JavaScript de hace tres cambios sin enterarte.

## Estructura

```
index.html              La página entera
assets/css/styles.css   Estilos, con paleta en variables CSS
assets/js/app.js        Buscador, filtros y pintado de tarjetas
data/negocios.js        LA BASE DE DATOS. Aquí se añaden negocios
scripts/validar.js      Comprueba que los datos están bien antes de subirlos
scripts/revisar.js      Genera REVISAR.md: qué negocios toca comprobar
scripts/construir.js    Empaqueta todo en un único archivo HTML (opcional)
vercel.json             Cabeceras de caché para el despliegue
```

Todo es HTML, CSS y JavaScript sin dependencias. Se puede publicar tal cual en GitHub Pages,
Netlify, Vercel o cualquier hosting estático.

## De dónde salen los datos

Buena parte del directorio está contrastada con el **listado de comercios centenarios del
Portal de Datos Abiertos del Ayuntamiento de Madrid**: 67 fichas salen de ahí con su dirección,
su año de apertura y su coordenada oficiales, y otras 21 que ya estaban se han corregido con esa
fuente. Al cruzarlas aparecieron errores que arrastrábamos: Casa Hernanz no abrió en 1845 sino
en 1840, Casa Yustas no en 1894 sino en 1886, y la Rejillería López lleva desde 1877, no 1911.

El resto son fichas reunidas a mano, cada una con su campo `verificado` diciendo si se ha
comprobado o no. La procedencia se cita en el pie de la web, como pide la licencia de reutilización
del portal.

Del registro oficial se dejaron fuera a propósito los bares y restaurantes, los hoteles, las
farmacias, las administraciones de lotería y las asociaciones profesionales, además de las
marcas grandes que aparecen en él (Loewe, Casa del Libro, Mahou, Telefónica). Nada de eso
encaja con los criterios.

Las fichas guardan la coordenada en `coords` aunque ahora mismo no se dibuje ningún mapa: son
datos costosos de reunir y estarán ahí el día que el mapa vuelva.

## Rendimiento en móvil

Medido con la CPU a un cuarto de velocidad y 3G rápida, que es lo que tiene un móvil de gama
media. Antes y después de la optimización:

| | antes | después |
|---|---|---|
| Primer pintado (con las fuentes lentas) | 13,0 s | 0,7 s |
| Nodos del DOM | 5.016 | 1.269 |
| Alto del documento | 89.700 px | 22.700 px |
| Repintado al teclear | 1.198 ms | ~180 ms |

Tres cambios lo explican:

- **Las fuentes no bloquean el pintado.** La hoja de Google Fonts se carga con
  `media="print"` y se activa al terminar. Si Google va lento o falla, la página sale con la
  tipografía de reserva en vez de quedarse en blanco. Esto solo valía trece segundos.
- **Las fichas se pintan por tandas** de veinticuatro, y el resto llegan según bajas. Construir
  las 229 en cada tecla era lo que costaba más de un segundo.
- **`content-visibility: auto`** en las fichas: el navegador se salta la maquetación y el
  pintado de lo que queda fuera de pantalla. Ojo con `contain-intrinsic-size`, que aplica la
  medida a los dos ejes; aquí hay que fijar solo la altura o las fichas se salen de la pantalla.

## El formulario de propuestas

Las propuestas se envían a través de [FormSubmit](https://formsubmit.co), que reenvía el
formulario al correo del directorio. No hace falta registrarse, pero **sí hay que activarlo una
vez**: con la primera propuesta que llegue, FormSubmit manda un correo de activación a la
dirección de destino; se pulsa el enlace y ya queda funcionando para siempre.

Está montado para poder cambiarlo sin dolor. En `assets/js/app.js`:

```js
var ENVIO_URL = "https://formsubmit.co/ajax/" + DESTINO;
```

Cambiando esa línea (y como mucho el cuerpo de `enviar()`) se pasa a Formspree, Web3Forms o a
una función propia en Vercel. Si la petición falla por lo que sea, el formulario no pierde lo
escrito: enseña el texto para copiarlo y un enlace de correo.

Hay un campo trampa oculto para los robots: si viene relleno, la propuesta se descarta sin
enviar nada y sin decírselo al robot.

## Publicar la web

Es una web estática: sirve cualquier hosting sin configurar nada.

Está publicada en **Vercel**, que despliega sola con cada push a `main`. No hay nada que
configurar: no hay framework ni comando de build, y `vercel.json` ya trae las cabeceras de caché.

Si alguna vez hay que rehacerlo, en [vercel.com/new](https://vercel.com/new) se importa el
repositorio y se le da a *Deploy*. Si no aparece en la lista, es que la app de Vercel en GitHub
solo tiene acceso a algunos repositorios: se arregla desde *Adjust GitHub App Permissions*.

Netlify, Cloudflare Pages o GitHub Pages funcionan igual de bien con el mismo repositorio.

## Añadir un negocio

Desde la propia web hay un formulario que compone el correo con la propuesta. Para añadirlo al
directorio se edita `data/negocios.js`:

```js
{
  id: "queseria-cultivo",
  nombre: "Quesería Cultivo",
  categoria: "alimentacion",
  descripcion: "Quesos artesanos de pequeños productores con nombre y apellidos...",
  barrio: "Conde Duque",
  direccion: "C/ del Conde Duque, 15",
  web: "https://queseriacultivo.com",
  desde: 2014,
  etiquetas: ["quesos", "catas", "artesano"],
  verificado: true
}
```

Después, comprobar que no se ha roto nada:

```bash
node scripts/validar.js
```

Los criterios de qué entra y qué no están en [CONTRIBUTING.md](CONTRIBUTING.md).

## Sobre la fiabilidad de los datos

Cada ficha lleva dos campos que dicen cuánto fiarse de ella:

- **`verificado`** — si los datos (dirección, año, web) se han contrastado con una fuente
  fiable. Las fichas con `verificado: false` aparecen marcadas como **«por confirmar»** en la web.
- **`revisado`** — el mes en que alguien comprobó por última vez que el negocio **sigue
  abierto**. Son cosas distintas: una dirección puede estar perfectamente contrastada y
  corresponder a un local que cerró el año pasado.

De las 206 fichas, 156 están verificadas y solo 3 tienen comprobación reciente de apertura.

### Revisar los cierres

```bash
node scripts/revisar.js   # genera REVISAR.md
```

Produce una lista ordenada por urgencia con un enlace de Google Maps por negocio. Se abre,
se mira si sigue abierto y se anota `revisado: "AAAA-MM"` en la ficha; si ha cerrado, se borra.

### Por qué hace falta

El comercio de barrio cierra constantemente, y una ficha de un negocio cerrado es peor que no
tener ficha. **El registro de comercios centenarios del Ayuntamiento no sirve para esto: es un
archivo histórico, no un listado de quién sigue abierto.** Al repasarlo aparecieron cinco
comercios que ya habían cerrado y que estaban publicados aquí:

| Negocio | Cerró |
|---|---|
| Papelería Salazar | verano de 2020, tras 115 años |
| Madrid Cómics | febrero de 2022 |
| Cerería Víctor Ortega | 31 de diciembre de 2024, la última cerería artesanal de Madrid |
| Bazar Arribas | 31 de marzo de 2026 |
| Tejidos Bober | 2026, tras casi dos siglos |

Discos La Metralleta sigue abierta pero anunció que dejaba el centro, así que se le ha quitado
la dirección hasta confirmar dónde está.

## Hacia dónde puede ir

Ideas que quedan pendientes, por orden de utilidad:

- [ ] Comprobar en Google Maps las 220 fichas sin revisar (`node scripts/revisar.js`).
- [ ] Verificar las 56 fichas que están «por confirmar».
- [ ] Recuperar la vista de mapa. Ya hay 88 fichas con coordenada exacta, así que esta vez
      puede ser un mapa de calles de verdad y no un esquema de barrios.
- [ ] Mapa con todos los negocios situados.
- [ ] Página propia por negocio, con fotos y horarios.
- [ ] Formulario para proponer negocios sin pasar por GitHub.
- [ ] Abrir a otras ciudades, cuando Madrid esté bien cubierto.

## Licencia

Código bajo licencia MIT. Los datos del directorio se pueden reutilizar libremente
citando el proyecto.

# Consume Local

Directorio de **206 tiendas y talleres independientes de Madrid**. Sin franquicias ni cadenas:
solo negocios pequeños, regentados por la gente que los levantó, donde las cosas se hacen
despacio y con cariño.

Desde una quesería a una librería de poesía, pasando por el taller donde te enmarcan un cuadro.

## Qué hay

- **Buscador** por nombre, oficio, barrio o etiqueta, insensible a mayúsculas y tildes
  (buscar `panaderia` encuentra «Panadería»).
- Encuentra por **la raíz de la palabra**: buscar «encuadernar» da con los talleres que se
  anuncian como «encuadernación», y «zapatería» con los que dicen «zapatero».
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
- Modo claro y oscuro, responsive, sin cookies ni rastreo.

## Cómo se usa

No hay nada que instalar ni compilar. Abre `index.html` en el navegador y ya está.

Si prefieres servirlo por HTTP:

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000
```

## Estructura

```
index.html              La página entera
assets/css/styles.css   Estilos, con paleta en variables CSS
assets/js/app.js        Buscador, filtros y pintado de tarjetas
data/negocios.js        LA BASE DE DATOS. Aquí se añaden negocios
scripts/validar.js      Comprueba que los datos están bien antes de subirlos
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

**Vercel** (recomendado). En [vercel.com/new](https://vercel.com/new) se importa el repositorio
y se le da a *Deploy*. No hay que tocar ningún ajuste: no hay framework ni comando de build, y
`vercel.json` ya trae las cabeceras de caché. A partir de ahí, cada push actualiza la web sola
y se le puede enchufar un dominio propio.

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

Cada ficha tiene un campo `verificado`. Está en `true` solo cuando los datos se han
contrastado con una fuente fiable (la web del propio negocio, el registro de comercios
centenarios del Ayuntamiento o una fuente periodística reciente). Las fichas con
`verificado: false` aparecen marcadas como **«por confirmar»** en la web.

De las 206 fichas, 157 están verificadas y 49 siguen pendientes.
El comercio de barrio cierra y se muda más de lo que nos gustaría —mientras se montaba
este directorio, Tipos Infames anunció su cierre tras quince años en Malasaña, y El
Flamenco Vive ya no está en la calle donde muchas guías lo siguen situando—, así que
conviene revisar las fichas de vez en cuando. Si ves un dato equivocado o un cierre,
corrígelo: es la contribución más valiosa que se puede hacer aquí.

## Hacia dónde puede ir

Ideas que quedan pendientes, por orden de utilidad:

- [ ] Verificar las 49 fichas que están «por confirmar».
- [ ] Recuperar la vista de mapa. Ya hay 88 fichas con coordenada exacta, así que esta vez
      puede ser un mapa de calles de verdad y no un esquema de barrios.
- [ ] Mapa con todos los negocios situados.
- [ ] Página propia por negocio, con fotos y horarios.
- [ ] Formulario para proponer negocios sin pasar por GitHub.
- [ ] Abrir a otras ciudades, cuando Madrid esté bien cubierto.

## Licencia

Código bajo licencia MIT. Los datos del directorio se pueden reutilizar libremente
citando el proyecto.

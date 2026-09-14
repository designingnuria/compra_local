# Compra Local

Directorio de **106 tiendas y talleres independientes de Madrid**. Sin franquicias ni cadenas:
solo negocios pequeños, regentados por la gente que los levantó, donde las cosas se hacen
despacio y con cariño.

Desde una quesería a una librería de poesía, pasando por el taller donde te enmarcan un cuadro.

## Qué hay

- **Buscador** por nombre, oficio, barrio o etiqueta, insensible a mayúsculas y tildes
  (buscar `panaderia` encuentra «Panadería»).
- Entiende **frases sueltas**: «busco un sitio para enmarcar cuadros» encuentra los tres
  talleres de enmarcación aunque ninguno use ese verbo. Cada categoría tiene una lista de
  sinónimos y las palabras de relleno («una», «para», «tienda») se descartan.
- Resultados **ordenados por relevancia**: acertar en el nombre pesa más que aparecer de
  pasada en una descripción.
- **Filtros** por categoría y por barrio, con contadores que se actualizan solos.
- **Orden** alfabético, por antigüedad del negocio o aleatorio, para descubrir sin buscar.
- **Fichas** con nombre, descripción, categoría, barrio, dirección, web y enlace al mapa.
- Los filtros viven en la URL, así que cualquier búsqueda se puede compartir tal cual.
- **Formulario para proponer negocios**, que compone el correo y lo manda a quien mantiene
  el directorio. Sin servidor y sin pasar los datos de nadie por un servicio de terceros.
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

De las 106 fichas, 61 están verificadas y 45 siguen pendientes.
El comercio de barrio cierra y se muda más de lo que nos gustaría —mientras se montaba
este directorio, Tipos Infames anunció su cierre tras quince años en Malasaña, y El
Flamenco Vive ya no está en la calle donde muchas guías lo siguen situando—, así que
conviene revisar las fichas de vez en cuando. Si ves un dato equivocado o un cierre,
corrígelo: es la contribución más valiosa que se puede hacer aquí.

## Hacia dónde puede ir

Ideas que quedan pendientes, por orden de utilidad:

- [ ] Verificar las 45 fichas que están «por confirmar».
- [ ] Mapa con todos los negocios situados.
- [ ] Página propia por negocio, con fotos y horarios.
- [ ] Formulario para proponer negocios sin pasar por GitHub.
- [ ] Abrir a otras ciudades, cuando Madrid esté bien cubierto.

## Licencia

Código bajo licencia MIT. Los datos del directorio se pueden reutilizar libremente
citando el proyecto.

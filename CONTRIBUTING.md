# Cómo contribuir

Gracias por querer sumar. Este directorio vale exactamente lo que valen sus fichas, así
que se cuidan mucho dos cosas: **qué negocios entran** y **que los datos sean ciertos**.

## Criterios

Este directorio existe para que el dinero del barrio se quede en el barrio. Hay una sola
pregunta que decide si un negocio entra: **¿hay alguien detrás?** Alguien que sea el dueño,
que decida lo que se vende y que responda por ello.

### Sí entra

- **Propiedad independiente**: de una persona, una familia, unos socios.
- **Conocimiento**: quien atiende sabe de lo que vende, porque lo hace, lo elige o lleva años.
- **Oficios y servicios de barrio**: encuadernar, enmarcar, afinar, coser, reparar, tostar,
  afeitar. Una barbería de las de navaja entra; una peluquería de cadena no.
- **Criterio propio** al elegir el producto, no un catálogo que llega de una central.
- **Comercios de toda la vida** que siguen en la familia, y **proyectos nuevos** con una idea clara.

### No entra

- **Franquicias y cadenas**: si se puede abrir una pagando un canon, no entra.
- **Sucursales de marcas grandes**, por bonita que sea la tienda.
- **Negocios sin nada propio**: ni oficio, ni selección, ni una idea detrás.
- **Bares y restaurantes**: esto va de comprar y de oficios, no de salir a cenar. Una cafetería
  que tuesta y vende su café sí entra; un bar de tapas no.

### Lo que no se mira

El tipo de negocio ni de quién es. Una tienda pequeña puede ser mediocre y un obrador humilde
puede ser extraordinario. Lo que cuenta es si hay oficio y criterio propio, se venda lo que se
venda. No hacemos listas de negocios buenos y malos por el ramo al que pertenecen.

### La duda razonable

Si no sabes si algo es franquicia, busca «*nombre* + franquicia» o mira si su web tiene sección
de «únete a nosotros». Ante la duda, mejor dejarlo fuera: una ficha de más estropea el
directorio más de lo que una de menos lo empobrece.

## Cómo se añade

Si solo quieres proponer un negocio y no te apetece tocar código, usa el formulario del final
de la web: rellenas cuatro campos y se envía solo.

Para añadirlo tú al directorio:

1. Abre `data/negocios.js`.
2. Copia una ficha existente y cámbiale los datos. El `id` tiene que ser único, en
   minúsculas y con guiones.
3. Si el barrio no estaba todavía en el directorio, añádelo también a `data/barrios.js` con
   su latitud y longitud aproximadas. Si no, sus negocios no aparecerán en el mapa.
4. Ejecuta `node scripts/validar.js` y arregla lo que salga.
5. Abre una propuesta de cambio explicando de dónde sacaste los datos.

## Los campos

| Campo | ¿Obligatorio? | Notas |
|---|---|---|
| `id` | Sí | Único. Minúsculas y guiones: `queseria-cultivo` |
| `nombre` | Sí | Como se llama, tal cual aparece en la fachada |
| `categoria` | Sí | Uno de los `id` de `CATEGORIAS`, arriba del mismo archivo |
| `descripcion` | Sí | Una o dos frases: qué venden y por qué merece la pena |
| `barrio` | No | Barrio o zona reconocible: `Malasaña`, `Chamberí`, `La Latina`. **Déjalo vacío si no estás seguro**: la ficha aparecerá solo como «Madrid», que es mejor que situarla mal |
| `direccion` | No | **Déjalo vacío si no estás seguro.** Una dirección mala es peor que ninguna |
| `web` | No | URL completa con `https://` |
| `instagram` | No | Solo el usuario, sin arroba |
| `desde` | No | Año de apertura, si se conoce con certeza |
| `etiquetas` | No | Palabras sueltas para el buscador |
| `coords` | No | `[latitud, longitud]` si la conoces con precisión. La ficha saldrá en su punto exacto del mapa en vez de sumarse al círculo de su barrio |
| `verificado` | Sí | `true` **solo** si has comprobado los datos hoy en una fuente fiable |

## Sobre `verificado`

Pon `true` únicamente si has mirado una de estas:

- La web o el Instagram del propio negocio.
- El registro de comercios centenarios del Ayuntamiento o la Comunidad de Madrid.
- Un artículo periodístico reciente que confirme dirección y actividad.

Si lo sabes «de haber pasado por delante», pon `false`: sigue siendo una aportación útil,
solo que alguien tendrá que confirmarla.

## Cómo escribir la descripción

Cuenta **qué hace especial al negocio**, no lo que se ve desde la puerta.

- Flojo: «Tienda de quesos en Conde Duque con buena variedad.»
- Mejor: «Quesos artesanos de pequeños productores con nombre y apellidos, madurados en
  su propia cava. Montan catas y maridajes en la sala del fondo.»

Sin superlativos de folleto («el mejor», «imprescindible», «único»), sin adjetivos
vacíos y sin copiar el texto de su web.

## Corregir y dar de baja

Si un negocio ha cerrado o se ha mudado, **es la contribución más valiosa**. Borra la
ficha o corrígela y explícalo en la propuesta de cambio.

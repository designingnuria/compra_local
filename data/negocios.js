/* ---------------------------------------------------------------
   Consume Local — base de datos del directorio.

   Este archivo es la única fuente de verdad. Para añadir un negocio,
   copia una ficha, cámbiale los datos y comprueba que el `id` es único.
   No hace falta tocar nada más: la web se construye sola a partir de aquí.

   Campos de una ficha
   -------------------
   id           obligatorio  identificador único en minúsculas y con guiones
   nombre       obligatorio  como se llama el negocio, tal cual
   categoria    obligatorio  uno de los `id` de CATEGORIAS (más abajo)
   descripcion  obligatorio  una o dos frases. Qué venden y por qué merece la pena
   barrio       obligatorio  barrio o zona reconocible de Madrid
   direccion    opcional     déjalo vacío si no estás seguro; es peor una dirección mala que ninguna
   web          opcional     URL completa con https://
   instagram    opcional     solo el usuario, sin arroba
   desde        opcional     año de apertura, si se conoce
   etiquetas    opcional     palabras sueltas que ayuden a encontrarlo desde el buscador
   verificado   obligatorio  true solo si has comprobado los datos en una fuente fiable

   Criterios: negocios independientes, de dueño, en Madrid capital.
   Nada de franquicias, cadenas, locutorios, bazares ni tiendas de souvenirs.
   --------------------------------------------------------------- */

/* Las CATEGORIAS llevan `sinonimos`: palabras que no aparecen en las fichas
   pero que la gente escribe en el buscador. Gracias a ellas, buscar
   «enmarcar cuadros» encuentra los talleres de enmarcación aunque ninguno
   use ese verbo en su descripción. No se muestran en ningún sitio. */
const CATEGORIAS = [
  { id: "librerias", nombre: "Librerías", icono: "📚",
    sinonimos: ["libro", "libros", "leer", "lectura", "novela", "ensayo", "poesia", "comic", "libreria"] },
  { id: "alimentacion", nombre: "Alimentación", icono: "🧀",
    sinonimos: ["comida", "comer", "despensa", "gourmet", "ultramarinos", "colmado", "delicatessen", "queseria", "charcuteria"] },
  { id: "panaderia", nombre: "Pan y dulces", icono: "🥐",
    sinonimos: ["pan", "panaderia", "obrador", "masa madre", "dulce", "dulces", "pasteleria", "confiteria", "postre", "tarta", "bolleria", "horno"] },
  { id: "cafe", nombre: "Café y té", icono: "☕",
    sinonimos: ["cafe", "cafeteria", "tostador", "tueste", "grano", "cafetera", "te", "teteria"] },
  { id: "vinos", nombre: "Vinos y bebidas", icono: "🍷",
    sinonimos: ["vino", "vinos", "bodega", "vinoteca", "bebida", "bebidas", "beber",
      "cerveza", "cervezas", "artesana", "birra", "licor", "licores", "destilados",
      "vermut", "sidra", "ginebra", "coctel", "catas"] },
  { id: "hogar", nombre: "Cerámica y hogar", icono: "🏺",
    sinonimos: ["casa", "hogar", "menaje", "cocina", "vajilla", "plato", "decoracion", "loza", "artesania", "alfareria", "ferreteria", "drogueria", "herramienta"] },
  { id: "papeleria", nombre: "Papel y arte", icono: "✏️",
    sinonimos: ["papel", "papeleria", "cuaderno", "libreta", "boligrafo", "pluma", "escribir",
      "postal", "bellas artes", "dibujar", "pintura", "pigmentos", "acuarela",
      "enmarcar", "enmarcacion", "marco", "marcos", "cuadro", "cuadros", "lamina", "laminas",
      "poster", "espejo", "arte", "grabado",
      "comic", "comics", "tebeo", "manga", "juegos de mesa", "rol", "cartas", "coleccionismo"] },
  { id: "moda", nombre: "Moda y complementos", icono: "🧣",
    sinonimos: ["ropa", "vestir", "moda", "complementos", "accesorios", "zapatos", "calzado", "sombrero", "sombreria", "bolso", "sastre", "sastreria", "guanteria"] },
  { id: "musica", nombre: "Música y discos", icono: "🎵",
    sinonimos: ["musica", "disco", "discos", "vinilo", "vinilos", "cd", "tocadiscos", "instrumento", "tienda de musica"] },
  { id: "oficios", nombre: "Oficios y talleres", icono: "🔨",
    sinonimos: ["taller", "artesano", "artesania", "oficio", "reparar", "reparacion", "arreglar", "a medida", "hecho a mano", "coser", "luthier", "guitarreria", "cuero", "piel", "encuadernar", "encuadernacion", "restaurar"] },
  { id: "plantas", nombre: "Plantas y flores", icono: "🌿",
    sinonimos: ["planta", "plantas", "flor", "flores", "floristeria", "jardin", "maceta", "ramo"] },
  { id: "juguetes", nombre: "Juguetes y regalos", icono: "🧸",
    sinonimos: ["juguete", "juguetes", "juego", "juegos", "regalo", "regalos", "ninos"] },
  { id: "foto", nombre: "Fotografía", icono: "📷",
    sinonimos: ["foto", "fotografia", "analogica", "carrete", "revelar", "revelado", "camara", "camaras", "pelicula"] },
  { id: "vintage", nombre: "Vintage y anticuarios", icono: "🪑",
    sinonimos: ["vintage", "antiguedades", "anticuario", "mueble", "muebles", "segunda mano", "retro", "decoracion", "rastro"] },
  { id: "joyeria", nombre: "Joyería", icono: "💍",
    sinonimos: ["joya", "joyas", "joyeria", "anillo", "pendientes", "collar", "plata", "oro", "bisuteria", "a medida"] },
  { id: "carniceria", nombre: "Carnicería y pescadería", icono: "🥩",
    sinonimos: ["carniceria", "carnicero", "carne", "pescaderia", "pescado", "marisco", "pollo", "embutido", "casqueria", "charcuteria"] },
  { id: "belleza", nombre: "Peluquería y estética", icono: "💈",
    sinonimos: ["peluqueria", "peluquero", "barberia", "barbero", "corte de pelo", "estetica", "cosmetica", "jabon", "navaja", "barba", "herbolario"] }
];

const NEGOCIOS = [

  /* ------------------------------------------------------ librerías */
  {
    id: "libreria-rafael-alberti",
    nombre: "Librería Rafael Alberti",
    categoria: "librerias",
    descripcion: "Librería de barrio con más de 25.000 títulos y una sección de poesía que es de las mejores de la ciudad. Llevan desde 1975 organizando recitales y presentaciones.",
    barrio: "Argüelles",
    direccion: "C/ de Tutor, 57",
    web: "https://www.libreriarafaelalberti.com",
    desde: 1975,
    etiquetas: ["poesía", "humanidades", "presentaciones", "infantil"],
    verificado: true
  },
  {
    id: "desperate-literature",
    nombre: "Desperate Literature",
    categoria: "librerias",
    descripcion: "Librería multilingüe con una selección muy personal de literatura en inglés, español y francés. Recomendaciones escritas a mano en cada estantería.",
    barrio: "Centro",
    web: "https://desperateliterature.com",
    etiquetas: ["idiomas", "inglés", "segunda mano", "internacional"],
    verificado: false
  },
  {
    id: "traficantes-de-suenos",
    nombre: "Traficantes de Sueños",
    categoria: "librerias",
    descripcion: "Librería y editorial en forma de cooperativa, especializada en pensamiento crítico, feminismos y ensayo político. También hacen distribución.",
    barrio: "La Latina",
    direccion: "C/ del Duque de Alba, 13",
    web: "https://traficantes.net",
    etiquetas: ["ensayo", "política", "cooperativa", "editorial"],
    verificado: false
  },
  {
    id: "la-buena-vida",
    nombre: "La Buena Vida",
    categoria: "librerias",
    descripcion: "Librería café con fondo cuidadísimo de narrativa y ensayo, y un club de lectura veterano. De las que te recomiendan bien aunque no compres.",
    barrio: "Ópera",
    direccion: "C/ de Vergara, 5",
    web: "https://www.labuenavidalibreria.com",
    etiquetas: ["narrativa", "club de lectura", "café"],
    verificado: false
  },
  {
    id: "panta-rhei",
    nombre: "Panta Rhei",
    categoria: "librerias",
    descripcion: "Libros de ilustración, diseño gráfico, fotografía y cómic de autor. Edición extranjera difícil de encontrar en España y exposiciones en la propia librería.",
    barrio: "Chueca",
    direccion: "C/ de Hernán Cortés, 7",
    web: "https://www.pantarhei.es",
    etiquetas: ["ilustración", "diseño", "fotografía", "cómic"],
    verificado: false
  },
  {
    id: "arrebato-libros",
    nombre: "Arrebato Libros",
    categoria: "librerias",
    descripcion: "Pequeña librería de poesía y edición independiente, con mesa de novedades de sellos diminutos que no llegan a otras librerías.",
    barrio: "Malasaña",
    direccion: "C/ de la Palma, 21",
    web: "https://www.arrebatolibros.com",
    etiquetas: ["poesía", "edición independiente", "fanzines"],
    verificado: false
  },
  {
    id: "libreria-mujeres",
    nombre: "Librería Mujeres",
    categoria: "librerias",
    descripcion: "Abierta en 1978, es la librería feminista decana de Madrid. Fondo especializado en pensamiento y literatura escrita por mujeres.",
    barrio: "Centro",
    direccion: "C/ de la Unión, 3",
    desde: 1978,
    etiquetas: ["feminismo", "ensayo", "histórica"],
    verificado: false
  },
  {
    id: "ocho-y-medio",
    nombre: "Ocho y Medio, Libros de Cine",
    categoria: "librerias",
    descripcion: "Librería dedicada en exclusiva al cine: guiones, biografías, teoría, carteles y revistas. Punto de encuentro del cinéfilo madrileño.",
    barrio: "Moncloa",
    direccion: "C/ de Martín de los Heros, 11",
    web: "https://www.ochoymedio.com",
    etiquetas: ["cine", "guiones", "carteles"],
    verificado: false
  },
  {
    id: "cervantes-y-compania",
    nombre: "Cervantes y Compañía",
    categoria: "librerias",
    descripcion: "Librería de barrio en pleno Malasaña, con programación constante de clubes de lectura, talleres y presentaciones de editoriales pequeñas.",
    barrio: "Malasaña",
    direccion: "C/ del Pez, 27",
    etiquetas: ["narrativa", "talleres", "barrio"],
    verificado: false
  },
  {
    id: "tres-rosas-amarillas",
    nombre: "Tres Rosas Amarillas",
    categoria: "librerias",
    descripcion: "Librería especializada en cultura japonesa: literatura, haiku, grabado y papelería nipona. Un rincón muy concreto y muy bien hecho.",
    barrio: "Malasaña",
    etiquetas: ["japón", "haiku", "cultura", "papelería"],
    verificado: false
  },

  /* --------------------------------------------------- alimentación */
  {
    id: "queseria-cultivo",
    nombre: "Quesería Cultivo",
    categoria: "alimentacion",
    descripcion: "Quesos artesanos de pequeños productores con nombre y apellidos, madurados en su propia cava. Montan catas y maridajes en la sala del fondo.",
    barrio: "Conde Duque",
    direccion: "C/ del Conde Duque, 15",
    web: "https://queseriacultivo.com",
    desde: 2014,
    etiquetas: ["quesos", "catas", "artesano", "leche cruda"],
    verificado: true
  },
  {
    id: "formaje",
    nombre: "Formaje",
    categoria: "alimentacion",
    descripcion: "Quesería de autor centrada en producciones minúsculas, europeas y españolas. Te explican cada pieza con un detalle que da gusto.",
    barrio: "Chamberí",
    etiquetas: ["quesos", "afinado", "gourmet"],
    verificado: false
  },
  {
    id: "la-boulette",
    nombre: "La Boulette",
    categoria: "alimentacion",
    descripcion: "Puesto de quesos dentro del Mercado de la Paz, con una selección internacional enorme y consejo experto sobre cortes y puntos de maduración.",
    barrio: "Salamanca",
    direccion: "Mercado de la Paz, C/ de Ayala, 28",
    etiquetas: ["quesos", "mercado", "charcutería"],
    verificado: false
  },
  {
    id: "mantequerias-bravo",
    nombre: "Mantequerías Bravo",
    categoria: "alimentacion",
    descripcion: "Colmado clásico abierto en 1931: conservas, jamón cortado a cuchillo, quesos y una bodega seleccionada con criterio de tienda de toda la vida.",
    barrio: "Salamanca",
    direccion: "C/ de Ayala, 24",
    desde: 1931,
    etiquetas: ["colmado", "conservas", "jamón", "histórica"],
    verificado: false
  },
  {
    id: "casa-mira",
    nombre: "Casa Mira",
    categoria: "alimentacion",
    descripcion: "Turrón artesano desde 1842, hecho con la misma receta jijonenca que trajo el fundador andando desde Alicante. En Navidad hay cola en la puerta.",
    barrio: "Centro",
    direccion: "Carrera de San Jerónimo, 30",
    coords: [40.416712, -3.699341],
    web: "https://www.casamira.es",
    desde: 1842,
    etiquetas: ["turrón", "navidad", "centenario", "artesano"],
    verificado: true
  },
  {
    id: "la-violeta",
    nombre: "La Violeta",
    categoria: "alimentacion",
    descripcion: "Una tienda diminuta que lleva desde 1915 vendiendo caramelos de violeta hechos a mano, en sus cajitas moradas de siempre.",
    barrio: "Centro",
    direccion: "Plaza Canalejas, 6",
    coords: [40.416739, -3.700664],
    web: "https://www.lavioletaonline.es",
    desde: 1915,
    etiquetas: ["caramelos", "violetas", "centenario", "regalo"],
    verificado: true
  },

  /* ------------------------------------------------------ pan y dulces */
  {
    id: "antigua-pasteleria-del-pozo",
    nombre: "Antigua Pastelería del Pozo",
    categoria: "panaderia",
    descripcion: "La pastelería más antigua de Madrid, de 1830, con su horno de leña original. Hojaldres, empanadas y bartolillos como hace doscientos años.",
    barrio: "Centro",
    direccion: "C/ Pozo, 8",
    coords: [40.416396, -3.701224],
    web: "https://antiguapasteleriadelpozo.com",
    desde: 1830,
    etiquetas: ["pastelería", "hojaldre", "centenario", "horno de leña"],
    verificado: true
  },
  {
    id: "confiteria-el-riojano",
    nombre: "Confitería El Riojano",
    categoria: "panaderia",
    descripcion: "Confitería de 1855 fundada por el repostero de la reina Isabel II. Conserva la decoración isabelina y sus pastas de té son un clásico.",
    barrio: "Centro",
    direccion: "C/ Mayor, 10",
    coords: [40.416648, -3.705964],
    web: "https://confiteriaelriojano.com",
    desde: 1855,
    etiquetas: ["confitería", "pastas", "centenario", "rosquillas"],
    verificado: true
  },
  {
    id: "el-horno-de-babette",
    nombre: "El Horno de Babette",
    categoria: "panaderia",
    descripcion: "Panadería de masa madre, harinas ecológicas y fermentaciones largas. De las que empujaron el pan de verdad en Madrid cuando casi nadie lo hacía.",
    barrio: "Malasaña",
    web: "https://elhornodebabette.com",
    etiquetas: ["masa madre", "pan", "ecológico", "hogaza"],
    verificado: false
  },
  {
    id: "panatica",
    nombre: "Panática",
    categoria: "panaderia",
    descripcion: "Obrador de pan artesano con masa madre y fermentaciones largas, además de bollería de mantequilla hecha cada mañana.",
    barrio: "Salamanca",
    direccion: "C/ de Padilla, 63",
    etiquetas: ["masa madre", "obrador", "bollería"],
    verificado: false
  },
  {
    id: "clan-obrador",
    nombre: "Clan Obrador",
    categoria: "panaderia",
    descripcion: "Pequeño obrador de barrio en Acacias donde amasan a la vista, con pan de larga fermentación y repostería de temporada.",
    barrio: "Arganzuela",
    direccion: "C/ del Gasómetro, 11",
    etiquetas: ["obrador", "pan", "repostería", "barrio"],
    verificado: false
  },
  {
    id: "novo-mundo",
    nombre: "Novo Mundo",
    categoria: "panaderia",
    descripcion: "Obrador artesano en La Latina con panes de harinas molidas a la piedra y una carta corta de dulces que cambia con la temporada.",
    barrio: "La Latina",
    direccion: "C/ del Carnero",
    etiquetas: ["obrador", "pan", "artesano"],
    verificado: false
  },
  {
    id: "azymun",
    nombre: "Azymun",
    categoria: "panaderia",
    descripcion: "Panadería artesanal con masa madre de cultivo propio y harinas ecológicas. Fermentaciones muy largas y un pan que aguanta días.",
    barrio: "Tetuán",
    direccion: "C/ del General Perón, 22",
    etiquetas: ["masa madre", "ecológico", "pan"],
    verificado: false
  },

  /* --------------------------------------------------------- café */
  {
    id: "toma-cafe",
    nombre: "Toma Café",
    categoria: "cafe",
    descripcion: "Los que trajeron el café de especialidad a Madrid. Tuestan su propio grano y lo venden en bolsa para llevártelo a casa.",
    barrio: "Malasaña",
    direccion: "C/ de la Palma, 49",
    web: "https://www.tomacafe.es",
    etiquetas: ["café de especialidad", "tostador", "grano"],
    verificado: false
  },
  {
    id: "hola-coffee",
    nombre: "Hola Coffee",
    categoria: "cafe",
    descripcion: "Tostador y cafetería de referencia en la ciudad. Venden su café en grano y explican con paciencia qué origen le va mejor a tu cafetera.",
    barrio: "Lavapiés",
    direccion: "C/ del Doctor Fourquet, 33",
    web: "https://hola.coffee",
    etiquetas: ["café de especialidad", "tostador", "filtro"],
    verificado: true
  },
  {
    id: "mision-cafe",
    nombre: "Misión Café",
    categoria: "cafe",
    descripcion: "Cafetería de especialidad con baristas formados en casa y una barra donde se puede preguntar sin miedo. Café propio para llevar.",
    barrio: "Conde Duque",
    direccion: "C/ de los Reyes, 5",
    etiquetas: ["café de especialidad", "barista", "brunch"],
    verificado: true
  },
  {
    id: "hanso-cafe",
    nombre: "HanSo Café",
    categoria: "cafe",
    descripcion: "Café de especialidad con alma japonesa y tostadero propio en el barrio de Lucero. Matcha, filtros y grano en bolsa.",
    barrio: "Malasaña",
    direccion: "C/ del Pez, 20",
    etiquetas: ["café de especialidad", "matcha", "tostador"],
    verificado: false
  },

  /* -------------------------------------------------------- vinos */
  {
    id: "bodega-santa-cecilia",
    nombre: "Bodega Santa Cecilia",
    categoria: "vinos",
    descripcion: "Bodega familiar con miles de referencias, desde lo cotidiano hasta rarezas de bodegas minúsculas. Organizan catas y cursos todo el año.",
    barrio: "Chamberí",
    direccion: "C/ de Blasco de Garay, 74",
    web: "https://www.santacecilia.es",
    etiquetas: ["vino", "catas", "destilados", "familiar"],
    verificado: false
  },
  {
    id: "reserva-y-cata",
    nombre: "Reserva y Cata",
    categoria: "vinos",
    descripcion: "Vinoteca pequeña y muy bien seleccionada, fuerte en vinos de productores independientes y naturales. Te aciertan con lo que buscas.",
    barrio: "Chueca",
    direccion: "C/ del Conde de Xiquena, 13",
    web: "https://reservaycata.com",
    etiquetas: ["vino", "natural", "catas", "regalo"],
    verificado: false
  },

  /* ---------------------------------------------- cerámica y hogar */
  {
    id: "antigua-casa-talavera",
    nombre: "Antigua Casa Talavera",
    categoria: "hogar",
    descripcion: "Desde 1904, cerámica española pintada a mano traída de los alfares de Talavera, Manises, Puente del Arzobispo o Sevilla. La tienda entera es un azulejo.",
    barrio: "Centro",
    direccion: "C/ Isabel la Católica, 2",
    coords: [40.420941, -3.708912],
    web: "http://www.antiguacasatalavera.com",
    desde: 1904,
    etiquetas: ["cerámica", "azulejos", "centenario", "artesanía"],
    verificado: true
  },
  {
    id: "morueco-ceramicas",
    nombre: "Morueco Cerámicas",
    categoria: "hogar",
    descripcion: "Dos plantas de cerámica artesanal española, de la de uso diario a la de coleccionista. También tienen tienda en el Rastro.",
    barrio: "Las Letras",
    direccion: "C/ de Moratín, 42",
    etiquetas: ["cerámica", "menaje", "artesanía"],
    verificado: true
  },
  {
    id: "la-oficial",
    nombre: "La Oficial",
    categoria: "hogar",
    descripcion: "Cerámica al peso: eliges pieza a pieza entre loza portuguesa y de La Bisbal y te la cobran en la báscula. Vajillas desparejadas y preciosas.",
    barrio: "La Latina",
    etiquetas: ["cerámica", "al peso", "vajilla", "portuguesa"],
    verificado: true
  },
  {
    id: "cocol",
    nombre: "Cocol",
    categoria: "hogar",
    descripcion: "Objetos artesanos de toda la vida: morteros, menaje esmaltado, vidrio soplado, mimbre, esparto y tablas de cocina. Utensilios que duran décadas.",
    barrio: "Centro",
    etiquetas: ["artesanía", "menaje", "esparto", "vidrio soplado"],
    verificado: true
  },
  {
    id: "almacen-de-pontejos",
    nombre: "Almacén de Pontejos",
    categoria: "hogar",
    descripcion: "Mercería histórica con cajones hasta el techo: botones, cintas, hilos, galones y encajes. Si existe, lo tienen; y si no, te dicen dónde buscarlo.",
    barrio: "Centro",
    direccion: "C/ Del Correo, 4",
    coords: [40.416861, -3.704103],
    web: "https://www.pontejos.com",
    desde: 1913,
    etiquetas: ["mercería", "botones", "costura", "centenario"],
    verificado: true
  },

  /* ---------------------------------------------------- papelería */
  {
    id: "casa-postal",
    nombre: "Casa Postal",
    categoria: "papeleria",
    descripcion: "Tienda de postales antiguas, carteles, fotografías y objetos de coleccionista. Se entra a por una postal y se sale dos horas después.",
    barrio: "Chueca",
    direccion: "C/ de la Libertad, 37",
    etiquetas: ["postales", "coleccionismo", "carteles", "vintage"],
    verificado: false
  },

  /* ---------------------------------------------- arte y enmarcación */
  {
    id: "ideas-arte",
    nombre: "Ideas Arte",
    categoria: "papeleria",
    descripcion: "Taller de enmarcación familiar en Malasaña desde 1980, ya por la tercera generación. Hacen marcos a medida en cualquier estilo y aconsejan de verdad.",
    barrio: "Malasaña",
    desde: 1980,
    etiquetas: ["enmarcación", "cuadros", "marcos", "a medida", "familiar"],
    verificado: true
  },
  {
    id: "subiron-cristal-y-arte",
    nombre: "Subirón Cristal y Arte",
    categoria: "papeleria",
    descripcion: "Taller familiar con más de cuarenta años enmarcando óleos, grabados, telas, espejos y prácticamente cualquier objeto que le lleves.",
    barrio: "Retiro",
    web: "https://www.subironcristalyarte.com",
    etiquetas: ["enmarcación", "cuadros", "marcos", "espejos", "cristal"],
    verificado: true
  },
  {
    id: "kino-marcos-molduras",
    nombre: "Kino Marcos y Molduras",
    categoria: "papeleria",
    descripcion: "Artesanos de la moldura con más de treinta años de oficio: trabajan los marcos a mano, uno a uno, incluida la caja americana.",
    web: "https://www.kinomarcosmolduras.com",
    etiquetas: ["enmarcación", "cuadros", "molduras", "artesano", "caja americana"],
    verificado: true
  },

  /* ------------------------------------------ moda y complementos */
  {
    id: "casa-hernanz",
    nombre: "Casa Hernanz",
    categoria: "moda",
    descripcion: "Alpargatería abierta en 1840 y todavía en manos de la familia Hernanz. Suela de esparto cosida a mano y una cola en la puerta cada primavera.",
    barrio: "Centro",
    direccion: "C/ Toledo, 18",
    coords: [40.414365, -3.707710],
    web: "https://www.casahernanz.es",
    desde: 1840,
    etiquetas: ["alpargatas", "esparto", "centenario", "calzado"],
    verificado: true
  },
  {
    id: "capas-sesena",
    nombre: "Capas Seseña",
    categoria: "moda",
    descripcion: "Desde 1901 cosen capas españolas de lana a medida, las mismas que llevaron Picasso o Hemingway. Sigue siendo un taller familiar.",
    barrio: "Centro",
    direccion: "C/ Cruz, 23",
    coords: [40.415468, -3.702023],
    web: "https://sesena.com",
    desde: 1901,
    etiquetas: ["capas", "sastrería", "centenario", "lana"],
    verificado: true
  },
  {
    id: "guantes-luque",
    nombre: "Guantes Luque",
    categoria: "moda",
    descripcion: "Guantería de 1886 con las vitrinas originales, donde todavía te miden la mano para dar con la talla exacta en piel.",
    barrio: "Centro",
    direccion: "C/ Espoz y Mina, 3",
    coords: [40.416985, -3.702244],
    desde: 1886,
    etiquetas: ["guantes", "piel", "centenario", "complementos"],
    verificado: true
  },
  {
    id: "casa-de-diego",
    nombre: "Casa de Diego",
    categoria: "moda",
    descripcion: "Abanicos, paraguas, bastones y sombrillas desde 1858, con taller propio de reparación. En la Puerta del Sol de toda la vida.",
    barrio: "Centro",
    direccion: "C/ Puerta del Sol, 12",
    coords: [40.417338, -3.703128],
    web: "http://casadediego.info/es",
    desde: 1858,
    etiquetas: ["abanicos", "paraguas", "bastones", "centenario"],
    revisado: "2025-12",
    verificado: true
  },
  {
    id: "casa-yustas",
    nombre: "Sombrerería Casa Yustas",
    categoria: "moda",
    descripcion: "Sombrerería de 1886 en los soportales de la Plaza Mayor. Del panamá al sombrero cordobés, con horma y medida.",
    barrio: "Centro",
    direccion: "Plaza Mayor, 30",
    coords: [40.416019, -3.706722],
    web: "https://www.casayustas.com",
    desde: 1886,
    etiquetas: ["sombreros", "panamá", "centenario", "boinas"],
    verificado: true
  },
  {
    id: "casa-jimenez",
    nombre: "Casa Jiménez",
    categoria: "moda",
    descripcion: "Mantones de Manila bordados a mano, mantillas y peinetas. Uno de los pocos sitios donde se sigue entendiendo de bordado de verdad.",
    barrio: "Centro",
    direccion: "C/ de Preciados, 42",
    etiquetas: ["mantones", "bordado", "mantillas", "peinetas"],
    verificado: false
  },

  /* ---------------------------------------------- música y discos */
  {
    id: "discos-la-metralleta",
    nombre: "Discos La Metralleta",
    categoria: "musica",
    descripcion: "Treinta años comprando y vendiendo discos en el sótano de las Descalzas. Miles de vinilos y CDs de segunda mano donde perderse una tarde entera. Anunciaron que dejaban el centro, así que conviene confirmar dónde están antes de ir.",
    barrio: "Centro",
    web: "https://www.discoslametralleta.com",
    etiquetas: ["vinilos", "segunda mano", "CDs", "coleccionismo"],
    revisado: "2026-09",
    verificado: false
  },
  {
    id: "escridiscos",
    nombre: "Escridiscos",
    categoria: "musica",
    descripcion: "Tienda de discos con buen fondo de pop rock internacional, jazz y rarezas del pop español difíciles de encontrar en ningún otro sitio.",
    barrio: "Centro",
    direccion: "C/ de Navas de Tolosa, 4",
    web: "https://www.escridiscos.com",
    etiquetas: ["vinilos", "jazz", "pop español", "rarezas"],
    verificado: true
  },
  {
    id: "radio-city-discos",
    nombre: "Radio City Discos",
    categoria: "musica",
    descripcion: "Tienda muy especializada en funk y soul de los setenta, folk americano y novedades de sellos pequeños. Catálogo con criterio propio.",
    barrio: "Malasaña",
    etiquetas: ["vinilos", "funk", "soul", "folk"],
    verificado: false
  },
  {
    id: "el-flamenco-vive",
    nombre: "El Flamenco Vive",
    categoria: "musica",
    descripcion: "Desde 1994, la tienda de flamenco de Madrid: guitarras, cajones, castañuelas, discos, libros, batas y zapatos. Todo flamenco y nada más.",
    barrio: "Centro",
    direccion: "C/ del Duque de Fernán Núñez, 5",
    web: "https://www.elflamencovive.com",
    desde: 1994,
    etiquetas: ["flamenco", "guitarras", "castañuelas", "discos"],
    verificado: true
  },

  /* --------------------------------------------- oficios y talleres */
  {
    id: "guitarras-manuel-contreras",
    nombre: "Guitarras Manuel Contreras",
    categoria: "oficios",
    descripcion: "Taller de guitarrería fundado en 1962 y en el mismo local desde entonces. Construyen a mano guitarras clásicas y flamencas, pieza a pieza.",
    barrio: "Centro",
    direccion: "C/ Mayor, 80",
    desde: 1962,
    etiquetas: ["guitarras", "luthier", "flamenco", "artesano"],
    verificado: true
  },
  {
    id: "conde-hermanos",
    nombre: "Conde Hermanos",
    categoria: "oficios",
    descripcion: "Dinastía de guitarreros con raíces en 1915, heredera del taller de Domingo Esteso. Guitarras flamencas construidas a mano por la familia.",
    barrio: "Ópera",
    direccion: "C/ Arrieta, 4",
    coords: [40.419452, -3.710266],
    web: "https://condehermanos.com",
    desde: 1915,
    etiquetas: ["guitarras", "luthier", "flamenco", "familiar"],
    verificado: true
  },
  {
    id: "guitarras-jose-ramirez",
    nombre: "Guitarras José Ramírez",
    categoria: "oficios",
    descripcion: "Una de las casas de guitarrería más antiguas del mundo, fundada en 1882 y dirigida por la quinta generación de la familia Ramírez.",
    barrio: "Centro",
    direccion: "C/ Paz, 8",
    coords: [40.415350, -3.704385],
    web: "https://www.guitarrasramirez.com",
    desde: 1882,
    etiquetas: ["guitarras", "luthier", "clásica", "centenario"],
    verificado: true
  },
  {
    id: "taller-puntera",
    nombre: "Taller Puntera",
    categoria: "oficios",
    descripcion: "Taller de marroquinería donde cosen la piel a la vista del público: bolsos, cinturones, carteras y encargos a medida. También dan cursos de cuero.",
    barrio: "La Latina",
    direccion: "Plaza del Conde de Barajas, 4",
    web: "https://www.puntera.com",
    etiquetas: ["cuero", "marroquinería", "talleres", "a medida"],
    verificado: false
  },

  /* -------------------------------------------- plantas y flores */
  {
    id: "planthae",
    nombre: "Planthae",
    categoria: "plantas",
    descripcion: "Tienda de plantas junto al Rastro donde además montan exposiciones de ilustración botánica y charlas. Aconsejan según la luz que tenga tu casa.",
    barrio: "Embajadores",
    etiquetas: ["plantas", "botánica", "ilustración", "macetas"],
    verificado: false
  },
  {
    id: "moss-floristas",
    nombre: "Moss Floristas",
    categoria: "plantas",
    descripcion: "Floristería de autor con ramos de flor de temporada, nada de composiciones de catálogo. Trabajan mucho con productores nacionales.",
    barrio: "Chamberí",
    web: "https://mossfloristas.com",
    etiquetas: ["flores", "ramos", "temporada", "bodas"],
    verificado: false
  },

  /* ------------------------------------------- juguetes y regalos */
  {
    id: "kamchatka-magic-toys",
    nombre: "Kamchatka Magic Toys",
    categoria: "juguetes",
    descripcion: "Juguetes de madera, reediciones vintage y juegos raros que no vas a encontrar en una juguetería normal. Tan bonita que da pena comprar.",
    barrio: "Centro",
    etiquetas: ["juguetes", "madera", "vintage", "regalo"],
    verificado: false
  },

  /* ------------------------------------------ librerías (ampliación) */
  {
    id: "cuesta-de-moyano",
    nombre: "Casetas de la Cuesta de Moyano",
    categoria: "librerias",
    descripcion: "Treinta casetas de libro viejo junto al Botánico, en pie desde 1919. Cada una es un negocio distinto con su manía: una tira al ensayo, otra al cómic, otra al infantil antiguo.",
    barrio: "Retiro",
    direccion: "C/ Claudio Moyano, 19",
    coords: [40.409843, -3.690332],
    desde: 1919,
    etiquetas: ["libro viejo", "segunda mano", "descatalogado", "histórica"],
    verificado: true
  },
  {
    id: "libreria-san-gines",
    nombre: "Librería San Ginés",
    categoria: "librerias",
    descripcion: "Caseta de libro usado encajada en el pasadizo de San Ginés, en una esquina donde se venden libros desde hace siglos. Fondo revuelto y precios de saldo.",
    barrio: "Centro",
    direccion: "Pasadizo de San Ginés, 2",
    coords: [40.417322, -3.706733],
    desde: 1650,
    etiquetas: ["libro viejo", "segunda mano", "histórica", "saldo"],
    verificado: true
  },
  {
    id: "libreria-perez-galdos",
    nombre: "Librería Pérez Galdós",
    categoria: "librerias",
    descripcion: "Librería de viejo para libros raros, agotados y descatalogados. De las de preguntar por un título imposible y que te lo busquen.",
    barrio: "Chueca",
    etiquetas: ["libro viejo", "raro", "descatalogado", "segunda mano"],
    verificado: false
  },
  {
    id: "el-rincon-de-lectura",
    nombre: "El Rincón de Lectura",
    categoria: "librerias",
    descripcion: "Compra-venta de libros de segunda mano y de ocasión junto a la plaza del Dos de Mayo. También compran bibliotecas enteras.",
    barrio: "Malasaña",
    etiquetas: ["segunda mano", "ocasión", "compra-venta"],
    verificado: false
  },
  {
    id: "lata-peinada",
    nombre: "Lata Peinada",
    categoria: "librerias",
    descripcion: "Librería dedicada en exclusiva a la literatura latinoamericana, con editoriales que no suelen cruzar el charco. Programan clubes de lectura y presentaciones.",
    barrio: "Las Letras",
    etiquetas: ["latinoamérica", "narrativa", "editoriales pequeñas"],
    verificado: false
  },
  {
    id: "la-fugitiva",
    nombre: "La Fugitiva",
    categoria: "librerias",
    descripcion: "Librería café con fondo de narrativa y ensayo y una programación cultural constante. De las que funcionan como sala de estar del barrio.",
    barrio: "Lavapiés",
    etiquetas: ["narrativa", "café", "ensayo", "barrio"],
    verificado: false
  },
  {
    id: "enclave-de-libros",
    nombre: "Enclave de Libros",
    categoria: "librerias",
    descripcion: "Librería y espacio cultural con fondo de pensamiento crítico, poesía y edición independiente. Acogen talleres, recitales y presentaciones casi a diario.",
    barrio: "Centro",
    etiquetas: ["ensayo", "poesía", "edición independiente", "talleres"],
    verificado: false
  },
  {
    id: "berkana",
    nombre: "Librería Berkana",
    categoria: "librerias",
    descripcion: "La librería LGTB de Madrid, abierta en 1993 y punto de referencia del barrio desde entonces. Narrativa, ensayo, cómic y fondo difícil de encontrar en otra parte.",
    barrio: "Chueca",
    desde: 1993,
    etiquetas: ["lgtb", "narrativa", "ensayo", "histórica"],
    verificado: false
  },

  /* -------------------------------------------------- cómics y juegos */
  {
    id: "generacion-x",
    nombre: "Generación X",
    categoria: "papeleria",
    descripcion: "Cómic, manga, juegos de mesa y rol desde 1994. Dos plantas de exposición, cafetería dentro y torneos casi cada semana.",
    barrio: "Centro",
    direccion: "C/ del Conde de Romanones",
    web: "https://www.generacionx.es",
    desde: 1994,
    etiquetas: ["cómic", "manga", "juegos de mesa", "rol"],
    verificado: true
  },
  {
    id: "akira-comics",
    nombre: "Akira Cómics",
    categoria: "papeleria",
    descripcion: "Abierta por la familia Marugán en 1993 y premiada con un Eisner. Catálogo hondo de Marvel, DC, manga y cómic europeo, con gente detrás del mostrador que se lo ha leído.",
    barrio: "Malasaña",
    desde: 1993,
    etiquetas: ["cómic", "manga", "europeo", "coleccionismo"],
    verificado: true
  },

  /* ------------------------------------------------------- fotografía */
  {
    id: "la-peliculera",
    nombre: "La Peliculera",
    categoria: "foto",
    descripcion: "Tienda y laboratorio de fotografía analógica: revelan carrete, hacen copias y venden cámaras lomográficas y de segunda mano.",
    barrio: "Chueca",
    web: "https://lapeliculera.com",
    etiquetas: ["analógica", "carrete", "revelado", "cámaras"],
    verificado: true
  },
  {
    id: "cuarto-color-lab",
    nombre: "Cuarto Color Lab",
    categoria: "foto",
    descripcion: "Laboratorio de analógico con revelado profesional, venta de película, reparación de cámaras y talleres. Atienden carrete a carrete.",
    barrio: "Centro",
    web: "https://cuartocolorlab.com",
    etiquetas: ["analógica", "revelado", "laboratorio", "talleres"],
    verificado: true
  },
  {
    id: "sales-de-plata",
    nombre: "Sales de Plata",
    categoria: "foto",
    descripcion: "Tienda, estudio y laboratorio en el Barrio de las Letras: compra-venta de cámaras, cursos, alquiler de equipo y reparación.",
    barrio: "Las Letras",
    web: "https://www.salesdeplata.com",
    etiquetas: ["analógica", "cámaras", "cursos", "alquiler"],
    verificado: true
  },
  {
    id: "lab35",
    nombre: "Lab35",
    categoria: "foto",
    descripcion: "Laboratorio de revelado en Malasaña donde dejas el carrete y lo recoges escaneado en un par de horas. Precios claros y sin misterio.",
    barrio: "Malasaña",
    etiquetas: ["revelado", "escaneado", "carrete", "analógica"],
    verificado: true
  },
  {
    id: "revelab",
    nombre: "Revelab Studio",
    categoria: "foto",
    descripcion: "Laboratorio y tienda de fotografía química: película de todo tipo, revelado en color y blanco y negro, y accesorios de analógico.",
    web: "https://www.revelab.es",
    etiquetas: ["analógica", "película", "revelado", "blanco y negro"],
    verificado: true
  },

  /* -------------------------------------------- alimentación (amplía) */
  {
    id: "casa-gonzalez",
    nombre: "Casa González",
    categoria: "alimentacion",
    descripcion: "Ultramarinos de 1931 con mostrador de mármol: quesos, embutidos, conservas y vinos, seleccionados con el criterio de tres generaciones.",
    barrio: "Las Letras",
    direccion: "C/ del León, 12",
    desde: 1931,
    etiquetas: ["ultramarinos", "quesos", "conservas", "embutidos"],
    verificado: false
  },
  {
    id: "lhardy",
    nombre: "Lhardy",
    categoria: "alimentacion",
    descripcion: "Tienda de comestibles finos abierta en 1839, con su samovar de consomé en la entrada. Fiambres, croquetas, empanadas y dulces para llevar.",
    barrio: "Centro",
    direccion: "Carrera de San Jerónimo, 8",
    desde: 1839,
    etiquetas: ["comestibles", "consomé", "centenario", "fiambres"],
    verificado: false
  },
  {
    id: "spicy-yuli",
    nombre: "Spicy Yuli",
    categoria: "alimentacion",
    descripcion: "Especias a granel de medio mundo, tés e infusiones, en una tienda diminuta donde te dejan oler todo antes de comprar.",
    barrio: "Malasaña",
    direccion: "C/ de Valverde, 42",
    etiquetas: ["especias", "granel", "té", "infusiones"],
    verificado: true
  },

  /* -------------------------------------------- pan y dulces (amplía) */
  {
    id: "pasteleria-ascaso",
    nombre: "Pastelería Ascaso",
    categoria: "panaderia",
    descripcion: "Obrador familiar nacido en Huesca en 1890 y asentado en Madrid desde los setenta. Bombonería y pastelería clásica hecha en casa.",
    barrio: "Chamberí",
    direccion: "C/ de Orellana, 4",
    desde: 1890,
    etiquetas: ["pastelería", "bombones", "obrador", "centenario"],
    verificado: true
  },
  {
    id: "bomboneria-la-pajarita",
    nombre: "Bombonería La Pajarita",
    categoria: "panaderia",
    descripcion: "Bombones y caramelos artesanos desde 1852, envueltos en las mismas cajas de siempre. Los caramelos de frutas siguen haciéndose a mano.",
    barrio: "Salamanca",
    direccion: "C/ Villanueva, 14",
    coords: [40.423173, -3.688676],
    web: "https://bombonerialapajarita.es/?utm_source=mybusiness&utm_medium=boton&utm_campaign=ficha",
    desde: 1852,
    etiquetas: ["bombones", "caramelos", "centenario", "regalo"],
    verificado: true
  },
  {
    id: "heladeria-kalua",
    nombre: "Kalúa",
    categoria: "panaderia",
    descripcion: "Heladería con obrador propio y helado de textura muy cremosa. Sabores que rotan con la temporada, sin colorantes de feria.",
    barrio: "Retiro",
    direccion: "C/ de Narváez, 62",
    etiquetas: ["helado", "artesano", "obrador"],
    verificado: true
  },
  {
    id: "brando-helado",
    nombre: "Brando",
    categoria: "panaderia",
    descripcion: "Heladería abierta en 2021 que elabora el cien por cien de sus helados en obrador propio, con producto de temporada y muy poca azúcar añadida.",
    web: "https://www.brandohelado.com",
    desde: 2021,
    etiquetas: ["helado", "artesano", "obrador", "temporada"],
    verificado: true
  },
  {
    id: "heladeria-los-alpes",
    nombre: "Heladería Los Alpes",
    categoria: "panaderia",
    descripcion: "Heladería de barrio de las de toda la vida en Chamberí, con horchata, granizados y los sabores clásicos bien hechos.",
    barrio: "Chamberí",
    etiquetas: ["helado", "horchata", "granizado", "barrio"],
    verificado: false
  },

  /* ---------------------------------------------- café y té (amplía) */
  {
    id: "golden-tips",
    nombre: "Golden Tips",
    categoria: "cafe",
    descripcion: "Tienda de té a granel con fondo largo de tés de origen y accesorios para prepararlos. Aconsejan según cómo lo vayas a hacer en casa.",
    barrio: "Chueca",
    direccion: "C/ de Argensola, 6",
    etiquetas: ["té", "granel", "teteras", "infusiones"],
    verificado: true
  },
  {
    id: "la-chaiteca",
    nombre: "La Chaiteca",
    categoria: "cafe",
    descripcion: "Té y café a granel en Chamberí, pesado delante de ti. Tienda pequeña, catálogo largo y explicaciones sin prisa.",
    barrio: "Chamberí",
    etiquetas: ["té", "café", "granel", "chai"],
    verificado: true
  },
  {
    id: "cafetearte",
    nombre: "CaféTéArte",
    categoria: "cafe",
    descripcion: "Tienda especializada en tés e infusiones de calidad, con asesoramiento de verdad sobre orígenes, cortes y temperaturas.",
    barrio: "Chamberí",
    direccion: "Avenida de la Reina Victoria, 52",
    web: "https://www.cafetearte.es",
    etiquetas: ["té", "infusiones", "granel", "café"],
    verificado: true
  },

  /* ------------------------------------------------- hogar (amplía) */
  {
    id: "ferreteria-del-olmo",
    nombre: "Ferretería del Olmo",
    categoria: "hogar",
    descripcion: "Antigua Ferretería Subero, abierta en 1862: cajones de tornillos sueltos, herramienta de oficio y gente que sabe qué pieza necesitas con solo describirla.",
    barrio: "La Latina",
    direccion: "Ronda de Segovia, 4",
    coords: [40.410104, -3.717432],
    web: "http://ferreteriadelolmo.es",
    desde: 1862,
    etiquetas: ["ferretería", "herramienta", "centenario", "tornillos"],
    verificado: true
  },
  {
    id: "almacenes-el-botijo",
    nombre: "Almacenes El Botijo",
    categoria: "hogar",
    descripcion: "Droguería y perfumería con origen en 1754, nacida como bazar donde se vendía de todo: mimbre, esparto, cordelería, botería. Sigue oliendo a jabón de siempre.",
    barrio: "La Latina",
    direccion: "C/ Toledo, 35",
    coords: [40.414555, -3.707016],
    web: "https://elbotijo1754.es",
    desde: 1754,
    etiquetas: ["droguería", "perfumería", "cordelería", "centenario"],
    verificado: true
  },

  /* --------------------------------------------- vintage y anticuarios */
  {
    id: "marantikk",
    nombre: "Marantikk",
    categoria: "vintage",
    descripcion: "Más de 250 metros en pleno Rastro con muebles de diseño, antigüedades y piezas de decoración de casi cualquier década del siglo XX.",
    barrio: "Rastro",
    web: "https://www.marantikk.com",
    etiquetas: ["antigüedades", "muebles", "diseño", "decoración"],
    verificado: true
  },
  {
    id: "indoors-madrid",
    nombre: "Indoors Madrid",
    categoria: "vintage",
    descripcion: "Anticuario de setenta metros en el Rastro con mobiliario y decoración desde el siglo XIX hasta los años setenta, seleccionado pieza a pieza.",
    barrio: "Rastro",
    web: "http://indoorsmadrid.com",
    etiquetas: ["anticuario", "muebles", "decoración", "siglo xx"],
    verificado: true
  },
  {
    id: "juanma-lizana",
    nombre: "Juanma Lizana",
    categoria: "vintage",
    descripcion: "Anticuario con un revoltijo estupendo de aparadores mid-century, sillas tubulares de los setenta y lámparas imposibles de encontrar en otro sitio.",
    barrio: "Rastro",
    direccion: "C/ de Mira el Río Alta, 16",
    etiquetas: ["anticuario", "mid-century", "muebles", "lámparas"],
    verificado: true
  },
  {
    id: "rastroarte",
    nombre: "RastroArte",
    categoria: "vintage",
    descripcion: "Antigüedades, arte decorativo y piezas de colección conviviendo en el mismo local, con mobiliario clásico y objetos singulares.",
    barrio: "Rastro",
    direccion: "Ribera de Curtidores, 26",
    etiquetas: ["antigüedades", "arte", "coleccionismo", "muebles"],
    verificado: true
  },
  {
    id: "la-recova",
    nombre: "La Recova",
    categoria: "vintage",
    descripcion: "De las primeras del Rastro en apostar por la estética nórdica: muebles y decoración de mediados del siglo XX, restaurados con criterio.",
    barrio: "Rastro",
    etiquetas: ["nórdico", "mid-century", "muebles", "restaurado"],
    verificado: true
  },
  {
    id: "el-8-rastro",
    nombre: "El 8",
    categoria: "vintage",
    descripcion: "Local mítico y minúsculo que regenta Máximo, donde mezcla muebles vintage restaurados con diseños propios. Poca pieza y muy escogida.",
    barrio: "Rastro",
    etiquetas: ["vintage", "muebles", "restauración", "diseño propio"],
    verificado: true
  },

  /* ------------------------------------------------- moda (amplía) */
  {
    id: "la-intrusa",
    nombre: "La Intrusa",
    categoria: "moda",
    descripcion: "Abierta en 2008 para dar salida a diseñadores emergentes: ropa hecha a mano, complementos y objetos de diseño de creadores que empiezan.",
    barrio: "Malasaña",
    web: "http://laintrusashowroom.com",
    desde: 2008,
    etiquetas: ["diseñadores", "hecho a mano", "complementos", "emergentes"],
    verificado: true
  },
  {
    id: "misia-sert",
    nombre: "Misia Sert",
    categoria: "moda",
    descripcion: "Multimarca nacida para comprar menos pero mejor: marcas independientes, sostenibles y atemporales, la mayoría dirigidas por mujeres.",
    barrio: "Conde Duque",
    etiquetas: ["sostenible", "multimarca", "atemporal", "independiente"],
    verificado: true
  },
  {
    id: "sportivo",
    nombre: "Sportivo",
    categoria: "moda",
    descripcion: "Tienda de ropa de hombre con una selección muy personal de marcas japonesas y europeas que casi no se ven en España.",
    barrio: "Conde Duque",
    etiquetas: ["hombre", "japonesa", "selección", "multimarca"],
    verificado: false
  },

  /* ----------------------------------------------- música (amplía) */
  {
    id: "hazen",
    nombre: "Hazen",
    categoria: "musica",
    descripcion: "Casa de instrumentos con raíces en el siglo XIX, junto al Palacio Real. Pianos, cuerda y trato con luthiers independientes de primera fila.",
    barrio: "Ópera",
    direccion: "C/ Arrieta, 8",
    coords: [40.419963, -3.709959],
    web: "https://www.hazen.es/es/home",
    desde: 1814,
    etiquetas: ["pianos", "instrumentos", "cuerda", "histórica"],
    verificado: true
  },
  {
    id: "garrido-bailen",
    nombre: "Garrido Bailén",
    categoria: "musica",
    descripcion: "Tienda veterana de instrumentos y accesorios, con venta y alquiler. De las de entrar a por unas cuerdas y salir sabiendo más.",
    barrio: "Centro",
    direccion: "C/ Mayor, 88",
    etiquetas: ["instrumentos", "alquiler", "accesorios", "cuerdas"],
    verificado: true
  },
  {
    id: "la-guitarreria-de-madrid",
    nombre: "La Guitarrería de Madrid",
    categoria: "musica",
    descripcion: "Guitarras españolas, clásicas, flamencas y acústicas hechas a mano por los mejores luthiers del país, en una selección muy cuidada.",
    barrio: "Lavapiés",
    direccion: "C/ de Atocha, 99",
    web: "https://laguitarreriademadrid.es",
    etiquetas: ["guitarras", "luthier", "flamenca", "clásica"],
    verificado: true
  },

  /* ---------------------------------------------- oficios (amplía) */
  {
    id: "rejilleria-lopez",
    nombre: "Rejillería López",
    categoria: "oficios",
    descripcion: "Desde 1877 tejen a mano la rejilla y la anea de las sillas. Un oficio que casi no queda nadie que sepa hacer, y aquí se sigue haciendo igual.",
    barrio: "Centro",
    direccion: "C/ Isabel la Católica, 7",
    coords: [40.421389, -3.709193],
    web: "https://www.rejillerialopez.es",
    desde: 1877,
    etiquetas: ["rejilla", "anea", "sillas", "centenario"],
    verificado: true
  },
  {
    id: "sanatorio-de-munecos",
    nombre: "El Sanatorio de Muñecos",
    categoria: "oficios",
    descripcion: "Hospital de muñecas desde 1916: reponen ojos, pelo y brazos a muñecos de varias generaciones. También venden piezas sueltas y juguetes antiguos.",
    barrio: "Centro",
    direccion: "C/ de Preciados",
    desde: 1916,
    etiquetas: ["muñecas", "restauración", "centenario", "reparación"],
    verificado: true
  },
  {
    id: "sanchez-reparacion-calzado",
    nombre: "Sánchez Reparación y Calzado",
    categoria: "oficios",
    descripcion: "Zapatería de reparación abierta por Mariano Sánchez en 1978, especializada en calzado y marroquinería y en el arte de la pátina a mano.",
    barrio: "Chamberí",
    desde: 1978,
    etiquetas: ["zapatero", "reparación", "pátina", "marroquinería"],
    verificado: true
  },
  {
    id: "taller-luis-mancho",
    nombre: "Taller Luis Mancho",
    categoria: "oficios",
    descripcion: "Taller de zapatería en Argüelles con mucha mano para los arreglos difíciles, incluido el calzado ortopédico.",
    barrio: "Argüelles",
    web: "https://www.tallerzapateriamadrid.com",
    etiquetas: ["zapatero", "reparación", "ortopédico", "arreglos"],
    verificado: true
  },

  /* ---------------------------------------------- plantas (amplía) */
  {
    id: "cacto-cacto",
    nombre: "Cacto Cacto",
    categoria: "plantas",
    descripcion: "Floristería especializada en cactus y suculentas, con variedades raras y consejo honesto sobre cuánta luz y cuánta agua aguanta cada una.",
    etiquetas: ["cactus", "suculentas", "plantas", "macetas"],
    verificado: true
  },
  {
    id: "columelas",
    nombre: "Columelas Floristería",
    categoria: "plantas",
    descripcion: "Floristería de barrio con ramos, plantas de interior y reparto a domicilio el mismo día. Trabajan mucho la flor de temporada.",
    web: "https://columelas.com",
    etiquetas: ["flores", "ramos", "plantas", "a domicilio"],
    verificado: false
  },

  /* --------------------------------------------- juguetes (amplía) */
  {
    id: "circo-kids",
    nombre: "Circo Kids",
    categoria: "juguetes",
    descripcion: "Juguetería pequeña y coqueta con juguetes de madera, cartón y plástico reciclado, además de juegos de mesa y libros ilustrados.",
    barrio: "Chueca",
    direccion: "C/ de Argensola, 2",
    etiquetas: ["juguetes", "madera", "reciclado", "libros ilustrados"],
    verificado: true
  },
  {
    id: "wonderland",
    nombre: "Wonderland",
    categoria: "juguetes",
    descripcion: "Especialistas en juguete de madera, con material de manualidades, decoración infantil y accesorios escogidos uno a uno.",
    barrio: "Lavapiés",
    direccion: "C/ de Santa Isabel, 11",
    etiquetas: ["juguetes", "madera", "manualidades", "infantil"],
    verificado: true
  },
  {
    id: "lobo-feliz",
    nombre: "Lobo Feliz",
    categoria: "juguetes",
    descripcion: "Juguetería especializada en juego educativo, en pleno Malasaña. Te preguntan por el niño antes de recomendarte nada.",
    barrio: "Malasaña",
    direccion: "C/ de San Mateo, 28",
    etiquetas: ["juguetes", "educativo", "infantil", "madera"],
    verificado: true
  },

  /* ------------------------------------------- alimentación gourmet */
  {
    id: "coalla-gourmet",
    nombre: "Coalla Gourmet",
    categoria: "alimentacion",
    descripcion: "Dos plantas de producto selecto: quesos, charcutería, conservas y una bodega larga. Tienen barra al fondo para catar lo mismo que venden.",
    etiquetas: ["gourmet", "quesos", "conservas", "charcutería", "vinos"],
    verificado: true
  },
  {
    id: "petramora",
    nombre: "Petramora",
    categoria: "alimentacion",
    descripcion: "Delicatessen pequeño donde mandan las carnes y los lácteos de oveja churra de la Dehesa de la Guadaña. También vermuts, ahumados y conservas escogidas una a una.",
    etiquetas: ["gourmet", "lácteos", "carne", "ahumados", "vermut"],
    verificado: true
  },
  {
    id: "delicatessen-picoteo",
    nombre: "Delicatessen + Picoteo",
    categoria: "alimentacion",
    descripcion: "Producto de pequeños productores de toda España: conservas difíciles de ver fuera de su provincia, embutidos, jamones y quesos de vaca, oveja y cabra.",
    etiquetas: ["gourmet", "conservas", "embutidos", "quesos", "jamón"],
    verificado: true
  },
  {
    id: "delicatessen-n",
    nombre: "Delicatessen N",
    categoria: "alimentacion",
    descripcion: "Tienda de comestibles selectos abierta en 2017 cerca de la Puerta de Alcalá, con un catálogo corto y muy mirado de marcas pequeñas.",
    direccion: "Cerca de la Puerta de Alcalá",
    desde: 2017,
    etiquetas: ["gourmet", "delicatessen", "conservas", "selecto"],
    verificado: false
  },
  {
    id: "mercado-de-vallehermoso",
    nombre: "Mercado de Vallehermoso",
    categoria: "alimentacion",
    descripcion: "El único mercado de productores artesanos de Madrid. Carnicerías, pescaderías y fruterías de siempre conviviendo con puestos nuevos que traen producto de pequeña escala.",
    barrio: "Chamberí",
    web: "https://mercadovallehermoso.es",
    etiquetas: ["mercado", "productores", "carnicería", "pescadería", "frutería"],
    verificado: true
  },
  {
    id: "mercado-de-anton-martin",
    nombre: "Mercado de Antón Martín",
    categoria: "alimentacion",
    descripcion: "Mercado de barrio de tres plantas, con pescado, carne y fruta en los puestos de siempre y una parte buena de producto ecológico.",
    barrio: "Lavapiés",
    web: "https://www.mercadoantonmartin.com",
    etiquetas: ["mercado", "pescadería", "carnicería", "ecológico", "barrio"],
    verificado: true
  },
  {
    id: "el-granel-de-corredera",
    nombre: "El Granel de Corredera",
    categoria: "alimentacion",
    descripcion: "Legumbres, pasta, frutos secos, harinas y especias al peso, casi todo ecológico. Llevas tus botes y te los rellenan.",
    barrio: "Malasaña",
    etiquetas: ["granel", "legumbres", "frutos secos", "especias", "ecológico"],
    verificado: true
  },
  {
    id: "granel-madrid",
    nombre: "Granel Madrid",
    categoria: "alimentacion",
    descripcion: "Tienda de venta a granel en pleno centro: legumbres, frutos secos, harinas y especias pesadas al momento y sin envase de más.",
    barrio: "Centro",
    web: "https://granelmadrid.com",
    etiquetas: ["granel", "legumbres", "harinas", "especias", "sin plástico"],
    verificado: true
  },
  {
    id: "la-esquina-del-granel",
    nombre: "La Esquina del Granel",
    categoria: "alimentacion",
    descripcion: "Granel cien por cien ecológico y cero envases de plástico: legumbres, fruta deshidratada, algas, especias y también higiene y limpieza.",
    web: "https://laesquinadelgranel.es",
    etiquetas: ["granel", "ecológico", "sin plástico", "algas", "especias"],
    verificado: true
  },

  /* ------------------------------------------ chocolate y bombones */
  {
    id: "bomboneria-santa",
    nombre: "Bombonería Santa",
    categoria: "panaderia",
    descripcion: "Bombonería de los años veinte en el barrio de Salamanca. Sus rocas de almendra y avellana, los rizados y los troncos de chocolate siguen haciéndose igual.",
    barrio: "Salamanca",
    etiquetas: ["bombones", "chocolate", "histórica", "regalo"],
    verificado: false
  },
  {
    id: "24-onzas",
    nombre: "24 Onzas",
    categoria: "panaderia",
    descripcion: "Tienda diminuta donde Carmen Capote elabora cada día en su obrador los bombones, tabletas, trufas y helados que vende.",
    barrio: "Salamanca",
    direccion: "C/ de Espartinas",
    etiquetas: ["bombones", "chocolate", "obrador", "trufas"],
    verificado: true
  },
  {
    id: "mon-chocolate",
    nombre: "Mon Chocolate",
    categoria: "panaderia",
    descripcion: "Chocolates de origen —Ghana, Uganda, Costa Rica, Brasil—, turrones artesanos, marrones glacés y caramelos, en una tienda de barrio de Chamberí.",
    barrio: "Chamberí",
    direccion: "C/ de Lucio del Valle, 12",
    etiquetas: ["chocolate", "turrón", "marrón glacé", "origen"],
    verificado: true
  },

  /* -------------------------------------- complementos y marroquinería */
  {
    id: "nella",
    nombre: "Nella",
    categoria: "moda",
    descripcion: "Taller de marroquinería donde diseñan y cosen bolsos de piel a mano, en series cortas y por encargo. Se puede pedir una pieza a medida.",
    web: "https://nella.soy",
    etiquetas: ["bolsos", "piel", "hecho a mano", "a medida", "complementos"],
    verificado: true
  },
  {
    id: "curticon",
    nombre: "Curticón",
    categoria: "moda",
    descripcion: "Bolsos, mochilas, monederos y cinturones de piel hechos en su propio taller, cada pieza distinta de la anterior.",
    web: "https://artesaniaenpielmadrid.com",
    etiquetas: ["bolsos", "cinturones", "piel", "artesano", "complementos"],
    verificado: true
  },
  {
    id: "creaciones-caspiel",
    nombre: "Creaciones Caspiel",
    categoria: "moda",
    descripcion: "Desde 1975 fabricando bolsos de señora y artículos de piel en Madrid, con la hechura y los acabados de la marroquinería de antes.",
    desde: 1975,
    etiquetas: ["bolsos", "piel", "marroquinería", "complementos"],
    verificado: false
  },
  {
    id: "piel-para-artesanos",
    nombre: "Piel para Artesanos",
    categoria: "oficios",
    descripcion: "Almacén de piel curtida para quien trabaja el cuero: vaquetas, napas, serrajes y herramienta. Te cortan la pieza que necesites.",
    barrio: "La Latina",
    direccion: "C/ de la Colegiata, 14",
    web: "https://pielparaartesanos.com",
    etiquetas: ["cuero", "piel", "materiales", "marroquinería", "herramienta"],
    verificado: true
  },

  /* -------------------------------------------------------- joyería */
  {
    id: "aktual-taller",
    nombre: "Aktual Taller de Joyería",
    categoria: "joyeria",
    descripcion: "Diseñan y fabrican cada pieza en su taller del barrio de Palacio. También dan cursos para que te hagas tú la joya desde el lingote.",
    barrio: "Palacio",
    web: "https://aktualtaller.com",
    etiquetas: ["joyas", "taller", "cursos", "hecho a mano", "plata"],
    verificado: true
  },
  {
    id: "jampe-joyeros",
    nombre: "JAMPE Maestros Joyeros",
    categoria: "joyeria",
    descripcion: "Taller abierto en 1995 por Miguel Martínez, heredero de una familia con más de cincuenta años de oficio. Joyas por encargo y arreglos difíciles.",
    web: "https://www.jampe.es",
    desde: 1995,
    etiquetas: ["joyas", "a medida", "taller", "encargo", "arreglos"],
    verificado: true
  },
  {
    id: "joyeria-mirayo",
    nombre: "Joyería Mirayo",
    categoria: "joyeria",
    descripcion: "Taller de joyería con más de cien años de historia en el centro, que además acoge a diseñadores de joya contemporánea.",
    barrio: "Centro",
    web: "https://www.mirayo.com",
    etiquetas: ["joyas", "taller", "centenario", "diseñadores"],
    verificado: true
  },
  {
    id: "la-sanchez",
    nombre: "La Sánchez",
    categoria: "joyeria",
    descripcion: "Joyería de autor en el Barrio de las Letras, con diseño propio y producción artesanal. Piezas pensadas de una en una.",
    barrio: "Las Letras",
    etiquetas: ["joyas", "autor", "artesanal", "diseño propio"],
    verificado: true
  },
  {
    id: "tiahra",
    nombre: "Tiahra",
    categoria: "joyeria",
    descripcion: "Atelier de joyería de piezas únicas en plata, cuero, cristal checo, piedras semipreciosas y esmaltes hechos a mano.",
    etiquetas: ["joyas", "plata", "esmalte", "piezas únicas", "atelier"],
    verificado: true
  },


  /* ------------------------------------------ carnicería y pescadería */
  {
    id: "carnes-moran",
    nombre: "Carnes Morán",
    categoria: "carniceria",
    descripcion: "Carnicería que abrió Agapito Morán hace más de cincuenta años y siguen llevando sus herederos. Cortes tradicionales y carne de pueblo, con el despiece hecho en la tienda.",
    web: "https://carnesmoran.com",
    etiquetas: ["carnicería", "familiar", "despiece", "carne"],
    verificado: false
  },
  {
    id: "saboli-taboli",
    nombre: "Saboli Taboli",
    categoria: "carniceria",
    descripcion: "Puesto de carnicería que Jesús Rodríguez abrió en 1964 en el Mercado de los Mostenses y que lleva desde 1980 con su hijo. Dos generaciones detrás del mismo mostrador.",
    barrio: "Centro",
    direccion: "Mercado de los Mostenses, puestos 35 y 36",
    desde: 1964,
    etiquetas: ["carnicería", "mercado", "familiar", "cordero"],
    verificado: true
  },
  {
    id: "raza-nostra",
    nombre: "Raza Nostra",
    categoria: "carniceria",
    descripcion: "Carnicería especializada en razas autóctonas españolas, con maduraciones largas y piezas que te preparan como se las pidas.",
    etiquetas: ["carnicería", "razas autóctonas", "madurada", "chuletón"],
    verificado: false
  },
  {
    id: "cesareo-gomez",
    nombre: "Cesáreo Gómez",
    categoria: "carniceria",
    descripcion: "Casa de carnes veterana que surte a buena parte de los restaurantes de Madrid y vende también al público. Selección muy exigente de vacuno.",
    etiquetas: ["carnicería", "vacuno", "selección", "restauración"],
    verificado: false
  },
  {
    id: "las-viandas-de-julian",
    nombre: "Las Viandas de Julián",
    categoria: "carniceria",
    descripcion: "Carnicería de barrio con producto escogido y trato de los de antes: te aconsejan el corte según lo que vayas a cocinar.",
    etiquetas: ["carnicería", "barrio", "embutidos", "carne"],
    verificado: false
  },
  {
    id: "pescaderias-corunesas",
    nombre: "Pescaderías Coruñesas",
    categoria: "carniceria",
    descripcion: "Pescadería familiar con más de un siglo de oficio, que trae a diario pescado de lonja del norte. De las que te limpian la pieza como es debido.",
    barrio: "Moncloa",
    direccion: "C/ Juan Montalvo, 14",
    coords: [40.448522, -3.710322],
    web: "https://www.pescaderiascorunesas.es",
    desde: 1911,
    etiquetas: ["pescadería", "pescado", "marisco", "lonja", "familiar"],
    verificado: true
  },

  /* ----------------------------------------- peluquería y estética */
  {
    id: "blackstone-barberia",
    nombre: "Blackstone",
    categoria: "belleza",
    descripcion: "Barbería de estética eduardiana con el aire de los clubes de principios del siglo XX. Afeitado a navaja, toalla caliente y corte clásico.",
    barrio: "Chamberí",
    direccion: "C/ de Monte Esquinza, 36",
    etiquetas: ["barbería", "navaja", "afeitado", "clásica"],
    verificado: true
  },
  {
    id: "chamberi-5",
    nombre: "Chamberí 5",
    categoria: "belleza",
    descripcion: "Barbería de Daniel Perales, con más de veinte años de oficio y tradición familiar detrás. Afeitado a navaja, arreglo de barba y cortes de la vieja escuela.",
    barrio: "Chamberí",
    etiquetas: ["barbería", "navaja", "barba", "clásica"],
    verificado: true
  },
  {
    id: "la-barberia-de-vergara",
    nombre: "La Barbería de Vergara",
    categoria: "belleza",
    descripcion: "Barbería de barrio que mezcla el oficio de siempre con corte actual, sin prisa y con mucha atención al detalle.",
    etiquetas: ["barbería", "corte", "barba", "barrio"],
    verificado: false
  },
  {
    id: "ecotelier-natural",
    nombre: "Ecotelier Natural",
    categoria: "belleza",
    descripcion: "Centro de estética natural con herbolario propio: tratamientos con cosmética bio y venta de suplementos, plantas y aceites.",
    direccion: "C/ del Príncipe de Vergara, 215",
    web: "https://ecoteliernatural.es",
    etiquetas: ["estética", "cosmética natural", "herbolario", "bio"],
    verificado: true
  },
  {
    id: "la-canela",
    nombre: "La Canela",
    categoria: "belleza",
    descripcion: "Tienda ecológica de arriba abajo: cosmética natural, alimentación y material de yoga, con marcas pequeñas y mucho granel.",
    etiquetas: ["cosmética natural", "ecológico", "jabones", "granel"],
    verificado: true
  },
  {
    id: "restore7",
    nombre: "Restore7",
    categoria: "belleza",
    descripcion: "Tienda de cosmética e higiene sostenible con formato sólido y recargable, pensada para no generar envase.",
    barrio: "Chamberí",
    direccion: "C/ de Vallehermoso, 41",
    etiquetas: ["cosmética", "sostenible", "jabones", "sin plástico"],
    verificado: false
  },


  /* --- Comercios centenarios (Portal de Datos Abiertos del Ayuntamiento) --- */
  {
    id: "bodegas-mariano-madrueno",
    nombre: "Bodegas Mariano Madrueño",
    categoria: "vinos",
    descripcion: "Bodega de 1895 con la estantería original hasta el techo: vinos, licores y vermut de elaboración propia.",
    barrio: "Centro",
    direccion: "C/ Postigo de San Martín, 6",
    coords: [40.419459, -3.706080],
    web: "https://marianomadrueno.es",
    desde: 1895,
    etiquetas: ["vino","licores","vermut","centenario"],
    verificado: true
  },
  {
    id: "casa-bartolome-carnes",
    nombre: "Casa Bartolomé Carnes",
    categoria: "carniceria",
    descripcion: "Carnicería de 1837 en la calle de la Sal, de las más antiguas que siguen abiertas en Madrid.",
    barrio: "Centro",
    direccion: "C/ Sal, 2",
    coords: [40.416043, -3.706339],
    desde: 1837,
    etiquetas: ["carnicería","centenario","carne"],
    verificado: true
  },
  {
    id: "como-en-casa",
    nombre: "Como En Casa",
    categoria: "alimentacion",
    descripcion: "Herbolario de 1906 junto al Rastro, con plantas a granel y quien te explica para qué sirve cada una.",
    barrio: "Embajadores",
    direccion: "C/ Ruda, 4",
    coords: [40.410611, -3.707605],
    desde: 1906,
    etiquetas: ["herbolario","plantas","granel","centenario"],
    verificado: true
  },
  {
    id: "herbolario-de-lafuente",
    nombre: "Herbolario de Lafuente",
    categoria: "alimentacion",
    descripcion: "Herbolario abierto en 1856, con los cajones y los tarros de siempre llenos de hierbas a granel.",
    barrio: "Chueca",
    direccion: "C/ Pelayo, 70",
    coords: [40.425032, -3.696986],
    web: "http://www.herbolariolafuente.com",
    desde: 1856,
    etiquetas: ["herbolario","plantas","granel","centenario"],
    verificado: true
  },
  {
    id: "jamoneria-lopez-pascual",
    nombre: "Jamonería López Pascual",
    categoria: "alimentacion",
    descripcion: "Jamonería de 1919 en la Corredera Baja, con el ibérico cortado a cuchillo delante de ti.",
    barrio: "Malasaña",
    direccion: "C/ Corredera baja de San Pablo, 13",
    coords: [40.422818, -3.704722],
    web: "https://jamonesibericosmadrid.com",
    desde: 1919,
    etiquetas: ["jamón","ibérico","embutidos","centenario"],
    verificado: true
  },
  {
    id: "artesanos-del-iberico-matas",
    nombre: "Artesanos Del Iberico Matas",
    categoria: "alimentacion",
    descripcion: "Elaboradores de ibérico desde 1916 en Villaverde, con curación propia y venta directa.",
    barrio: "Villaverde",
    direccion: "C/ Calamina, 4",
    coords: [40.346911, -3.711190],
    web: "https://www.jamonibericomatas.com",
    desde: 1916,
    etiquetas: ["ibérico","embutidos","jamón","centenario"],
    verificado: true
  },
  {
    id: "los-ferreros",
    nombre: "Los Ferreros",
    categoria: "alimentacion",
    descripcion: "Ultramarinos de 1892 junto a la Plaza Mayor, de los pocos que quedan con el género a la vista y a granel.",
    barrio: "Centro",
    direccion: "C/ Ciudad Rodrigo, 5",
    coords: [40.416396, -3.708621],
    desde: 1892,
    etiquetas: ["ultramarinos","colmado","centenario","granel"],
    verificado: true
  },
  {
    id: "mantequeria-andres",
    nombre: "Mantequería Andrés",
    categoria: "alimentacion",
    descripcion: "Mantequería de 1870 en el paseo de los Olmos: quesos, embutidos y conservas de toda la vida.",
    barrio: "Arganzuela",
    direccion: "Paseo de Olmos, 3",
    coords: [40.406342, -3.710957],
    web: "http://www.mantequeriaandres.com",
    desde: 1870,
    etiquetas: ["ultramarinos","quesos","conservas","centenario"],
    verificado: true
  },
  {
    id: "moderna-apicultura",
    nombre: "Moderna Apicultura",
    categoria: "alimentacion",
    descripcion: "Casa de la miel desde 1895, con mieles de una sola flor, polen, jalea y todo lo que da la colmena.",
    barrio: "Salamanca",
    direccion: "C/ Doctor Esquerdo, 47",
    coords: [40.423874, -3.668566],
    web: "https://www.lamodernaapicultura.es",
    desde: 1895,
    etiquetas: ["miel","apicultura","polen","centenario"],
    verificado: true
  },
  {
    id: "mercado-de-la-cebada",
    nombre: "Mercado de la Cebada",
    categoria: "alimentacion",
    descripcion: "Mercado de barrio desde 1875, con carnicerías, pescaderías y fruterías que llevan décadas en el mismo puesto.",
    barrio: "Las Letras",
    direccion: "Plaza Cebada",
    coords: [40.411644, -3.709963],
    web: "https://mercadodelacebada.com",
    desde: 1875,
    etiquetas: ["mercado","carnicería","pescadería","frutería"],
    verificado: true
  },
  {
    id: "mercado-de-la-paz",
    nombre: "Mercado de La Paz",
    categoria: "alimentacion",
    descripcion: "Mercado de 1882 en el barrio de Salamanca, de los mejor surtidos de Madrid en quesos y producto fresco.",
    barrio: "Salamanca",
    direccion: "C/ Ayala, 28",
    coords: [40.427809, -3.685710],
    web: "http://www.mercadolapaz.es",
    desde: 1882,
    etiquetas: ["mercado","quesos","frutería","centenario"],
    verificado: true
  },
  {
    id: "la-mexicana",
    nombre: "La Mexicana",
    categoria: "cafe",
    descripcion: "Tostadero de café y té desde 1837, de los primeros de Madrid. Se huele la tienda desde la calle.",
    barrio: "Centro",
    direccion: "C/ Preciados, 24",
    coords: [40.418754, -3.704897],
    web: "https://www.lamexicana.es",
    desde: 1837,
    etiquetas: ["café","té","tostadero","centenario"],
    verificado: true
  },
  {
    id: "la-flor-del-pan",
    nombre: "La Flor del Pan",
    categoria: "panaderia",
    descripcion: "Panadería de 1888 en la calle de Argensola, con el obrador en la trastienda.",
    barrio: "Chueca",
    direccion: "C/ Argensola, 17",
    coords: [40.425994, -3.694647],
    desde: 1888,
    etiquetas: ["pan","obrador","centenario"],
    verificado: true
  },
  {
    id: "la-mallorquina",
    nombre: "La Mallorquina",
    categoria: "panaderia",
    descripcion: "Pastelería de 1894 en la Puerta del Sol, famosa por sus napolitanas recién salidas del horno.",
    barrio: "Centro",
    direccion: "C/ Mayor, 2",
    coords: [40.416705, -3.704757],
    web: "https://pastelerialamallorquina.es",
    desde: 1894,
    etiquetas: ["pastelería","napolitana","centenario","bollería"],
    verificado: true
  },
  {
    id: "museo-del-pan-gallego",
    nombre: "Museo del Pan Gallego",
    categoria: "panaderia",
    descripcion: "Panadería de 1887 especializada en pan gallego, con hogazas de verdad y empanada.",
    barrio: "Centro",
    direccion: "Plaza Herradores, 30",
    coords: [40.417681, -3.708635],
    web: "https://www.museodelpangallego.com",
    desde: 1887,
    etiquetas: ["pan","gallego","empanada","centenario"],
    verificado: true
  },
  {
    id: "panaderia-del-rio",
    nombre: "Panadería del Río",
    categoria: "panaderia",
    descripcion: "Panadería de 1866 en la calle del Prado, en el mismo local desde entonces.",
    barrio: "Las Letras",
    direccion: "C/ Prado, 17",
    coords: [40.415650, -3.698627],
    desde: 1866,
    etiquetas: ["pan","obrador","centenario"],
    verificado: true
  },
  {
    id: "el-kince",
    nombre: "El Kince",
    categoria: "belleza",
    descripcion: "Barbería de 1900 en Cuchilleros, con sillones de los de antes y afeitado a navaja.",
    barrio: "Centro",
    direccion: "C/ Cuchilleros, 15",
    coords: [40.414407, -3.707891],
    web: "https://www.barberiaelkinze.es",
    desde: 1900,
    etiquetas: ["barbería","navaja","afeitado","centenario"],
    verificado: true
  },
  {
    id: "peluqueria-moderna",
    nombre: "Peluquería Moderna",
    categoria: "belleza",
    descripcion: "Peluquería abierta en 1881 en la calle de Alcalá, con la decoración original intacta.",
    barrio: "Salamanca",
    direccion: "C/ Alcalá, 121",
    coords: [40.423051, -3.680623],
    web: "https://peluqueriamoderna.com",
    desde: 1881,
    etiquetas: ["peluquería","centenario","clásica"],
    verificado: true
  },
  {
    id: "peluqueria-vallejo",
    nombre: "Peluquería Vallejo",
    categoria: "belleza",
    descripcion: "Peluquería de barrio desde 1916, en Lavapiés, con cuatro generaciones detrás de la tijera.",
    barrio: "Embajadores",
    direccion: "C/ Santa Isabel, 22",
    coords: [40.411262, -3.698695],
    web: "https://www.peluqueriavallejo.es",
    desde: 1916,
    etiquetas: ["peluquería","barrio","centenario","familiar"],
    verificado: true
  },
  {
    id: "urbano-peluqueros",
    nombre: "Urbano Peluqueros",
    categoria: "belleza",
    descripcion: "Peluquería de 1907 en Malasaña, de las que se heredan de padres a hijos.",
    barrio: "Malasaña",
    direccion: "C/ Colón, 10",
    coords: [40.424098, -3.701256],
    web: "https://toppeluquerias.blogspot.com",
    desde: 1907,
    etiquetas: ["peluquería","centenario","familiar"],
    verificado: true
  },
  {
    id: "sombrereria-medrano",
    nombre: "Sombrerería Medrano",
    categoria: "moda",
    descripcion: "La sombrerería más antigua de España, de 1832: del panamá a la gorra de visera, con horma y medida.",
    barrio: "Centro",
    direccion: "C/ Imperial, 12",
    coords: [40.415370, -3.706978],
    web: "http://sombrereriamedrano.com",
    desde: 1832,
    etiquetas: ["sombreros","panamá","centenario","gorras"],
    verificado: true
  },
  {
    id: "la-favorita",
    nombre: "La Favorita",
    categoria: "moda",
    descripcion: "Sombrerería de 1894 en los soportales de la Plaza Mayor, especialista en sombrero clásico español.",
    barrio: "Centro",
    direccion: "Plaza Mayor, 25",
    coords: [40.416051, -3.707846],
    web: "https://lafavoritacb.com/index.php?lang=es",
    desde: 1894,
    etiquetas: ["sombreros","centenario","cordobés"],
    verificado: true
  },
  {
    id: "alpargateria-antigua-casa-crespo",
    nombre: "Alpargateria Antigua Casa Crespo",
    categoria: "moda",
    descripcion: "Alpargatería de 1863 en Malasaña, con esparto cosido a mano y colores que no se ven en otro sitio.",
    barrio: "Malasaña",
    direccion: "C/ Divino Pastor, 29",
    coords: [40.427668, -3.704630],
    web: "https://www.antiguacasacrespo.com",
    desde: 1863,
    etiquetas: ["alpargatas","esparto","calzado","centenario"],
    verificado: true
  },
  {
    id: "calzados-toledo",
    nombre: "Calzados Toledo",
    categoria: "moda",
    descripcion: "Zapatería de 1857 en la calle de Toledo, la más antigua de una calle llena de ellas.",
    barrio: "Centro",
    direccion: "C/ Toledo, 20",
    coords: [40.414295, -3.707640],
    web: "https://zapateriasoriano.es/calzados-toledo",
    desde: 1857,
    etiquetas: ["calzado","zapatos","centenario"],
    verificado: true
  },
  {
    id: "casa-vega",
    nombre: "Casa Vega",
    categoria: "moda",
    descripcion: "Zapatería de 1860 en la calle de Toledo, especializada en calzado cómodo y horma ancha.",
    barrio: "Embajadores",
    direccion: "C/ Toledo, 57",
    coords: [40.411864, -3.708024],
    web: "http://www.casavega.es",
    desde: 1860,
    etiquetas: ["calzado","zapatos","centenario"],
    verificado: true
  },
  {
    id: "calzados-lobo",
    nombre: "Calzados Lobo",
    categoria: "moda",
    descripcion: "Zapatería familiar de 1897 en la calle de Toledo, con mucho fondo de calzado clásico.",
    barrio: "Palacio",
    direccion: "C/ Toledo, 30",
    coords: [40.413516, -3.707543],
    web: "https://www.calzadoslobo.com",
    desde: 1897,
    etiquetas: ["calzado","zapatos","centenario","familiar"],
    verificado: true
  },
  {
    id: "calzados-carballo",
    nombre: "Calzados Carballo",
    categoria: "moda",
    descripcion: "Zapatería de 1908 en la calle de Toledo, de las de probarse media tienda sin prisa.",
    barrio: "Palacio",
    direccion: "C/ Toledo, 38",
    coords: [40.412861, -3.707717],
    desde: 1908,
    etiquetas: ["calzado","zapatos","centenario"],
    verificado: true
  },
  {
    id: "calzados-el-ferrocarril",
    nombre: "Calzados El Ferrocarril",
    categoria: "moda",
    descripcion: "Zapatería de 1882 en la calle de la Magdalena, especializada en calzado cómodo y plantillas.",
    barrio: "Embajadores",
    direccion: "C/ Magdalena, 22",
    coords: [40.412466, -3.700903],
    web: "https://www.calzadoscomodos.com",
    desde: 1882,
    etiquetas: ["calzado","cómodo","centenario"],
    verificado: true
  },
  {
    id: "calzados-pradillo",
    nombre: "Calzados Pradillo",
    categoria: "moda",
    descripcion: "Zapatería de 1886 en la calle de la Magdalena, con horma para pies difíciles.",
    barrio: "Embajadores",
    direccion: "C/ Magdalena, 13",
    coords: [40.412613, -3.701954],
    web: "https://www.calzadospradillo.com",
    desde: 1886,
    etiquetas: ["calzado","zapatos","centenario"],
    verificado: true
  },
  {
    id: "calzados-chinela",
    nombre: "Calzados Chinela",
    categoria: "moda",
    descripcion: "Zapatería de 1912 en el barrio de Salamanca, con calzado clásico de hechura española.",
    barrio: "Salamanca",
    direccion: "C/ Nuñez de Balboa, 37",
    coords: [40.426008, -3.682777],
    desde: 1912,
    etiquetas: ["calzado","zapatos","centenario"],
    verificado: true
  },
  {
    id: "guante-varade",
    nombre: "Guante Varadé",
    categoria: "moda",
    descripcion: "Guantería de 1902 en Serrano, con guante de piel cosido a mano y medida de toda la vida.",
    barrio: "Salamanca",
    direccion: "C/ Serrano, 54",
    coords: [40.428852, -3.687318],
    web: "https://www.varade.com",
    desde: 1902,
    etiquetas: ["guantes","piel","centenario","complementos"],
    verificado: true
  },
  {
    id: "curtidos-villaverde",
    nombre: "Curtidos Villaverde",
    categoria: "moda",
    descripcion: "Peletería y curtidos desde 1887, con piel al corte para quien la trabaja y prendas de abrigo.",
    barrio: "Embajadores",
    direccion: "C/ Colegiata, 14",
    coords: [40.414040, -3.706668],
    web: "http://www.curtidosvillaverde.com",
    desde: 1887,
    etiquetas: ["piel","curtidos","peletería","centenario"],
    verificado: true
  },
  {
    id: "la-gloria",
    nombre: "La Gloria",
    categoria: "moda",
    descripcion: "Ropa de trabajo desde 1892: batas, monos y delantales de oficio, de los que duran años.",
    barrio: "Chueca",
    direccion: "C/ Augusto Figueroa, 4",
    coords: [40.423535, -3.700067],
    web: "https://www.la-gloria.net",
    desde: 1892,
    etiquetas: ["ropa de trabajo","oficio","centenario","batas"],
    verificado: true
  },
  {
    id: "azules-de-vergara",
    nombre: "Azules de Vergara",
    categoria: "moda",
    descripcion: "Ropa de trabajo desde 1914, con el azulón de siempre y prendas de faena bien cortadas.",
    barrio: "Chamberí",
    direccion: "C/ Jordán, 4",
    coords: [40.432904, -3.703498],
    web: "https://www.azulesdevergara.com/es",
    desde: 1914,
    etiquetas: ["ropa de trabajo","oficio","centenario"],
    verificado: true
  },
  {
    id: "camiseria-burgos",
    nombre: "Camisería Burgos",
    categoria: "moda",
    descripcion: "Camisería a medida desde 1906, con patrón propio y tejidos escogidos uno a uno.",
    barrio: "Las Letras",
    direccion: "C/ Cedaceros, 2",
    coords: [40.418082, -3.698647],
    web: "https://www.camiseriaburgos.com",
    desde: 1906,
    etiquetas: ["camisas","a medida","sastrería","centenario"],
    verificado: true
  },
  {
    id: "sastreria-palomeque",
    nombre: "Sastrería Palomeque",
    categoria: "moda",
    descripcion: "Sastrería de 1901 especializada en uniformes y prendas de oficio, cosidas en su propio taller.",
    barrio: "Embajadores",
    direccion: "C/ Duque de Alba, 5",
    coords: [40.412401, -3.705885],
    web: "http://www.uniformesmadrid.es",
    desde: 1901,
    etiquetas: ["sastrería","uniformes","a medida","centenario"],
    verificado: true
  },
  {
    id: "sastreria-cornejo",
    nombre: "Sastrería Cornejo",
    categoria: "moda",
    descripcion: "Sastrería de 1920 que viste al cine y al teatro españoles: vestuario de época hecho a mano.",
    barrio: "San Blas",
    direccion: "C/ Rufino Gonzalez, 4",
    coords: [40.441155, -3.627843],
    web: "http://www.sastreriacornejo.com",
    desde: 1920,
    etiquetas: ["sastrería","vestuario","cine","centenario"],
    verificado: true
  },
  {
    id: "fieltros-olleros",
    nombre: "Fieltros Olleros",
    categoria: "moda",
    descripcion: "Casa de fieltros desde 1863, con paño y fieltro al corte para sastrería, sombrerería y manualidades.",
    barrio: "Centro",
    direccion: "Plaza Comandante las Morenas, 5",
    coords: [40.416186, -3.708591],
    web: "http://www.fieltrosolleros.com",
    desde: 1863,
    etiquetas: ["fieltro","paño","tejidos","centenario"],
    verificado: true
  },
  {
    id: "confecciones-zorrilla",
    nombre: "Confecciones Zorrilla",
    categoria: "moda",
    descripcion: "Tienda de ropa de 1870 en la calle de Toledo, con género clásico y precios de barrio.",
    barrio: "Centro",
    direccion: "C/ Toledo, 29",
    coords: [40.413899, -3.707296],
    web: "https://www.confeccioneszorrilla.com",
    desde: 1870,
    etiquetas: ["ropa","centenario","barrio"],
    verificado: true
  },
  {
    id: "casa-pajares",
    nombre: "Casa Pajares",
    categoria: "moda",
    descripcion: "Tienda de ropa de 1873 en Chueca, en el mismo local y con la misma familia detrás.",
    barrio: "Chueca",
    direccion: "C/ Pelayo, 35",
    coords: [40.423437, -3.698132],
    desde: 1873,
    etiquetas: ["ropa","centenario","familiar"],
    verificado: true
  },
  {
    id: "matarranz",
    nombre: "Matarranz",
    categoria: "moda",
    descripcion: "Ropa de casa desde 1911: sábanas, mantelerías y toallas de tejido bueno, con bordado a medida.",
    barrio: "Salamanca",
    direccion: "C/ Serrano, 30",
    coords: [40.424052, -3.685352],
    web: "https://matarranzropadecasa.com",
    desde: 1911,
    etiquetas: ["ropa de casa","bordado","sábanas","centenario"],
    verificado: true
  },
  {
    id: "merceria-victoria",
    nombre: "Mercería Victoria",
    categoria: "moda",
    descripcion: "Mercería de 1895 con los cajones llenos de botones, cintas, hilos y todo lo que ya no se encuentra.",
    barrio: "Malasaña",
    direccion: "C/ Noviciado, 20",
    coords: [40.431815, -3.708051],
    desde: 1895,
    etiquetas: ["mercería","botones","costura","centenario"],
    verificado: true
  },
  {
    id: "la-nueva-parisien",
    nombre: "La Nueva Parisien",
    categoria: "moda",
    descripcion: "Mercería y corsetería desde 1897, con lencería clásica y arreglos a medida.",
    barrio: "Salamanca",
    direccion: "C/ Claudio Coello, 23",
    coords: [40.423711, -3.687132],
    web: "http://nuevaparisien.com",
    desde: 1897,
    etiquetas: ["mercería","corsetería","lencería","centenario"],
    verificado: true
  },
  {
    id: "el-arca-de-noe",
    nombre: "El Arca de Noé",
    categoria: "moda",
    descripcion: "Mercería y corsetería de 1908, con mucho fondo de hilos, encajes y botones.",
    barrio: "Prosperidad",
    direccion: "C/ López de Hoyos, 134",
    coords: [40.445602, -3.672723],
    desde: 1908,
    etiquetas: ["mercería","corsetería","encajes","centenario"],
    verificado: true
  },
  {
    id: "casa-el-valenciano",
    nombre: "Casa El Valenciano",
    categoria: "moda",
    descripcion: "Casa de hípica y curtidos desde 1893: monturas, botas y artículos de piel para montar.",
    barrio: "Embajadores",
    direccion: "C/ Ribera de Curtidores, 16",
    coords: [40.406787, -3.706870],
    web: "http://www.tiendahipicaelvalenciano.com",
    desde: 1893,
    etiquetas: ["hípica","piel","botas","centenario"],
    verificado: true
  },
  {
    id: "antigua-relojeria-de-la-sal",
    nombre: "Antigua Relojería de la Sal",
    categoria: "joyeria",
    descripcion: "Relojería de 1880 donde siguen arreglando mecánicos y cuerdas que nadie más toca.",
    barrio: "Centro",
    direccion: "C/ Sal, 2",
    coords: [40.415966, -3.706303],
    web: "http://www.antiguarelojeria.com",
    desde: 1880,
    etiquetas: ["relojería","reparación","centenario","mecánico"],
    verificado: true
  },
  {
    id: "joyeria-ansorena",
    nombre: "Joyería Ansorena",
    categoria: "joyeria",
    descripcion: "Joyería de 1845 con taller propio, de las casas de más oficio de Madrid en joya a medida.",
    barrio: "Retiro",
    direccion: "C/ Alcalá, 52",
    coords: [40.419617, -3.691087],
    web: "https://www.ansorena.com",
    desde: 1845,
    etiquetas: ["joyas","taller","a medida","centenario"],
    verificado: true
  },
  {
    id: "joyeria-duran",
    nombre: "Joyería Durán",
    categoria: "joyeria",
    descripcion: "Joyería de 1886 en Goya, con taller, tasación y subastas de joya antigua.",
    barrio: "Salamanca",
    direccion: "C/ Goya, 19",
    coords: [40.426462, -3.686723],
    web: "http://www.duranjoyeros.com",
    desde: 1886,
    etiquetas: ["joyas","subastas","tasación","centenario"],
    verificado: true
  },
  {
    id: "joyeria-yanes",
    nombre: "Joyería Yanes",
    categoria: "joyeria",
    descripcion: "Joyería de 1881 con diseño y fabricación propios, en el barrio de Salamanca.",
    barrio: "Salamanca",
    direccion: "C/ Goya, 27",
    coords: [40.428251, -3.684792],
    web: "http://yanesmadrid.com/es",
    desde: 1881,
    etiquetas: ["joyas","taller","diseño","centenario"],
    verificado: true
  },
  {
    id: "joyeria-granados",
    nombre: "Joyería Granados",
    categoria: "joyeria",
    descripcion: "Joyería de 1899 en la calle de Alcalá, con arreglos y encargos hechos en casa.",
    barrio: "Salamanca",
    direccion: "C/ Alcalá, 105",
    coords: [40.422121, -3.682726],
    desde: 1899,
    etiquetas: ["joyas","arreglos","encargo","centenario"],
    verificado: true
  },
  {
    id: "joyeria-perez",
    nombre: "Joyería Pérez",
    categoria: "joyeria",
    descripcion: "Joyería de 1914 en la calle de Ayala, de barrio y con taller detrás del mostrador.",
    barrio: "Salamanca",
    direccion: "C/ Ayala, 15",
    coords: [40.428337, -3.686361],
    web: "https://joyeriaperez.es",
    desde: 1914,
    etiquetas: ["joyas","taller","arreglos","centenario"],
    verificado: true
  },
  {
    id: "casa-vales",
    nombre: "Casa Vales",
    categoria: "papeleria",
    descripcion: "Papelería de 1909 en Chueca, con material de bellas artes, plumas y papel bueno.",
    barrio: "Chueca",
    direccion: "C/ Fernando VI, 14",
    coords: [40.424253, -3.695007],
    web: "https://www.papeleriacasavales.es",
    desde: 1909,
    etiquetas: ["papelería","bellas artes","plumas","centenario"],
    verificado: true
  },
  {
    id: "amillo",
    nombre: "Amillo",
    categoria: "oficios",
    descripcion: "Taller de encuadernación desde 1887: encuadernan a mano, restauran libros y hacen cajas a medida.",
    barrio: "Centro",
    direccion: "C/ Fuentes, 10",
    coords: [40.418114, -3.708355],
    web: "http://www.amillo.es",
    desde: 1887,
    etiquetas: ["encuadernación","restauración","a medida","centenario"],
    verificado: true
  },
  {
    id: "encuadernacion-calero",
    nombre: "Encuadernación Calero",
    categoria: "oficios",
    descripcion: "Encuadernación artesanal desde 1907, con dorado a mano y restauración de libro antiguo.",
    barrio: "Chueca",
    direccion: "C/ Barbara de Braganza, 11",
    coords: [40.424276, -3.692089],
    web: "https://encuadernacioncalero.com",
    desde: 1907,
    etiquetas: ["encuadernación","dorado","restauración","centenario"],
    verificado: true
  },
  {
    id: "frisa-encuadernacion",
    nombre: "Frisa Encuadernación",
    categoria: "oficios",
    descripcion: "Taller de encuadernación de 1917 en Malasaña, de tapa dura, piel y trabajos por encargo.",
    barrio: "Malasaña",
    direccion: "C/ madera, 31",
    coords: [40.424581, -3.704203],
    web: "http://www.encuadernacionfrisa.com",
    desde: 1917,
    etiquetas: ["encuadernación","piel","encargo","centenario"],
    verificado: true
  },
  {
    id: "broncista-navarro",
    nombre: "Broncista Navarro",
    categoria: "oficios",
    descripcion: "Taller de broncista desde 1899: funden, tornean y restauran piezas de bronce y latón.",
    barrio: "Malasaña",
    direccion: "C/ Madera, 51",
    coords: [40.424889, -3.703159],
    web: "https://www.broncesnavarro.com",
    desde: 1899,
    etiquetas: ["bronce","latón","fundición","centenario"],
    verificado: true
  },
  {
    id: "santa-rufina",
    nombre: "Santa Rufina",
    categoria: "oficios",
    descripcion: "Imaginería y artículos religiosos desde 1887, con taller propio de restauración de tallas.",
    barrio: "Centro",
    direccion: "C/ Paz, 9",
    coords: [40.415833, -3.703936],
    web: "https://www.santarrufina.com",
    desde: 1887,
    etiquetas: ["imaginería","tallas","restauración","centenario"],
    verificado: true
  },
  {
    id: "el-angel-sobrinos-de-perez",
    nombre: "El Ángel",
    categoria: "oficios",
    descripcion: "Casa de artículos religiosos desde 1867, con orfebrería, tallas y trabajos de restauración.",
    barrio: "Centro",
    direccion: "C/ Esparteros, 3",
    coords: [40.416885, -3.704709],
    web: "https://www.el-angel.com",
    desde: 1867,
    etiquetas: ["orfebrería","imaginería","restauración","centenario"],
    verificado: true
  },
  {
    id: "lucio-j-m",
    nombre: "Lucio J&M",
    categoria: "hogar",
    descripcion: "Casa de decoración desde 1872, con artículos de menaje y regalo escogidos con criterio antiguo.",
    barrio: "Centro",
    direccion: "C/ Imperial, 6",
    coords: [40.415803, -3.706907],
    web: "https://www.luciojm.es",
    desde: 1872,
    etiquetas: ["decoración","menaje","regalo","centenario"],
    verificado: true
  },
  {
    id: "casa-silveriro",
    nombre: "Casa Silveriro",
    categoria: "hogar",
    descripcion: "Tienda de decoración de 1921 en la calle Imperial, con género clásico y mucho fondo.",
    barrio: "Centro",
    direccion: "C/ Imperial, 4",
    coords: [40.414827, -3.706649],
    web: "http://www.casasilverio.com",
    desde: 1921,
    etiquetas: ["decoración","menaje","centenario"],
    verificado: true
  },
  {
    id: "calvo-y-munar",
    nombre: "Calvo y Munar",
    categoria: "hogar",
    descripcion: "Casa de baño y cocina desde 1902, con grifería y sanitario clásico difícil de encontrar hoy.",
    barrio: "Chamberí",
    direccion: "C/ Juan de Austria, 3",
    coords: [40.432110, -3.699251],
    web: "http://www.calvoymunar.com/centro_madrid.html",
    desde: 1902,
    etiquetas: ["baño","cocina","grifería","centenario"],
    verificado: true
  },
  {
    id: "colchoneria-cuesta",
    nombre: "Colchonería Cuesta",
    categoria: "hogar",
    descripcion: "Colchonería que sigue vareando la lana a mano y haciendo colchones a medida.",
    barrio: "Chamberí",
    direccion: "C/ Fuencarral, 83",
    coords: [40.426725, -3.701253],
    web: "http://www.colchoneriacuesta.es",
    desde: 1980,
    etiquetas: ["colchones","lana","a medida","artesano"],
    verificado: true
  },
  {
    id: "el-jardin-del-angel",
    nombre: "El Jardín del Ángel",
    categoria: "plantas",
    descripcion: "Floristería y vivero desde 1889 junto a Huertas, con plantas de exterior y árboles.",
    barrio: "Las Letras",
    direccion: "C/ Huertas, 2",
    coords: [40.414150, -3.701212],
    web: "http://www.jardindelangel.es/Web/Home.html",
    desde: 1889,
    etiquetas: ["flores","plantas","vivero","centenario"],
    verificado: true
  },
  {
    id: "union-musical-espanola-ume",
    nombre: "Unión Musical Española UME",
    categoria: "musica",
    descripcion: "Casa de música desde 1900: partituras, instrumentos y su propia editorial de música española.",
    barrio: "Las Letras",
    direccion: "C/ Cedaceros, 3",
    coords: [40.418160, -3.698541],
    web: "https://www.unionmusical.es",
    desde: 1900,
    etiquetas: ["partituras","instrumentos","editorial","centenario"],
    verificado: true
  },

  /* ------------------------------------------------ papel y bellas artes */
  {
    id: "drogueria-manuel-riesgo",
    nombre: "Droguería Manuel Riesgo",
    categoria: "papeleria",
    descripcion: "Droguería de 1866 con quince mil referencias: pigmentos en polvo, barnices, resinas y químicos para bellas artes y restauración. Cerró en 2024 y la familia la reabrió.",
    barrio: "Malasaña",
    direccion: "C/ del Desengaño, 22",
    web: "https://drogueriariesgo.com",
    desde: 1866,
    etiquetas: ["pigmentos", "bellas artes", "restauración", "droguería", "centenario"],
    revisado: "2026-09",
    verificado: true
  },
  {
    id: "drogueria-shanghai",
    nombre: "Droguería Shanghai",
    categoria: "papeleria",
    descripcion: "Pigmentos en polvo, resinas, material de dorado y de grabado, y utensilios de restauración que no se encuentran en una tienda normal de bellas artes.",
    barrio: "Chueca",
    direccion: "C/ de Hortaleza, 15",
    etiquetas: ["pigmentos", "bellas artes", "grabado", "dorado", "restauración"],
    verificado: true
  },
  {
    id: "bomagui",
    nombre: "Bomagui",
    categoria: "papeleria",
    descripcion: "Papelería artesanal donde encuadernan ellos mismos: códices cosidos a mano, libretas con la portada pintada y plumas de caligrafía traídas de Florencia.",
    barrio: "Malasaña",
    direccion: "C/ del Noviciado, 9",
    web: "https://bomagui.es",
    etiquetas: ["papelería", "encuadernación", "caligrafía", "cuadernos", "artesanal"],
    verificado: true
  },
  {
    id: "papeleria-berno",
    nombre: "Papelería Berno",
    categoria: "papeleria",
    descripcion: "Papelería y librería de 1947 especializada en estilográficas: las venden, las reparan y tienen mucha papelería japonesa.",
    barrio: "Retiro",
    direccion: "C/ de Narváez, 35",
    web: "https://papeleriaberno.com",
    desde: 1947,
    etiquetas: ["plumas", "estilográficas", "reparación", "japonesa", "cuadernos"],
    verificado: true
  },
  {
    id: "papelmania",
    nombre: "Papelmania",
    categoria: "papeleria",
    descripcion: "Papelería de barrio en Claudio Coello, de las que siguen atendiendo de una en una y saben qué papel le va a cada cosa.",
    barrio: "Salamanca",
    direccion: "C/ de Claudio Coello",
    etiquetas: ["papelería", "cuadernos", "barrio", "regalo"],
    verificado: false
  },

  /* --------------------------- despensa de otras provincias */
  {
    id: "serrin-ultramarinos",
    nombre: "Serrín Ultramarinos",
    categoria: "alimentacion",
    descripcion: "Ultramarinos gallego con el género que llega de allí: empanada, lacón, grelos, patata gallega, quesos, conservas y leche fresca. Tienen puesto en el mercado de Pacífico y tienda en Chamberí.",
    barrio: "Chamberí",
    web: "https://serrinultramarinos.com",
    etiquetas: ["gallego", "galicia", "empanada", "lacón", "conservas", "ultramarinos"],
    verificado: true
  },
  {
    id: "colmado-atlantico",
    nombre: "Colmado Atlántico",
    categoria: "alimentacion",
    descripcion: "Colmado gallego dentro del Mercado de Tirso de Molina: conservas de las buenas, empanada, embutidos, quesos y aceites escogidos uno a uno.",
    barrio: "Lavapiés",
    direccion: "Mercado de Tirso de Molina",
    etiquetas: ["gallego", "galicia", "conservas", "quesos", "mercado"],
    verificado: true
  },
  {
    id: "rincon-empanada-gallega",
    nombre: "El Rincón de la Empanada Gallega",
    categoria: "alimentacion",
    descripcion: "Tienda diminuta a la que llegan cada mañana las empanadas desde Galicia para hornearlas aquí. También quesos, chorizos, miel y mermeladas.",
    etiquetas: ["gallego", "empanada", "galicia", "quesos", "miel"],
    verificado: false
  },
  {
    id: "casa-mendez-productos",
    nombre: "Casa Méndez",
    categoria: "alimentacion",
    descripcion: "Ciento cincuenta metros de producto del norte: Galicia, Asturias, Cantabria y León bajo el mismo techo, con mostrador de quesos y embutidos.",
    etiquetas: ["gallego", "asturiano", "cantabria", "quesos", "embutidos"],
    verificado: false
  },
  {
    id: "xantar-astur",
    nombre: "Xantar Astur",
    categoria: "alimentacion",
    descripcion: "Tienda de producto asturiano: cabrales, gamonéu, fabes, chorizo a la sidra y sidra de la buena, con varias tiendas repartidas por Madrid.",
    barrio: "La Latina",
    etiquetas: ["asturiano", "asturias", "sidra", "quesos", "fabada"],
    verificado: false
  },
  {
    id: "rinconcito-de-la-vera",
    nombre: "El Rinconcito de la Vera",
    categoria: "alimentacion",
    descripcion: "Tienda de producto extremeño en Carabanchel: ibérico de dehesa, queso de la Serena, pimentón de la Vera y conservas de la zona.",
    barrio: "Carabanchel",
    direccion: "C/ de Ocaña, 71",
    etiquetas: ["extremeño", "extremadura", "ibérico", "pimentón", "queso"],
    verificado: true
  },

  /* ------------------------------------------ cerveza artesana */
  {
    id: "labirratorium",
    nombre: "Labirratorium",
    categoria: "vinos",
    descripcion: "Unas quinientas referencias de cerveza artesana desde 2012, con catas, charlas y talleres. De las que te preguntan qué te gusta antes de recomendarte nada.",
    barrio: "Chamberí",
    direccion: "C/ de Vallehermoso, 34",
    desde: 2012,
    etiquetas: ["cerveza", "artesana", "catas", "importación"],
    verificado: true
  },
  {
    id: "la-cervecista",
    nombre: "La Cervecista",
    categoria: "vinos",
    descripcion: "Más de cuatrocientas cervezas entre artesanas nacionales e importación difícil de encontrar, en una tienda pequeña y bien ordenada.",
    barrio: "Chueca",
    direccion: "C/ de Mejía Lequerica, 3",
    etiquetas: ["cerveza", "artesana", "importación"],
    verificado: true
  },
  {
    id: "mas-que-cervezas",
    nombre: "Más que Cervezas",
    categoria: "vinos",
    descripcion: "Unas quinientas cervezas en un local mínimo del Barrio de las Letras, y además vinos, licores y lo que haga falta para una coctelera.",
    barrio: "Las Letras",
    etiquetas: ["cerveza", "artesana", "licores", "coctelería"],
    verificado: true
  },
  {
    id: "la-buena-pinta",
    nombre: "La Buena Pinta",
    categoria: "vinos",
    descripcion: "Puesto en el Mercado de San Fernando con más de doscientas cervezas artesanas nacionales e importadas. Se puede beber allí mismo.",
    barrio: "Lavapiés",
    direccion: "Mercado de San Fernando",
    etiquetas: ["cerveza", "artesana", "mercado"],
    verificado: true
  },
  {
    id: "hidden-beers",
    nombre: "Hidden Beers",
    categoria: "vinos",
    descripcion: "Selección corta y muy escogida de cerveza artesana nacional e internacional, con rotación constante de novedades.",
    barrio: "Lavapiés",
    direccion: "C/ de Embajadores, 23",
    web: "https://hiddenbeers.com",
    etiquetas: ["cerveza", "artesana", "novedades"],
    verificado: true
  },
  {
    id: "be-hoppy",
    nombre: "Be Hoppy",
    categoria: "vinos",
    descripcion: "Cerveza artesana española de microcervecerías pequeñas, muchas de ellas de productores que no distribuyen fuera de su provincia.",
    barrio: "La Latina",
    etiquetas: ["cerveza", "artesana", "española", "microcervecería"],
    verificado: false
  },

  /* -------------------------------------------------- vino */
  {
    id: "bodegabierta",
    nombre: "Bodegabierta",
    categoria: "vinos",
    descripcion: "Vinoteca de Malasaña con más de doscientas referencias, casi todas de productores pequeños que no llegan a las grandes superficies.",
    barrio: "Malasaña",
    web: "https://www.bodegabierta.es",
    etiquetas: ["vino", "pequeños productores", "catas", "vinoteca"],
    verificado: true
  },
  {
    id: "root-concept",
    nombre: "Root Concept",
    categoria: "vinos",
    descripcion: "Tienda de vino natural en Malasaña donde dejan probar y cuentan quién hay detrás de cada botella. Trabajan con viticultores minúsculos.",
    barrio: "Malasaña",
    web: "https://rootconcept.eu",
    etiquetas: ["vino natural", "catas", "pequeños productores", "café"],
    verificado: true
  },
  {
    id: "bendito-vinos",
    nombre: "Bendito",
    categoria: "vinos",
    descripcion: "Puesto de vinos en el Mercado de San Fernando con una selección muy personal, fuerte en natural y en botellas de poca tirada.",
    barrio: "Lavapiés",
    direccion: "Mercado de San Fernando, C/ de Embajadores, 41",
    etiquetas: ["vino", "natural", "mercado", "pequeños productores"],
    verificado: true
  },

  /* ------------------------------------------------- carne */
  {
    id: "carne-nostra",
    nombre: "Carne Nostra",
    categoria: "carniceria",
    descripcion: "Carnicería que trabaja razas y ganaderías concretas, con maduraciones propias y despiece hecho en la tienda.",
    etiquetas: ["carnicería", "madurada", "ganadería", "despiece"],
    verificado: false
  },
  {
    id: "pena-maestros-carniceros",
    nombre: "Peña Maestros Carniceros",
    categoria: "carniceria",
    descripcion: "Casa de carnes con mucho oficio detrás del mostrador: te preparan la pieza como se la pidas y aconsejan según cómo la vayas a hacer.",
    etiquetas: ["carnicería", "despiece", "vacuno", "cordero"],
    verificado: false
  }

];

/* Permite validar el archivo desde Node sin romper la carga en el navegador. */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { CATEGORIAS, NEGOCIOS };
}

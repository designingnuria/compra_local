/* ---------------------------------------------------------------
   Compra Local — base de datos del directorio.

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
  { id: "vinos", nombre: "Vinos", icono: "🍷",
    sinonimos: ["vino", "vinos", "bodega", "vinoteca", "bebida", "licor", "destilados"] },
  { id: "hogar", nombre: "Cerámica y hogar", icono: "🏺",
    sinonimos: ["casa", "hogar", "menaje", "cocina", "vajilla", "plato", "decoracion", "loza", "artesania", "alfareria", "ferreteria", "drogueria", "herramienta"] },
  { id: "papeleria", nombre: "Papelería", icono: "✏️",
    sinonimos: ["papel", "papeleria", "cuaderno", "libreta", "boligrafo", "pluma", "escribir", "encuadernar", "encuadernacion", "postal", "bellas artes"] },
  { id: "arte", nombre: "Arte y enmarcación", icono: "🖼️",
    sinonimos: ["enmarcar", "enmarcacion", "marco", "marcos", "cuadro", "cuadros", "lamina", "laminas", "poster", "espejo", "arte"] },
  { id: "moda", nombre: "Moda y complementos", icono: "🧣",
    sinonimos: ["ropa", "vestir", "moda", "complementos", "accesorios", "zapatos", "calzado", "sombrero", "sombreria", "bolso", "sastre", "sastreria", "guanteria"] },
  { id: "musica", nombre: "Música y discos", icono: "🎵",
    sinonimos: ["musica", "disco", "discos", "vinilo", "vinilos", "cd", "tocadiscos", "instrumento", "tienda de musica"] },
  { id: "oficios", nombre: "Oficios y talleres", icono: "🔨",
    sinonimos: ["taller", "artesano", "artesania", "oficio", "reparar", "reparacion", "arreglar", "a medida", "hecho a mano", "coser", "luthier", "guitarreria", "cuero", "piel"] },
  { id: "plantas", nombre: "Plantas y flores", icono: "🌿",
    sinonimos: ["planta", "plantas", "flor", "flores", "floristeria", "jardin", "maceta", "ramo"] },
  { id: "juguetes", nombre: "Juguetes y regalos", icono: "🧸",
    sinonimos: ["juguete", "juguetes", "juego", "juegos", "regalo", "regalos", "ninos"] },
  { id: "comics", nombre: "Cómics y juegos", icono: "💥",
    sinonimos: ["comic", "comics", "tebeo", "manga", "juegos de mesa", "rol", "cartas", "coleccionismo"] },
  { id: "foto", nombre: "Fotografía", icono: "📷",
    sinonimos: ["foto", "fotografia", "analogica", "carrete", "revelar", "revelado", "camara", "camaras", "pelicula"] },
  { id: "vintage", nombre: "Vintage y anticuarios", icono: "🪑",
    sinonimos: ["vintage", "antiguedades", "anticuario", "mueble", "muebles", "segunda mano", "retro", "decoracion", "rastro"] },
  { id: "joyeria", nombre: "Joyería", icono: "💍",
    sinonimos: ["joya", "joyas", "joyeria", "anillo", "pendientes", "collar", "plata", "oro", "bisuteria", "a medida"] },
  { id: "perfumeria", nombre: "Perfumería", icono: "🌸",
    sinonimos: ["perfume", "perfumes", "perfumeria", "fragancia", "colonia", "cosmetica", "nicho", "jabon"] }
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
    direccion: "Plaza de Canalejas, 6",
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
    direccion: "C/ del Pozo, 8",
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
    direccion: "C/ de Isabel la Católica, 2",
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
    direccion: "Plaza de Pontejos, 2",
    desde: 1913,
    etiquetas: ["mercería", "botones", "costura", "centenario"],
    verificado: false
  },

  /* ---------------------------------------------------- papelería */
  {
    id: "papeleria-salazar",
    nombre: "Papelería Salazar",
    categoria: "papeleria",
    descripcion: "Papelería de 1905 en manos de la misma familia, especializada en material de bellas artes, plumas y artículos religiosos. Un museo que además vende.",
    barrio: "Centro",
    direccion: "C/ de la Luna, 7",
    web: "https://www.papeleriasalazar.es",
    desde: 1905,
    etiquetas: ["papelería", "bellas artes", "plumas", "centenario"],
    verificado: true
  },
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
    categoria: "arte",
    descripcion: "Taller de enmarcación familiar en Malasaña desde 1980, ya por la tercera generación. Hacen marcos a medida en cualquier estilo y aconsejan de verdad.",
    barrio: "Malasaña",
    desde: 1980,
    etiquetas: ["enmarcación", "marcos", "a medida", "familiar"],
    verificado: true
  },
  {
    id: "subiron-cristal-y-arte",
    nombre: "Subirón Cristal y Arte",
    categoria: "arte",
    descripcion: "Taller familiar con más de cuarenta años enmarcando óleos, grabados, telas, espejos y prácticamente cualquier objeto que le lleves.",
    barrio: "Retiro",
    web: "https://www.subironcristalyarte.com",
    etiquetas: ["enmarcación", "marcos", "espejos", "cristal"],
    verificado: true
  },
  {
    id: "kino-marcos-molduras",
    nombre: "Kino Marcos y Molduras",
    categoria: "arte",
    descripcion: "Artesanos de la moldura con más de treinta años de oficio: trabajan los marcos a mano, uno a uno, incluida la caja americana.",
    web: "https://www.kinomarcosmolduras.com",
    etiquetas: ["enmarcación", "molduras", "artesano", "caja americana"],
    verificado: true
  },

  /* ------------------------------------------ moda y complementos */
  {
    id: "casa-hernanz",
    nombre: "Casa Hernanz",
    categoria: "moda",
    descripcion: "Alpargatería abierta en 1845 y todavía en manos de la familia Hernanz. Suela de esparto cosida a mano y una cola en la puerta cada primavera.",
    barrio: "Centro",
    direccion: "C/ de Toledo, 18",
    desde: 1845,
    etiquetas: ["alpargatas", "esparto", "centenario", "calzado"],
    verificado: true
  },
  {
    id: "capas-sesena",
    nombre: "Capas Seseña",
    categoria: "moda",
    descripcion: "Desde 1901 cosen capas españolas de lana a medida, las mismas que llevaron Picasso o Hemingway. Sigue siendo un taller familiar.",
    barrio: "Centro",
    direccion: "C/ de la Cruz, 23",
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
    direccion: "C/ de Espoz y Mina, 3",
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
    direccion: "Puerta del Sol, 12",
    desde: 1858,
    etiquetas: ["abanicos", "paraguas", "bastones", "centenario"],
    verificado: true
  },
  {
    id: "casa-yustas",
    nombre: "Sombrerería Casa Yustas",
    categoria: "moda",
    descripcion: "La sombrerería más antigua de Madrid, de 1894, en los soportales de la Plaza Mayor. Del panamá al sombrero cordobés, con horma y medida.",
    barrio: "Centro",
    direccion: "Plaza Mayor, 30",
    web: "https://www.casayustas.com",
    desde: 1894,
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
    descripcion: "Treinta años comprando y vendiendo discos en el sótano de las Descalzas. Miles de vinilos y CDs de segunda mano donde perderse una tarde entera.",
    barrio: "Centro",
    direccion: "Postigo de San Martín, 1",
    web: "https://www.discoslametralleta.com",
    etiquetas: ["vinilos", "segunda mano", "CDs", "coleccionismo"],
    verificado: true
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
    desde: 1915,
    etiquetas: ["guitarras", "luthier", "flamenco", "familiar"],
    verificado: false
  },
  {
    id: "guitarras-jose-ramirez",
    nombre: "Guitarras José Ramírez",
    categoria: "oficios",
    descripcion: "Una de las casas de guitarrería más antiguas del mundo, fundada en 1882 y dirigida por la quinta generación de la familia Ramírez.",
    barrio: "Centro",
    web: "https://www.guitarrasramirez.com",
    desde: 1882,
    etiquetas: ["guitarras", "luthier", "clásica", "centenario"],
    verificado: false
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
    descripcion: "Treinta casetas de libro viejo junto al Botánico, en pie desde 1925. Cada una es un negocio distinto con su manía: una tira al ensayo, otra al cómic, otra al infantil antiguo.",
    barrio: "Retiro",
    direccion: "C/ de Claudio Moyano",
    desde: 1925,
    etiquetas: ["libro viejo", "segunda mano", "descatalogado", "histórica"],
    verificado: true
  },
  {
    id: "libreria-san-gines",
    nombre: "Librería San Ginés",
    categoria: "librerias",
    descripcion: "Caseta de libro usado encajada en el pasadizo de San Ginés, en una esquina donde se venden libros desde hace siglos. Fondo revuelto y precios de saldo.",
    barrio: "Centro",
    direccion: "Pasadizo de San Ginés",
    etiquetas: ["libro viejo", "segunda mano", "histórica", "saldo"],
    verificado: false
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
    categoria: "comics",
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
    categoria: "comics",
    descripcion: "Abierta por la familia Marugán en 1993 y premiada con un Eisner. Catálogo hondo de Marvel, DC, manga y cómic europeo, con gente detrás del mostrador que se lo ha leído.",
    barrio: "Malasaña",
    desde: 1993,
    etiquetas: ["cómic", "manga", "europeo", "coleccionismo"],
    verificado: true
  },
  {
    id: "madrid-comics",
    nombre: "Madrid Cómics",
    categoria: "comics",
    descripcion: "Tienda veterana de cómic con mucho fondo de saldo y grapa antigua. Buen sitio para completar colecciones descabaladas.",
    barrio: "Centro",
    etiquetas: ["cómic", "grapa", "saldo", "colecciones"],
    verificado: false
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
    direccion: "C/ de Villanueva, 14",
    desde: 1852,
    etiquetas: ["bombones", "caramelos", "centenario", "regalo"],
    verificado: false
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
    direccion: "C/ de Toledo, 35",
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
    descripcion: "Desde 1911 tejen a mano la rejilla y la anea de las sillas. Un oficio que casi no queda nadie que sepa hacer, y aquí se sigue haciendo igual.",
    barrio: "Centro",
    direccion: "C/ de Isabel la Católica, 7",
    desde: 1911,
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

  /* ----------------------------------------------------- perfumería */
  {
    id: "le-secret-du-marais",
    nombre: "Le Secret du Marais",
    categoria: "perfumeria",
    descripcion: "Perfumería de autor con más de quince años trayendo marcas que no está casi nadie más en España. Te dejan probar sin prisa.",
    etiquetas: ["perfume", "nicho", "fragancias", "autor"],
    verificado: true
  },
  {
    id: "perfumeria-nadia",
    nombre: "Perfumería Nadia",
    categoria: "perfumeria",
    descripcion: "Más de trescientas marcas de perfumería nicho y cosmética de autor, con asesoramiento de quien se ha olido todas.",
    barrio: "Salamanca",
    direccion: "C/ de Velázquez",
    web: "https://www.nadiaperfumeria.com",
    etiquetas: ["perfume", "nicho", "cosmética", "fragancias"],
    verificado: true
  },
  {
    id: "nefertum-parfums",
    nombre: "Nefertum Parfums",
    categoria: "perfumeria",
    descripcion: "Perfumería nicho y de autor, con casas pequeñas y fragancias de producción corta que no llegan a la distribución grande.",
    web: "https://nefertumparfums.com",
    etiquetas: ["perfume", "nicho", "autor", "fragancias"],
    verificado: true
  },
  {
    id: "perfumeria-rosi",
    nombre: "Perfumería Rosi",
    categoria: "perfumeria",
    descripcion: "Boutique de referencia para perfume nicho en Gran Vía, siempre con las casas más nuevas antes que nadie.",
    barrio: "Centro",
    web: "https://www.rosigranvia.es",
    etiquetas: ["perfume", "nicho", "fragancias", "novedades"],
    verificado: true
  },
  {
    id: "lattar-parfums",
    nombre: "L'ATTAR",
    categoria: "perfumeria",
    descripcion: "Perfumería nicho con equipo formado en fragancia, fuerte en perfumería árabe y en attars y aceites concentrados.",
    web: "https://lattarparfums.com",
    etiquetas: ["perfume", "nicho", "attar", "aceites", "árabe"],
    verificado: true
  }

];

/* Permite validar el archivo desde Node sin romper la carga en el navegador. */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { CATEGORIAS, NEGOCIOS };
}

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
    sinonimos: ["casa", "hogar", "menaje", "cocina", "vajilla", "plato", "decoracion", "loza", "artesania", "alfareria"] },
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
    sinonimos: ["juguete", "juguetes", "juego", "juegos", "regalo", "regalos", "ninos"] }
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
    barrio: "Madrid",
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
    barrio: "Chueca",
    direccion: "C/ de Regueros, 10",
    etiquetas: ["juguetes", "madera", "vintage", "regalo"],
    verificado: false
  }

];

/* Permite validar el archivo desde Node sin romper la carga en el navegador. */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { CATEGORIAS, NEGOCIOS };
}

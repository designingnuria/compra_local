/* ---------------------------------------------------------------
   Compra Local — posición aproximada de cada barrio.

   Coordenadas de referencia (latitud, longitud) de un punto
   reconocible de cada barrio, para colocarlo en la vista de mapa.
   No pretenden ser exactas: sitúan el barrio, no el portal.

   Si añades un barrio nuevo en data/negocios.js, añádelo también
   aquí; si no, sus negocios saldrán en el listado pero no en el mapa
   (el validador te avisa).
   --------------------------------------------------------------- */

const BARRIOS = {
  "Tetuán":      [40.4470, -3.7000],
  "Moncloa":     [40.4350, -3.7190],
  "Chamberí":    [40.4335, -3.7035],
  "Argüelles":   [40.4290, -3.7170],
  "Salamanca":   [40.4270, -3.6830],
  "Conde Duque": [40.4265, -3.7110],
  "Malasaña":    [40.4261, -3.7040],
  "Chueca":      [40.4223, -3.6970],
  "Ópera":       [40.4181, -3.7098],
  "Palacio":     [40.4180, -3.7140],
  "Retiro":      [40.4180, -3.6760],
  "Centro":      [40.4169, -3.7035],
  "Las Letras":  [40.4147, -3.7005],
  "La Latina":   [40.4116, -3.7100],
  "Lavapiés":    [40.4089, -3.7008],
  "Rastro":      [40.4076, -3.7076],
  "Embajadores": [40.4050, -3.7020],
  "Arganzuela":  [40.4020, -3.7050]
};

/* Encuadre del mapa y dos referencias para orientarse: el Retiro y el
   Manzanares. Son trazos esquemáticos, no cartografía. Se queda solo lo
   que se puede dibujar sin inventar: las calles, trazadas a ojo, confundían
   más de lo que situaban. */
const MAPA = {
  limites: { sur: 40.399, norte: 40.452, oeste: -3.736, este: -3.663 },
  retiro: [
    [40.4245, -3.6890], [40.4245, -3.6745], [40.4060, -3.6745], [40.4060, -3.6890]
  ],
  manzanares: [
    [40.4500, -3.7290], [40.4330, -3.7245], [40.4180, -3.7205], [40.4060, -3.7160], [40.3995, -3.7095]
  ]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { BARRIOS, MAPA };
}

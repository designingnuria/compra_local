# Analítica en Tinybird

Qué se mide, cómo se enciende y qué preguntas responde.

## Encenderla

1. **Crea un workspace** en Tinybird para esta web (separado del de tu otra
   página, así los datos no se mezclan).

2. **Crea el Data Source** con el nombre `analytics_events` y el esquema de
   `analytics_events.datasource`. En la interfaz: *Data Sources* → *Create
   Data Source* → *Events API*, y pega el esquema.

3. **Crea un token de escritura**: *Tokens* → *Create token*. Dale permiso
   **solo de `APPEND` sobre `analytics_events`**, nada más.

   Esto importa: el token va escrito en el código de la página y cualquiera
   puede leerlo. Con un token de append lo peor que puede pasar es que alguien
   te meta filas falsas. Con un token de admin ahí, alguien podría leer o
   borrar el workspace entero.

4. **Copia el host de tu región** (arriba a la derecha, *Copy API host*). Es
   algo tipo `https://api.europe-west2.gcp.tinybird.co`, y **no es el mismo
   para todos los workspaces**.

5. Pon los dos valores en `assets/js/analitica.js`:

   ```js
   var API   = "https://api.tu-region.tinybird.co";
   var TOKEN = "p.tu_token_de_append";
   ```

6. `node scripts/versionar.js --escribir` y sube. Ese paso vuelve a sellar el
   archivo para que los navegadores no se queden con la versión antigua.

Mientras `TOKEN` esté vacío, el archivo no hace nada: se puede tener subido en
producción sin configurar y no manda ni una petición.

## Qué se manda

Cinco tipos de evento, en la columna `action`:

| `action`    | Cuándo | `payload` |
|---|---|---|
| `page_hit`  | Al abrir la web | `href`, `pathname`, `referrer`, `locale`, `user-agent` |
| `busqueda`  | Al escribir en el buscador y parar 1,5 s | `termino`, `resultados` |
| `filtro`    | Al pulsar una categoría | `categoria` |
| `negocio`   | Al pulsar la web o el Instagram de una ficha | `id`, `destino` |
| `propuesta` | Al enviarse el formulario | — |

`payload` es una cadena con JSON dentro. Para leerlo en un Pipe:

```sql
SELECT
  JSONExtractString(payload, 'termino')      AS termino,
  JSONExtractInt(payload, 'resultados')      AS resultados,
  count()                                    AS veces
FROM analytics_events
WHERE action = 'busqueda'
GROUP BY termino, resultados
ORDER BY veces DESC
```

## La pregunta que de verdad importa

Qué busca la gente y no encuentra. Cada una de esas filas es un negocio que
falta en el directorio:

```sql
SELECT
  JSONExtractString(payload, 'termino') AS termino,
  count()                               AS veces
FROM analytics_events
WHERE action = 'busqueda'
  AND JSONExtractInt(payload, 'resultados') = 0
GROUP BY termino
ORDER BY veces DESC
LIMIT 50
```

Y cuáles se pulsan de verdad, que es lo que dice si el directorio sirve:

```sql
SELECT
  JSONExtractString(payload, 'id') AS negocio,
  count()                          AS clics
FROM analytics_events
WHERE action = 'negocio'
GROUP BY negocio
ORDER BY clics DESC
```

## Qué no se guarda

- **Ni cookies ni nada permanente.** El identificador de sesión vive en
  `sessionStorage`: se borra al cerrar la pestaña, no se comparte entre webs y
  no sirve para reconocer a nadie al día siguiente.
- **Nada personal.** Ni nombres, ni correos, ni la dirección IP.
- **Se respeta al navegador.** Si lleva activado *Do Not Track* o *Global
  Privacy Control*, no se manda ningún evento.
- **En local no se mide**, para no ensuciar los datos con las pruebas.

Por eso la web no necesita cartel de cookies. Si algún día se añade algo que
sí identifique a alguien, eso cambia.

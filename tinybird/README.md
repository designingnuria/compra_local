# Analítica en Tinybird

En Tinybird Forward los recursos no se crean desde la interfaz: se declaran
como archivos y nacen en el despliegue. Este directorio **es** ese proyecto.

```
datasources/analytics_events.datasource   la tabla y el token de escritura
endpoints/*.pipe                          tres consultas ya hechas
```

## Encenderla

El despliegue lo hace GitHub solo, con `.github/workflows/tinybird.yml`. No
hace falta instalar el CLI en ningún ordenador.

1. **Guarda dos secretos en el repositorio**, en *Settings → Secrets and
   variables → Actions → New repository secret*:

   | Nombre | Valor |
   |---|---|
   | `TB_ADMIN_TOKEN` | el *Workspace admin token* de Tinybird |
   | `TB_HOST` | el API host de tu región, p. ej. `https://api.tinybird.co` |

   Ese token de admin abre el workspace entero, así que va ahí y en ningún
   otro sitio: GitHub lo guarda cifrado, no se puede volver a leer una vez
   guardado y aparece tachado en los registros.

2. **Lanza el despliegue**: pestaña *Actions* → *Desplegar Tinybird* → *Run
   workflow*. A partir de ahí se dispara solo cada vez que cambie algo de
   `tinybird/`.

   Eso crea el Data Source `analytics_events`, los tres endpoints y un token
   llamado **tracker web** con permiso únicamente de `APPEND` sobre esa tabla.

3. **Copia el token `tracker web`** desde *Tokens* en Tinybird y ponlo en
   `assets/js/analitica.js`, junto al API host:

   ```js
   var API   = "https://api.tu-region.tinybird.co";
   var TOKEN = "p.el_token_tracker_web";
   ```

   Ese sí acaba a la vista en el código de la web, y no pasa nada: con permiso
   de append lo peor que puede hacer alguien es meter filas falsas.

4. `node scripts/versionar.js --escribir` y sube. Ese paso vuelve a sellar el
   archivo para que ningún navegador se quede con la versión antigua.

Mientras `TOKEN` esté vacío, la web no manda ni una petición: se puede tener
el archivo subido a producción sin configurar.

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

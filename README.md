# Tomatito Argentino

Una web app romántica y mobile-first para acompañar un viaje de un día desde
Colonia a Buenos Aires. Incluye nueve momentos secuenciales y sugerencias de
comida y compras con mapas.

## Desarrollo local

Requiere Node.js 22 o superior.

```bash
npm install
npm run dev
```

Para comprobar la versión publicable:

```bash
npm run build
npm run preview
```

Antes de la fecha de apertura, se puede saltear la bienvenida para probar el
recorrido agregando `?preview=1` al final de la URL. Por ejemplo:

```text
http://localhost:5173/?preview=1
```

## Publicación

El workflow de `.github/workflows/deploy-pages.yml` compila y publica `dist/`
al hacer push a `main`. En GitHub, la fuente de Pages debe estar configurada
como **GitHub Actions**.

## Documentación del agente

La visión, arquitectura, decisiones y próximos pasos viven en
[`docs/agent/`](docs/agent/README.md).

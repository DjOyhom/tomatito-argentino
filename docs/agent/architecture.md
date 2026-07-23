# Arquitectura

## Stack actual

- React 19 para la interfaz.
- Vite 8 para desarrollo y build.
- CSS plano para mantener el diseño portable y fácil de modificar.
- GitHub Actions + GitHub Pages para publicación estática.

## Estructura

```text
.
├── .github/workflows/       Automatización de publicación
├── docs/agent/              Fuente de verdad para agentes
├── src/
│   ├── App.jsx              Experiencia principal
│   ├── data/itinerary.js    Pasos y contenido del recorrido
│   ├── main.jsx             Entrada de React
│   └── styles.css           Sistema visual inicial
├── AGENTS.md                Reglas breves para agentes
├── index.html               Documento base
└── vite.config.js           Configuración de build
```

## Criterios técnicos

- El resultado debe seguir siendo un sitio estático mientras el producto no
  requiera persistencia compartida.
- El workflow pasa `BASE_PATH` con el nombre real del repositorio para que los
  assets funcionen bajo `usuario.github.io/repositorio/`; localmente se usa `/`.
- Los datos del recorrido podrán comenzar como objetos locales separados de la
  UI. No agregar una librería de estado hasta que exista una necesidad real.
- El progreso se guarda en `localStorage` y los pasos se desbloquean en orden
  mediante un botón. Si el almacenamiento no está disponible, la app sigue
  funcionando en memoria.
- Los lugares elegidos también se guardan en `localStorage`, agrupados por paso.
  Se pueden marcar varios lugares y las selecciones continúan visibles al
  recargar o al desplegar un paso completado.
- Antes del 1 de agosto de 2026 a las 06:00 (UTC-3), la interfaz solo muestra
  una bienvenida y mantiene oculto el contenido del itinerario.
- Para pruebas, el parámetro de URL `?preview=1` omite la bienvenida. Sin ese
  parámetro, la apertura programada continúa siendo el comportamiento normal.
- Los pasos de sugerencias contienen una lista local de lugares. La interfaz
  muestra un mapa embebido de Google por vez y ofrece un enlace de búsqueda;
  no incorpora SDKs, claves ni geolocalización.
- Si se agregan rutas del lado cliente, hay que implementar el fallback de
  GitHub Pages o elegir navegación sin URLs profundas.
- Secretos y detalles privados no deben incorporarse al bundle: todo código de
  una web estática puede ser inspeccionado por quien visite el sitio.

## Validación mínima

Antes de cerrar una implementación:

1. Ejecutar `npm run build`.
2. Corregir errores y advertencias relevantes.
3. Revisar que no se agregaron secretos ni datos personales.
4. Si cambió una decisión, actualizar esta base de conocimiento.

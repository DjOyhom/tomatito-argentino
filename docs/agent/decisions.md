# Registro de decisiones

## 2026-07-18 — React con Vite

**Decisión:** usar React y Vite en lugar de un framework con servidor.

**Motivo:** la experiencia inicial es pequeña, estática y debe publicarse en
GitHub Pages. Este stack reduce infraestructura y deja abierta la evolución por
componentes.

## 2026-07-18 — GitHub Pages mediante Actions

**Decisión:** compilar en GitHub Actions y desplegar el artefacto `dist/`.

**Motivo:** evita versionar archivos generados y usa el mecanismo oficial de
Pages para builds personalizados.

## 2026-07-18 — Sin backend ni persistencia

**Decisión:** no agregar servicios, base de datos o autenticación todavía.

**Motivo:** aún no se definió la mecánica de las paradas. Agregar infraestructura
antes de conocerla crearía complejidad especulativa.

## 2026-07-18 — Contenido no sensible

**Decisión:** la base solo contiene textos de muestra y ninguna ubicación real.

**Motivo:** GitHub Pages y un repositorio público no son adecuados para ocultar
secretos dentro del JavaScript generado.

## 2026-07-18 — Recorrido como workflow secuencial (decisión inicial)

**Decisión:** organizar la cita como una lista de pasos que se completan y
desbloquean en orden. La versión actual usa botones y cinco pasos de ejemplo.

**Motivo:** la cita incluye un recorrido entre varios lugares y la app debe
acompañar lo que hay que hacer durante todo el día. El mecanismo definitivo de
desbloqueo sigue abierto hasta conocer el itinerario real.

**Estado:** el avance secuencial por botones continúa vigente; los cinco pasos
de ejemplo fueron reemplazados por el itinerario real registrado más abajo.

## 2026-07-18 — Mapas mediante enlaces opcionales (decisión inicial)

**Decisión:** cada paso puede declarar un destino y mostrar una tarjeta que abre
una búsqueda en Google Maps. No se usa geolocalización ni un mapa embebido.

**Motivo:** deja preparado el espacio solicitado sin sumar claves, servicios o
direcciones reales antes de que el usuario confirme las paradas.

**Estado:** reemplazada por la decisión de sugerencias con mapa embebido una vez
que el usuario confirmó los lugares.

## 2026-07-18 — Itinerario real de Colonia a Buenos Aires

**Decisión:** reemplazar el recorrido de ejemplo por ocho pasos confirmados:
preparación, barco de ida, desayuno, moda vegana, comida, última vuelta, regreso
a la terminal y cierre.

**Motivo:** el usuario entregó el workflow y sus textos. Los dos bloques finales
que compartían índice en el documento se conservan como momentos consecutivos.

## 2026-07-18 — Sugerencias con mapa embebido

**Decisión:** los cuatro pasos con sugerencias permiten alternar entre lugares,
ver un único mapa embebido por vez y abrir el lugar seleccionado en Google Maps.

**Motivo:** el workflow incluye ubicaciones concretas y sus iframes. Mostrar un
solo mapa reduce carga y espacio vertical en teléfonos sin perder opciones.

## 2026-07-18 — Chequeo de comida antes del regreso

**Decisión:** agregar un noveno paso opcional antes de emprender el regreso a la
terminal, con Hierbabuena y Sale e Pepe como sugerencias en San Telmo.

**Motivo:** el usuario pidió comprobar si queda tiempo para comer antes de subir
al barco. Se ubica antes del aviso de regreso porque ambos lugares están en
Buenos Aires y deben visitarse antes de partir hacia la terminal.

## 2026-07-21 — Bienvenida con apertura programada

**Decisión:** ocultar visualmente todo el contenido de la cita hasta el sábado
1 de agosto de 2026 a las 06:00, hora de Uruguay (UTC-3). Antes de ese momento
solo se muestra una pantalla de bienvenida minimalista.

**Motivo:** preservar la sorpresa y dejar claro cuándo comienza la experiencia.
Al ser un sitio estático, esta barrera no pretende proteger secretos frente a
alguien que inspeccione el código fuente.

## 2026-07-21 — Progreso local e historial desplegable

**Decisión:** guardar el índice del paso actual en `localStorage`. Los pasos ya
completados se muestran comprimidos y permiten volver a desplegar su contenido
desde el control “Paso completado”.

**Motivo:** evitar que una recarga reinicie el recorrido y permitir consultar lo
que ya pasó sin que el historial ocupe demasiado espacio en pantalla.

## 2026-07-21 — Bypass de bienvenida para pruebas

**Decisión:** aceptar el parámetro `?preview=1` como feature flag para mostrar el
recorrido antes de la apertura programada. El parámetro no se conserva ni cambia
la experiencia de quienes entren por la URL habitual.

**Motivo:** permitir probar el itinerario completo sin modificar temporalmente la
fecha de apertura ni desactivar la bienvenida para todas las visitas.

## 2026-07-21 — Cierre de la portada con Tráfico intenso

**Decisión:** reemplazar “Daleee campeón” por “Tráfico intenso” en la línea breve
de la portada: “9 pasos · Un día juntos · Tráfico intenso”.

**Motivo:** vincular el cierre de la presentación con el contexto personal del
viaje y retirar la referencia al campeonato.

## 2026-07-21 — Selecciones de lugares persistentes

**Decisión:** permitir marcar una o más sugerencias dentro de cada paso. Cada
lugar elegido muestra un tick a la derecha y un estado de color destacado. Las
selecciones se guardan en `localStorage` y reaparecen al recargar o al consultar
un paso completado.

**Motivo:** conservar un registro local de los lugares planificados y visitados
sin agregar backend ni cuentas de usuario.

## 2026-07-23 — Ticket del barco descargable

**Decisión:** mostrar en “¡Todos a bordo!” un botón para descargar el ticket de
Colonia Express almacenado como PDF en los archivos públicos de la aplicación.
El acceso sigue disponible al desplegar el paso después de completarlo.

**Motivo:** tener el pasaje a mano durante el momento del embarque sin salir del
recorrido.

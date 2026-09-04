# Feature Specification: Hackathon Team Discovery & Join (Frontend)

**Feature Branch**: `master` (feature directory `specs/001-hackathon-team-frontend/`)

**Created**: 2026-08-27

**Status**: Draft

**Input**: User description: "Frontend web de TeamForMe: los participantes de hackathons descubren eventos, ven los equipos existentes (aforo, público/privado) y se postulan a uno. Sin backend real todavía: toda la data viene de una capa de servicios simulada (mock) que respeta los contratos del backend futuro. Diseño dark mode estilo Luma, en español."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explorar eventos disponibles (Priority: P1)

Un participante llega a la aplicación y ve la lista de hackathons disponibles, cada uno con
su nombre, fecha, lugar y una indicación general de cuán ocupados están sus equipos, para
decidir a cuál quiere entrar.

**Why this priority**: Es la puerta de entrada de todo el producto. Sin el descubrimiento
de eventos, ninguna otra acción tiene contexto. Entrega valor por sí sola: un participante
puede evaluar qué hackathons le interesan.

**Independent Test**: Cargar la ruta de eventos y verificar que se muestra una cuadrícula de
tarjetas de eventos con datos provenientes de la capa mock, incluyendo estados de carga y
un caso de lista vacía.

**Acceptance Scenarios**:

1. **Given** la capa de datos simulada contiene varios eventos, **When** el usuario abre la
   vista de eventos, **Then** ve una tarjeta por cada evento con nombre, fecha y lugar.
2. **Given** los datos aún se están cargando (latencia simulada), **When** el usuario abre
   la vista, **Then** ve un indicador de carga hasta que aparecen las tarjetas.
3. **Given** no hay eventos disponibles, **When** el usuario abre la vista, **Then** ve un
   mensaje claro de "no hay eventos" en lugar de una pantalla vacía.

---

### User Story 2 - Ver el detalle de un evento y sus equipos (Priority: P1)

Desde un evento, el participante ve dónde ocurre (ubicación en un mapa), un resumen del
aforo global y la lista de equipos del evento. Cada equipo muestra cuántos cupos tiene
ocupados, si es público o privado, y —solo si es público— los integrantes actuales.

**Why this priority**: Es la información que el participante necesita para elegir equipo.
Es un incremento independiente sobre la Historia 1 y demostrable por sí mismo.

**Independent Test**: Abrir el detalle de un evento conocido y verificar el mapa centrado
en sus coordenadas, el resumen de aforo, y una tarjeta por equipo con su anillo de cupos,
su badge de visibilidad y la pila de avatares oculta para equipos privados.

**Acceptance Scenarios**:

1. **Given** un evento con coordenadas, **When** el usuario abre su detalle, **Then** ve un
   mapa centrado en la ubicación del evento con un marcador en ese punto.
2. **Given** un evento con varios equipos, **When** el usuario abre su detalle, **Then** ve
   un resumen de aforo (cupos ocupados / cupos totales agregados) y una tarjeta por equipo.
3. **Given** un equipo público, **When** se muestra su tarjeta, **Then** se ven los avatares
   de sus integrantes (con indicador "+N" si exceden el espacio visible).
4. **Given** un equipo privado, **When** se muestra su tarjeta, **Then** NO se muestra ningún
   avatar ni dato de integrantes, solo un indicador de equipo privado.
5. **Given** la lista de equipos, **When** el usuario aplica el filtro "con cupo" / "llenos"
   / "todos", **Then** la lista se reduce a los equipos que cumplen ese criterio.
6. **Given** un equipo, **When** se muestra su anillo de cupos, **Then** el color refleja su
   estado: disponible, casi lleno, o lleno.

---

### User Story 3 - Postularse a un equipo (Priority: P1)

El participante elige un equipo con cupo y envía una postulación con sus datos (nombre,
email, rol/skill que aporta y motivación). Si el equipo está lleno, no puede postularse.

**Why this priority**: Es la acción central del producto —el objetivo por el que el
participante entró. Depende de las Historias 1 y 2 para tener contexto, pero completa el
bucle de valor principal.

**Independent Test**: Desde la tarjeta de un equipo con cupo, abrir el formulario de
postulación en un modal accesible, completar los campos, enviarlo y recibir confirmación;
y verificar que un equipo lleno no permite abrir el formulario.

**Acceptance Scenarios**:

1. **Given** un equipo con al menos un cupo libre, **When** el usuario pulsa "Unirse",
   **Then** se abre un modal con un formulario de postulación.
2. **Given** el formulario abierto, **When** el usuario deja campos obligatorios vacíos o
   con un email inválido, **Then** ve mensajes de validación y no puede enviar.
3. **Given** un formulario válido, **When** el usuario lo envía, **Then** la postulación se
   registra en la capa simulada y el usuario es llevado a la vista de estado de la
   postulación.
4. **Given** un equipo sin cupos, **When** se muestra su tarjeta, **Then** el botón de unirse
   está deshabilitado y muestra "Sin cupos disponibles".
5. **Given** el modal abierto, **When** el usuario navega con el teclado, **Then** el foco
   queda atrapado dentro del modal y se puede cerrar con la tecla Escape.

---

### User Story 4 - Seguir el estado de una postulación (Priority: P2)

Tras postularse, el participante ve el estado de su solicitud: primero "pendiente" y, tras
un tiempo, cambia de forma automática a "aceptada" o "rechazada".

**Why this priority**: Cierra la experiencia y da retroalimentación, pero el valor central
(postularse) ya se entregó en la Historia 3. Puede construirse y demostrarse por separado.

**Independent Test**: Abrir la vista de estado de una postulación recién creada, verla en
"pendiente", y observar la transición automática a un estado final sin recargar la página.

**Acceptance Scenarios**:

1. **Given** una postulación recién enviada, **When** el usuario ve su estado, **Then**
   aparece como "Pendiente".
2. **Given** una postulación en "pendiente", **When** transcurre el tiempo de resolución
   simulado, **Then** el estado cambia visiblemente a "Aceptada" o "Rechazada" sin
   intervención del usuario.
3. **Given** un identificador de postulación inexistente, **When** el usuario abre la vista
   de estado, **Then** ve un mensaje de "postulación no encontrada".

---

### Edge Cases

- **Evento inexistente**: al abrir el detalle de un id de evento que no existe en los datos
  simulados, se muestra un mensaje de "evento no encontrado" en lugar de una pantalla rota.
- **Equipo que se llena entre ver y postularse**: si el equipo alcanza su capacidad después
  de que el usuario abrió el formulario, el envío es rechazado por la capa simulada y el
  usuario ve el mensaje de "equipo lleno".
- **Latencia de red simulada**: todas las vistas que cargan datos muestran un estado de
  carga y un estado de error si la operación simulada falla.
- **Mapa sin coordenadas**: si un evento no trae coordenadas, la sección de mapa se oculta o
  muestra un aviso, sin romper el resto del detalle.
- **Doble envío del formulario**: pulsar "Enviar" repetidamente no crea múltiples
  postulaciones; el botón se bloquea mientras la operación está en curso.
- **Modal en móvil**: el modal de postulación es usable en la anchura mínima soportada
  (360px) sin desbordes horizontales.

## Requirements *(mandatory)*

### Functional Requirements

#### Descubrimiento de eventos

- **FR-001**: El sistema MUST mostrar una lista de eventos (hackathons) con, al menos,
  nombre, fecha y lugar de cada evento.
- **FR-002**: El sistema MUST mostrar un estado de carga mientras los datos de eventos se
  obtienen y un mensaje explícito cuando la lista está vacía.
- **FR-003**: El sistema MUST permitir al usuario abrir el detalle de un evento desde su
  tarjeta.

#### Detalle de evento

- **FR-004**: El sistema MUST mostrar la ubicación del evento en un mapa geográfico centrado
  en las coordenadas del evento, con un marcador en ese punto. Casos degradados:
  - si el evento **no trae coordenadas**, la sección de mapa se reemplaza por un aviso y el
    resto del detalle se muestra con normalidad;
  - si las **teselas del mapa no cargan**, se muestra un aviso dentro del contenedor del
    mapa, conservando su tamaño.
  El marcador de posición del mapa en render de servidor MUST ocupar el mismo tamaño que el
  mapa hidratado, sin salto de layout.
- **FR-005**: El sistema MUST mostrar un resumen de aforo del evento que agregue los cupos
  ocupados y totales de sus equipos.
- **FR-006**: El sistema MUST listar los equipos del evento, cada uno con su nombre, su
  etiqueta/área, su nivel de ocupación (cupos ocupados sobre capacidad) y su visibilidad
  (público o privado).
- **FR-007**: El sistema MUST representar el nivel de ocupación de cada equipo con un
  indicador visual de progreso cuyo color distingue tres estados definidos por la razón
  `filled / capacity`:
  - **disponible**: `filled / capacity < 0.8` (color teal)
  - **casi lleno**: `0.8 ≤ filled / capacity < 1` (color ámbar)
  - **lleno**: `filled / capacity ≥ 1`, lo que incluye `filled === capacity` (color coral)
- **FR-008**: El sistema MUST mostrar los integrantes SOLO para equipos públicos: avatares
  con iniciales (máximo 5 visibles) y, si el equipo tiene más de 5, un chip final `+N` con
  `N = número de integrantes − 5`. Cada avatar de iniciales MUST tener alternativa textual.
- **FR-009**: El sistema MUST ocultar por completo la identidad e integrantes de los equipos
  privados, mostrando únicamente un indicador de que el equipo es privado.
- **FR-010**: Los usuarios MUST poder filtrar la lista de equipos por "todos", "con cupo" y
  "llenos". El filtro por defecto al entrar al detalle es "todos". Si el filtro activo no
  devuelve equipos, el sistema MUST mostrar un mensaje de "no hay equipos con ese criterio"
  en lugar de una lista vacía.

#### Postulación

- **FR-011**: Los usuarios MUST poder iniciar una postulación a un equipo que tenga al menos
  un cupo libre, mediante un formulario presentado en un modal superpuesto sobre el detalle
  del evento. El modal MUST tener también una ruta enlazable propia
  (`/eventos/:eventId/equipos/:teamId/postular`); al navegar directamente a esa ruta, el
  detalle del evento se carga como fondo y el modal se abre encima. Cerrar el modal
  devuelve al detalle del evento.
- **FR-012**: El formulario de postulación MUST capturar nombre completo, email, rol/skill
  que aporta y motivación, y MUST validar que los campos obligatorios estén completos y que
  el email tenga formato válido antes de permitir el envío.
- **FR-013**: El sistema MUST impedir la postulación a un equipo sin cupos: el control para
  unirse se muestra deshabilitado con el texto "Sin cupos disponibles".
- **FR-014**: El sistema MUST rechazar, en el momento del envío, una postulación a un equipo
  que ya alcanzó su capacidad, informando al usuario que el equipo está lleno y conservando
  los datos ya escritos en el formulario para que pueda elegir otro equipo.
- **FR-015**: El sistema MUST impedir el envío duplicado de una misma postulación
  bloqueando el control de envío mientras la operación está en curso.
- **FR-016**: Tras un envío exitoso, el sistema MUST llevar al usuario a la vista de estado
  de esa postulación.

#### Estado de postulación

- **FR-017**: El sistema MUST mostrar el estado de una postulación como "Pendiente",
  "Aceptada" o "Rechazada".
- **FR-018**: El sistema MUST reflejar automáticamente la transición de "Pendiente" a un
  estado final (aceptada o rechazada) sin que el usuario recargue la vista, y MUST anunciar
  el cambio a tecnología asistiva mediante una región aria-live. Mientras la postulación
  siga "Pendiente" el sistema MUST mostrar un indicador de espera.
- **FR-019**: El sistema MUST mostrar un mensaje de "no encontrada" cuando se solicita el
  estado de una postulación que no existe.

#### Datos y preparación para backend

- **FR-020**: Toda la información mostrada MUST provenir de una capa de servicios simulada;
  ningún componente hace llamadas de red reales en esta fase.
- **FR-021**: La capa simulada MUST reproducir latencia de red (retardo de ~300–400 ms por
  operación de lectura) y MUST poder producir, de forma controlable, un estado de error para
  que las vistas ejerciten sus estados de carga y de fallo.
- **FR-022**: La capa simulada MUST exponer los mismos contratos (operaciones, entradas y
  formas de datos) que consumirá el backend real, de modo que conectarlo no requiera
  cambiar componentes ni plantillas. Los contratos por servicio están en `contracts/`.
- **FR-023**: La capa simulada MUST reproducir el flujo asíncrono de resolución de
  postulaciones: creación en "pendiente" y, tras un retardo fijo de ~4 s, cambio a un estado
  final. El resultado es **determinista por equipo**: un equipo puede estar marcado en los
  datos simulados como "siempre rechaza"; cualquier otro equipo resuelve en "aceptada".

#### Presentación e idioma

- **FR-024**: Todo el texto de interfaz MUST estar en español, incluido el formato de fechas
  y cifras visibles (locale `es`).
- **FR-025**: La aplicación MUST usar el sistema de diseño oscuro definido en
  [design-brief.md](./design-brief.md): la paleta de tokens de color exacta, las tres
  familias tipográficas (título / cuerpo / cifras) con sus pilas de reserva, tarjetas de
  esquinas redondeadas 12–16px sin franjas de color en el borde, y una cabecera superior
  fija semitransparente con `backdrop-filter: blur`. `design-brief.md` es la fuente de
  verdad visual y prevalece sobre descripciones informales.
- **FR-026**: La aplicación MUST ser responsive con enfoque mobile-first, con breakpoints en
  640px / 960px / 1280px, y MUST renderizarse sin desborde horizontal desde 360px de ancho
  (piso duro) hasta escritorio. Los conteos de columnas por breakpoint están en
  `design-brief.md`.
- **FR-027a**: Todos los elementos interactivos MUST tener un indicador de foco visible con
  contraste suficiente, y ser operables por teclado.
- **FR-027b**: La aplicación MUST respetar `prefers-reduced-motion`, desactivando la
  animación del anillo de cupos y las transiciones de gradiente cuando esté activo.
- **FR-029**: La aplicación MUST incluir un pie de página minimalista (marca del proyecto y
  enlaces secundarios de marcador de posición), sin funcionalidad adicional en esta fase.

#### Navegación

- **FR-027**: El sistema MUST ofrecer rutas navegables y enlazables para: lista de eventos,
  detalle de un evento, formulario de postulación de un equipo, y estado de una postulación.
- **FR-028**: El panel del organizador queda fuera de alcance en esta fase y MAY existir
  únicamente como ruta marcador de posición sin funcionalidad.

### Key Entities *(include if feature involves data)*

- **Evento**: un hackathon. Atributos: identificador, nombre, fecha, lugar (texto),
  coordenadas geográficas, descripción opcional, motivo visual opcional. Agrupa equipos.
- **Equipo**: un grupo dentro de un evento. Atributos: identificador, evento al que
  pertenece, nombre, etiqueta/área, capacidad, cupos ocupados, visibilidad (público o
  privado), lista de integrantes (vacía cuando es privado).
- **Integrante de equipo**: referencia a un usuario dentro de un equipo. Atributos:
  usuario, iniciales, color de avatar.
- **Postulación**: solicitud de un participante para unirse a un equipo. Atributos:
  identificador, equipo objetivo, usuario, nombre completo, email, rol/skill, motivación,
  estado (pendiente / aceptada / rechazada), fecha de creación.
- **Usuario**: un participante. Atributos: identificador, nombre completo, email, color de
  avatar.
- **Notificación**: aviso dirigido a un usuario sobre el resultado de una postulación.
  Atributos: identificador, usuario destinatario, tipo (aceptada / rechazada / pendiente),
  mensaje, fecha de creación.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un participante puede pasar de abrir la aplicación a enviar una postulación a
  un equipo en menos de 2 minutos y en no más de 4 pantallas.
- **SC-002**: El 100% de las vistas que cargan datos muestran un estado de carga y un
  estado de error diferenciados durante la latencia y los fallos simulados.
- **SC-003**: El 100% de los equipos privados no expone ningún dato de sus integrantes en
  ninguna vista.
- **SC-004**: El flujo completo (explorar → detalle → postular → ver estado) se completa de
  punta a punta usando únicamente datos simulados, sin ninguna llamada de red real.
- **SC-005**: Conectar el backend real se limita a sustituir la implementación interna de la
  capa de servicios: 0 cambios en componentes o plantillas. Verificable de forma objetiva:
  ningún archivo bajo `features/` o `shared/` importa `HttpClient` ni referencia miembros
  privados de un servicio; los componentes dependen solo de la firma pública documentada en
  `contracts/`.
- **SC-006**: La aplicación es operable por completo con teclado en el flujo de postulación,
  incluyendo apertura, recorrido y cierre del modal, con el foco contenido en el modal
  mientras está abierto.
- **SC-007**: Todas las vistas se muestran sin desborde horizontal desde 360px de ancho.
- **SC-008**: El 100% del texto de interfaz visible está en español.
- **SC-009**: Un equipo que alcanza su capacidad nunca acepta una nueva postulación: la
  tasa de postulaciones aceptadas por encima de la capacidad es 0.

## Assumptions

- **Sin backend en esta fase**: no hay autenticación real, ni persistencia real, ni
  integración con servicios de mensajería o base de datos. Todo se sirve desde una capa de
  datos simulada en el cliente.
- **Identidad del participante**: como no hay login, los datos del participante se toman del
  formulario de postulación; se asume un usuario "actual" simulado cuando se necesita para
  mostrar avatares o notificaciones.
- **Un solo idioma**: la interfaz es solo en español; la internacionalización queda fuera de
  alcance.
- **Alcance del organizador**: la gestión de eventos/equipos por parte de organizadores no
  se desarrolla; a lo sumo existe una ruta marcador de posición.
- **Diseño de referencia**: existe un prototipo HTML/CSS validado ("EventFlow / TeamForMe",
  dark mode estilo Luma). Su paleta, tipografía y estilo de tarjetas están capturados de
  forma versionada en [design-brief.md](./design-brief.md), que es la fuente de verdad
  visual para esta feature.
- **Contratos de datos**: las formas de datos de las entidades anteriores corresponden a las
  entidades previstas del backend futuro (eventos, equipos, postulaciones, usuarios,
  notificaciones) y se consideran estables para esta fase.
- **Resolución de postulaciones**: el resultado (aceptada/rechazada) lo decide la capa
  simulada tras un retardo; no hay reglas de negocio reales de selección en esta fase.
- **Mapa geográfico**: se asume disponibilidad de un mapa con teselas para mostrar la
  ubicación del evento; sin conectividad, la vista degrada mostrando un aviso.

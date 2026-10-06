# Vida Universitaria - Clubes y Actividades Estudiantiles
### Universidad de Lima — Programación Web (2026-2) — Tema 9

Plataforma web integral desarrollada para la centralización, descubrimiento, gestión y gobernanza de agrupaciones estudiantiles y actividades extracurriculares de la **Universidad de Lima**, bajo supervisión de la **Dirección de Bienestar Estudiantil**.

---

## 1. Personas de Prueba y Credenciales de Evaluación

Para facilitar la calificación docente, la plataforma incluye un **Selector Rápido de Perfiles (Role Switcher)** flotante en la esquina inferior izquierda, además de credenciales institucionales precargadas:

| Rol | Nombre Completo | Correo Institucional | Perfil y Permisos |
|---|---|---|---|
| **Visitante** | *Público / Anónimo* | — | Explora landing, directorio de clubes, cartelera pública y eventos sin iniciar sesión. |
| **Estudiante** | **Camila Andrade Quispe** | `camila.quispe@aloe.ulima.edu.pe` | Alumna regular (Ing. Industrial, 8.° ciclo, Cód. 20211842). Miembro de Debate, postulante a Robótica, inscrita con ticket digital. |
| **Directiva** | **Lucía Mendoza Ríos** | `lucia.mendoza@aloe.ulima.edu.pe` | Presidenta de **Club de Robótica Ulima**. Posee barra de contexto, edición de club, bandeja de postulaciones, creador de actividades, control de asistencia y moderación de tablón. |
| **Administrador** | **Bienestar Estudiantil** | `admin@aloe.ulima.edu.pe` | Encabezado institucional oscuro (`#1E1728`). Tablero de KPIs, aprobación y suspensión de clubes, bloqueo temporal de estudiantes y reportes ejecutivos. |
| **Sancionado** | **Carlos Eduardo Morales** | `carlos.morales@aloe.ulima.edu.pe` | Cuenta con sanción disciplinaria activa (Art. 45 - Bienestar Estudiantil) para demostración de estados bloqueados. |

> **Nota:** Puedes hacer clic en el botón circular de reinicio en el widget flotante para **restablecer todos los datos al catálogo inicial de prueba** en cualquier momento.

---

## 2. Matriz de Cumplimiento de Historias de Usuario

| Historia | Descripción Funcional | Estado | Componentes / Vistas Implementadas |
|---|---|:---:|---|
| **HU-1: Cuenta y Acceso** | Registro validado `@aloe.ulima.edu.pe`, login, perfil de estudiante, cambio de rol Estudiante/Directiva, estados 403, 404 y cuenta bloqueada. | **100%** | `LandingPage`, `LoginPage`, `RegisterPage`, `ProfilePage`, `RoleSwitcher`, `ForbiddenPage`, `NotFoundPage`. |
| **HU-2: Perfil del Club** | Gestión de club por directiva (información, misión, visión, logotipo, banner, requisitos) y ficha pública interactiva con pestañas. | **100%** | `ClubDetailPage`, `ClubProfileEditPage`, `ClubImagesEditPage`, `ClubAdmissionEditPage`. |
| **HU-3: Directorio y Membresías** | Buscador en tiempo real, filtros múltiples por categoría, convocatoria y días; formulario de postulación con preguntas dinámicas; bandeja de solicitudes y directorio de miembros. | **100%** | `ClubDirectoryPage`, `MembershipModal`, `ClubRequestsPage`, `ClubMembersPage`, `MyClubsPage`. |
| **HU-4: Actividades del Club** | Creación y edición de eventos por directiva con cupos, modalidad y fecha; cartelera general con filtros de categoría y modalidad. | **100%** | `BillboardPage`, `ActivityDetailPage`, `ClubActivitiesManagePage`. |
| **HU-5: Inscripciones y Asistencia** | Inscripción con control de aforo, pase digital con código de ticket, lista de espera con reasignación automática, registro de asistencia y **exportación a CSV**. | **100%** | `MyRegistrationsPage`, `ActivityDetailPage`, `AttendancePage`. |
| **HU-6: Tablón del Club** | Comunicados oficiales con badge "Fijado", hilo de comentarios entre miembros y herramientas de moderación y eliminación por directiva. | **100%** | `ClubDetailPage` (Pestaña Tablón), `ClubBoardManagePage`. |
| **HU-7: Métricas y Administración** | Tablero de control de Bienestar Estudiantil con KPIs, distribución por categorías, supervisión de clubes (aprobar/suspender), bloqueo de usuarios y descarga de reportes CSV. | **100%** | `AdminDashboardPage`, `AdminClubsPage`, `AdminUsersPage`, `AdminReportsPage`, `RegisterClubPage`. |

---

## 3. Tokens de Diseño y Fidelidad Visual

El proyecto reproduce con exactitud las especificaciones visuales de los mockups (`Tema9_Mockups_f.pdf`):
- **Colores de Marca**:
  - Primario Ulima: `#6B2FA8` | Primario Oscuro: `#4F2280` | Soft: `#F0E9F9`
  - Acento: `#17A2A2` | Fondo General: `#FBFAFD` | Superficie: `#FFFFFF` | Bordes: `#E6E1EE`
  - Texto Principal: `#1E1728` | Texto Secundario: `#6E6580`
  - Estados: Éxito `#1E7F4D`, Advertencia `#B7791F`, Peligro `#B4322B`, Info `#3B6FA8`
- **Categorías de Clubes**:
  - Tecnología: `#2563A8` | Académico: `#5A3FA0` | Social: `#C2681C`
  - Arte: `#A63BA6` | Deportes: `#1F7A4D` | Cultura: `#B5305F`
- **Tipografía Oficial Google Fonts**:
  - Títulos y encabezados: `Outfit` (pesos 600, 700, 800)
  - Cuerpo de texto y controles: `Inter` (pesos 400, 500, 600)
- **Geometría**:
  - Tarjetas y paneles: `border-radius: 14px`
  - Inputs y botones: `border-radius: 10px`
  - Badges y switchers: `border-radius: 999px`
- **Cabeceras por Rol**:
  - Visitante: Header público con botones de registro e inicio de sesión.
  - Estudiante: Header con campanita de notificaciones dinámicas y avatar `[CQ]`.
  - Directiva: Header con switcher de rol `[Estudiante | Directiva]` y barra de contexto (`ContextBar`) del club.
  - Administrador: Header oscuro en tono `#1E1728` con identificación de Bienestar Estudiantil.

---

## 4. Estructura del Proyecto

```
codespaces-blank/
├── frontend/                          # Aplicación React + TypeScript + Vite
│   ├── public/                        # Favicon e íconos institucionales
│   ├── src/
│   │   ├── components/                # Componentes modulares y reutilizables
│   │   │   ├── clubs/                 # MembershipModal y utilidades de clubes
│   │   │   ├── common/                # RoleSwitcher interactivo
│   │   │   └── layout/                # Header (dinámico por rol), ContextBar, Footer
│   │   ├── context/                   # AuthContext y ToastContext
│   │   ├── data/                      # seedData.json (Catálogo inicial de prueba)
│   │   ├── pages/
│   │   │   ├── activities/            # BillboardPage, ActivityDetailPage
│   │   │   ├── admin/                 # AdminDashboard, AdminClubs, AdminUsers, AdminReports
│   │   │   ├── clubs/                 # ClubDirectoryPage, ClubDetailPage
│   │   │   ├── directive/             # Gestión de perfil, imágenes, admisión, solicitudes, miembros, actividades, asistencia y tablón
│   │   │   ├── public/                # Landing, Login, Registro de Alumno, Registro de Club, 403, 404
│   │   │   └── student/               # Mi Perfil, Mis Clubes, Mis Inscripciones
│   │   ├── services/                  # storageService.ts (Persistencia reactiva con fallback)
│   │   ├── styles/                    # tokens.css y global.css
│   │   ├── types/                     # Interfaces TypeScript estrictas
│   │   ├── App.tsx                    # Enrutador principal y guards de navegación
│   │   └── main.tsx                   # Punto de entrada
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── backend/                           # Servidor Express REST API (Entrega Final)
│   ├── src/
│   │   └── server.ts                  # Endpoints REST para clubes, actividades, usuarios y CSV
│   ├── package.json
│   └── tsconfig.json
├── package.json                       # Scripts unificados
└── README.md
```

---

## 5. Instrucciones de Ejecución

### 5.1 Ejecutar Aplicación Web (Frontend)
```bash
cd frontend
npm run dev
```
La aplicación iniciará en `http://localhost:5173`.

### 5.2 Compilar para Producción
```bash
# Desde la raíz del repositorio:
npm run build
```

### 5.3 Ejecutar Servidor Backend REST (Opcional)
```bash
cd backend
npm run dev
```
El servidor REST iniciará en `http://localhost:4000/api`.

---

## 6. Verificación de Flujos de Prueba Recomendados

1. **Flujo de Postulación a un Club**:
   - Inicia sesión como **Camila** (o usa el switcher flotante).
   - Ve a **Directorio**, busca *"Club de Robótica Ulima"* y haz clic en **Postular**.
   - Responde las preguntas de postulación y envía.
   - Cambia a **Lucía (Directiva)** desde el switcher.
   - Entra a **Gestión de mi club** -> pestaña **Solicitudes (3)**.
   - Visualiza las respuestas del postulante y haz clic en **Aceptar**.
2. **Flujo de Inscripción y Lista de Espera**:
   - En **Cartelera**, busca la actividad *"Hackathon de IA y Robótica"* (que tiene cupos completos: 30/30).
   - Haz clic en **Unirme a Lista de Espera**.
   - Revisa la vista **Mis Inscripciones** para ver el estado de prioridad.
3. **Flujo de Asistencia y Exportación a CSV**:
   - Como **Lucía (Directiva)**, ve a **Gestión de Club** -> **Actividades** -> **Asistencia** en el *"Taller Práctico de Robots Sumo"*.
   - Marca asistencias (*Presente*, *Tardanza*, *Ausente*).
   - Presiona **"Exportar Asistencia a CSV"** y verifica la descarga del archivo `.csv`.
4. **Flujo de Moderación de Bienestar Estudiantil**:
   - Cambia a **Bienestar Estudiantil (Admin)** desde el switcher flotante.
   - Revisa las métricas y gráficos en el **Tablero**.
   - En **Clubes**, aprueba la solicitud de *"Game Dev & eSports Club"* que se encuentra en estado *En Revisión*.
   - En **Usuarios**, observa la cuenta sancionada de *Carlos Morales* o suspende preventivamente a un usuario con su respectiva justificación.
# PrograWeb

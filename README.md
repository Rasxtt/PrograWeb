# Tema 9: Vida Universitaria - Clubes y Actividades Estudiantiles

**Universidad de Lima**  
**Facultad de Ingeniería y Arquitectura | Carrera de Ingeniería de Sistemas**  
**Asignatura:** Programación Web (2026-2)

---

## 📌 Descripción del Proyecto

**Vida Universitaria** es una plataforma web integral diseñada para la comunidad estudiantil de la Universidad de Lima. Su objetivo principal es facilitar el descubrimiento, postulación, gestión y participación en clubes estudiantiles, talleres extracurriculares y eventos de la vida universitaria.

El proyecto está construido sobre la arquitectura de la plantilla oficial de la cátedra, implementando una arquitectura **Full-Stack Modular** con **Node.js + Express 5** en el backend y **React 18 + Vite 5 + Bootstrap 5.3 + FontAwesome** en el frontend, con compilación multi-perfil (Multi-Entry Points).

---

## 🚀 Arquitectura y Tecnologías

### Stack Tecnológico
- **Frontend:** React 18, React Router v7, Bootstrap 5.3, FontAwesome (v6/v7 Free), Vite 5.
- **Backend:** Node.js, Express 5, EJS Layouts (`ejs-mate`), Express Session (`session-file-store`), Morgan.
- **Base de Datos / Persistencia:** Repositorios desacoplados con soporte para memoria/mock y PostgreSQL / Supabase vía Sequelize / pg.
- **Compilación Frontend:** Vite con arquitectura multi-entry, generando bundles independientes y optimizados para cada rol de usuario.

### Arquitectura Multi-Entry (Vite)
Cada perfil de usuario cuenta con su propio punto de entrada compilado para garantizar independencia, aislamiento de dependencias y tiempos de carga óptimos:

| Perfil | Entrada Vite | Salida Generada | Descripción |
|---|---|---|---|
| **Público / Visitante** | `src/entries/web.jsx` | `public/dist/js/web.js` | Catálogo de clubes, cartelera de actividades, detalle de clubes/eventos, login y registro. |
| **Estudiante** | `src/entries/student.jsx` | `public/dist/js/student.js` | Portal del estudiante: Mis clubes, mis actividades, solicitudes enviadas y perfil. |
| **Directiva de Club** | `src/entries/directive.jsx` | `public/dist/js/directive.js` | Panel de directiva: Aprobación de miembros, gestión de eventos y control de asistencia. |
| **Administrador** | `src/entries/admin.jsx` | `public/dist/js/admin.js` | Panel administrativo central: Auditoría de clubes, solicitudes de creación, usuarios y reportes. |
| **Estilos Globales** | `src/styles/` | `public/dist/css/web.css` | Sistema de tokens de diseño, tipografía Ulima y Bootstrap unificado. |

---

## 📂 Estructura del Proyecto

```plaintext
├── admin/                     # Módulo del panel de administración
│   ├── configs/routes.js      # Rutas del panel administrativo (/admin/*)
│   └── controllers/           # Controladores del módulo de administración
├── api/                       # Punto de entrada de funciones serverless (Vercel)
│   └── index.js
├── configs/                   # Configuraciones globales del servidor Express
│   ├── bootstrap.js           # Inicialización de rutas, middlewares y sesiones
│   ├── database.js            # Conexión a base de datos
│   ├── helpers.js             # Helpers y utilidades del servidor
│   └── middlewares.js         # Middlewares de autenticación y autorización por rol
├── db/                        # Migraciones y esquema SQL
│   ├── migrations/
│   └── schema.sql
├── directive/                 # Módulo del panel de directiva de clubes
│   ├── controllers.js         # Lógica de miembros, solicitudes, eventos y asistencia
│   └── routes.js              # Rutas de directiva (/directiva/*)
├── docs/                      # Diagramas de base de datos y documentación técnica
├── public/                    # Archivos estáticos y distribución compilada
│   ├── assets/                # Imágenes y recursos estáticos
│   └── dist/                  # Bundles JS/CSS generados por Vite
├── src/                       # Aplicación React (SPA / Componentes)
│   ├── components/            # Componentes reutilizables (Navbar, Cards, Modales, Filtros)
│   ├── context/               # AuthContext y ToastContext
│   ├── data/seedData.js       # Repositorio de datos iniciales sembrados
│   ├── entries/               # Puntos de entrada Vite (web, student, directive, admin)
│   ├── pages/                 # Páginas organizadas por módulo (public, student, directive, admin)
│   ├── services/              # Servicio de almacenamiento y lógica de negocio reactiva
│   └── styles/                # CSS, tokens y temas
├── student/                   # Módulo del portal de estudiantes
│   ├── controllers.js         # Lógica de mis clubes, mis actividades y perfil
│   └── routes.js              # Rutas de estudiante (/estudiante/*)
├── views/                     # Vistas y plantillas EJS
│   ├── admin/                 # Vistas del módulo admin
│   ├── directive/             # Vistas del módulo de directiva
│   ├── layouts/               # Layouts base (default, student, directive, admin)
│   ├── student/               # Vistas del módulo de estudiante
│   └── website/               # Vistas del sitio público
├── website/                   # Módulo del sitio web público
│   ├── apis.js                # API REST para el sitio público (/api/*)
│   ├── controllers.js         # Controladores de páginas públicas
│   ├── models.js              # Modelos de datos del dominio
│   ├── repositories.js        # Repositorios de acceso a datos
│   ├── routes.js              # Enrutador principal de la web (/ y /api/*)
│   └── services.js            # Capa de servicios
├── package.json               # Dependencias y scripts de ejecución
├── server.js                  # Punto de entrada principal del servidor Express
├── vercel.json                # Configuración de despliegue en Vercel
└── vite.config.js             # Configuración de empaquetado multi-entry de Vite
```

---

## 🎯 Historias de Usuario Implementadas (HU-1 a HU-7)

| HU | Módulo / Historia | Descripción y Funcionalidades Clave |
|---|---|---|
| **HU-1** | **Directorio y Ficha de Club** | Búsqueda por nombre y palabras clave, filtrado por categorías (Académico, Deportes, Arte y Cultura, Tecnología, etc.), etiquetas y modalidad. Ficha completa del club con banner, directiva, requisitos, redes sociales y cartelera de actividades programadas. |
| **HU-2** | **Solicitud de Membresía e Inscripción** | Modal de postulación para estudiantes autenticados, registro de motivación y carrera, validación automática de cupos disponibles y estado de solicitud en tiempo real (*Pendiente*, *Aprobada*, *Rechazada*). |
| **HU-3** | **Cartelera y Registro a Actividades** | Cartelera pública con filtrado por fecha, club organizador y modalidad (Presencial/Virtual). Detalle del evento con ubicación, ponentes, cupos restantes e inscripción con un solo clic. |
| **HU-4** | **Gestión de Miembros por Directiva** | Bandeja de postulaciones del club con acciones para aprobar o rechazar postulantes. Directorio de miembros activos del club con asignación de roles directivos y visualización de datos de contacto. |
| **HU-5** | **Gestión de Actividades y Asistencia** | Creación y edición de eventos del club con validación de fechas y aforo. Módulo de control de asistencia de participantes registrados con actualización en tiempo real y descarga de lista. |
| **HU-6** | **Portal del Estudiante** | Panel personal del alumno que muestra los clubes a los que pertenece, el estado de sus postulaciones pendientes, las actividades en las que está inscrito y la edición de sus datos de perfil. |
| **HU-7** | **Panel de Administración General** | Auditoría y control de todos los clubes del sistema, bandeja de aprobación de solicitudes de creación de nuevos clubes, directorio y auditoría de usuarios, y panel de métricas y estadísticas clave. |

---

## 👥 Credenciales Demo para Pruebas

Para facilitar la evaluación de los distintos roles y permisos de la plataforma, se incluyen las siguientes cuentas de prueba:

| Rol | Correo Electrónico | Contraseña | Acceso Directo |
|---|---|---|---|
| **Visitante / Público** | *(Sin credenciales requeridas)* | — | `http://localhost:3000/` |
| **Estudiante** | `estudiante@ulima.edu.pe` | `password123` | `http://localhost:3000/estudiante/clubes` |
| **Directiva de Club** | `directiva@ulima.edu.pe` | `password123` | `http://localhost:3000/directiva/solicitudes` |
| **Administrador** | `admin@ulima.edu.pe` | `password123` | `http://localhost:3000/admin/dashboard` |

> 💡 **Selector de Rol Rápido:** En la barra superior de la aplicación se encuentra disponible un selector de roles para alternar instantáneamente entre perfiles durante la revisión y evaluación.

---

## 🛠️ Instalación y Puesta en Marcha

### Prerrequisitos
- **Node.js** (versión 18 o superior recomendada)
- **npm** (versión 9 o superior)

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone https://github.com/Rasxtt/PrograWeb.git
cd PrograWeb
npm install
```

### 2. Compilar los paquetes de frontend (Vite)
Compila los 4 puntos de entrada (`web.js`, `student.js`, `directive.js`, `admin.js`) y las hojas de estilo:
```bash
npm run build
```

### 3. Iniciar el servidor
```bash
npm start
```
El servidor se iniciará en `http://localhost:3000`.

### 4. Modo de desarrollo (Hot Reload)
Para trabajar con recarga automática y compilación reactiva con Chokidar y Nodemon:
```bash
npm run dev
```

---

## 🌐 Rutas Principales del Sistema

### Rutas Públicas
- `/` - Página de inicio / Hero de Vida Universitaria
- `/clubes` - Directorio y búsqueda de clubes estudiantiles
- `/clubes/:id` - Ficha informativa detallada del club
- `/actividades` - Cartelera general de eventos y actividades
- `/actividades/:id` - Detalle e inscripción a una actividad
- `/registro-club` - Formulario de solicitud de creación de un nuevo club
- `/login` - Inicio de sesión
- `/registro` - Registro de nuevos estudiantes

### Rutas de Estudiante (`/estudiante/*`)
- `/estudiante/clubes` - Mis clubes y solicitudes de membresía
- `/estudiante/actividades` - Mis inscripciones a eventos y talleres
- `/estudiante/perfil` - Mi perfil de estudiante

### Rutas de Directiva (`/directiva/*`)
- `/directiva/solicitudes` - Bandeja de solicitudes de postulación al club
- `/directiva/miembros` - Lista y gestión de miembros activos del club
- `/directiva/actividades` - Creación y administración de actividades del club
- `/directiva/asistencia` - Registro y control de asistencia a eventos

### Rutas de Administración (`/admin/*`)
- `/admin/dashboard` - Métricas generales y resumen del sistema
- `/admin/clubes` - Auditoría y estado de clubes y nuevas solicitudes
- `/admin/usuarios` - Directorio de usuarios y gestión de roles
- `/admin/reportes` - Reportes y analíticas del campus
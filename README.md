# Coinex App

Coinex App es una aplicación web para consultar información de criptomonedas, interactuar con APIs de trading y gestionar activos digitales de manera práctica.

Este README explica cómo instalar, configurar y entender la estructura completa del proyecto.

---

## 🗂 Estructura del proyecto

```
coinex_app/
│
├─ backend/                # Código del servidor
│   ├─ chat/               # Servicios de chat (IA)
│   │   └─ OllamaChatService.js
│   ├─ factories/          # Factories para crear instancias de repositories y fetchers
│   │   ├─ AnalisisRepositoryFactory.js
│   │   ├─ CryptoFetcherFactory.js
│   │   ├─ PortafolioRepositoryFactory.js
│   │   └─ UsuarioRepositoryFactory.js
│   ├─ fetchers/           # Fetchers para datos de criptomonedas
│   │   ├─ CoinGeckoHistoryFetcher.js
│   │   ├─ CoinMarketCapFetcher.js
│   │   ├─ CryptoFetcher.js
│   │   ├─ CryptoFetcherFactory.js
│   │   └─ MockCryptoFetcher.js
│   ├─ repositories/       # Lógica de acceso a datos
│   │   ├─ AnalisisRepository.js
│   │   ├─ PortafolioRepository.js
│   │   ├─ TransaccionRepository.js
│   │   └─ UsuarioRepository.js
│   ├─ middlewares/        # Middlewares de Express
│   │   └─ authMiddleware.js
│   ├─ routes/             # Rutas del servidor
│   ├─ db.js               # Configuración de la base de datos
│   └─ index.js            # Punto de entrada del servidor
│
├─ bd/                     # Scripts y configuraciones de la base de datos
│   ├─ migrations/         # Migraciones de tablas
│   └─ models/             # Modelos de datos
│
├─ frontend/               # Archivos del cliente web
│   ├─ html/               # Vistas HTML
│   ├─ gulp+scss+hbs/      # Automatización, estilos SCSS y plantillas Handlebars
│   └─ js/                 # Scripts de frontend
│
├─ doc/                    # Documentación del proyecto (diagramas, guías)
├─ package.json            # Dependencias y scripts del proyecto
└─ package-lock.json       # Bloqueo de versiones

```

---

## ⚡ Backend

El backend está construido con Node.js y Express, y organiza la lógica de manera modular.

### Archivos principales

- **index.js**: Inicia el servidor, configura middlewares y registra las rutas.  
- **routes/**: Define los endpoints de la API. Ejemplo: `GET /api/crypto/:symbol` para obtener información de una criptomoneda.  
- **controllers/**: Contiene la lógica para procesar las solicitudes antes de responder.  
- **fetchers/**: Implementa el **Patrón Factory Method**, permitiendo crear distintos "fetchers" para obtener datos de distintas fuentes (CoinGecko, Coinex, etc.).  

Ejemplo de uso:

```js
const fetcher = CryptoFetcherFactory.create("history");
const data = await fetcher.fetch("BTC");
```

- **bd/models/**: Modelos de base de datos para interactuar con PostgreSQL o MySQL.  
- **bd/migrations/**: Scripts para crear tablas y relaciones.

---

## 🌐 Frontend

El frontend combina **HTML, SCSS y Handlebars**, con tareas automatizadas mediante **Gulp**.

### Archivos principales

- **html/**: Contiene las vistas principales de la aplicación.  
- **gulp+scss+hbs/**:  
  - SCSS: Estilos del proyecto.  
  - Gulp: Automatiza compilación de SCSS a CSS, minificación y recarga del navegador.  
  - Handlebars (HBS): Plantillas dinámicas para generar contenido HTML desde el servidor.  
- **js/**: Scripts de interacción en el navegador (fetch a la API, manipulación del DOM).

---

## 🚀 Instalación y Ejecución

### Requisitos

- Node.js 14+  
- npm  
- Base de datos (PostgreSQL o MySQL)

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/Rashek17/coinex_app.git
cd coinex_app
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar variables de entorno

Crea un archivo `.env` en la raíz:

```env
COINEX_API_KEY=tu_api_key_aqui
COINEX_API_SECRET=tu_api_secret_aqui
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=coinex_db
```

### Paso 4: Inicializar base de datos

Si usas migrations con Sequelize:

```bash
npx sequelize-cli db:migrate
```

### Paso 5: Ejecutar el backend

```bash
npm run start
```

Servidor activo en `http://localhost:4000`.

### Paso 6: Ejecutar el frontend

Si tu frontend depende de Gulp:

```bash
npx gulp
```

Esto compila SCSS a CSS, genera plantillas y recarga el navegador.

---

## 🧪 Uso de la API

Obtener historial de criptomonedas:

```
GET /api/crypto/:symbol
```

Ejemplo:

```
GET http://localhost:4000/api/crypto/BTC
```

Respuesta:

```json
{
  "symbol": "BTC",
  "price": 50000,
  "volume": 123456
}
```

---

## 📌 Consejos

- Evita cambiar archivos en `node_modules`; solo interactúa con `backend/` y `frontend/`.  
- Haz commits frecuentes para no perder cambios.  
- Usa el patrón Factory Method para agregar nuevos fetchers sin tocar la lógica existente.

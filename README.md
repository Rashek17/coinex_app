# COINEX App

Aplicación de gestión de criptomonedas con frontend y backend separados.

El backend se encuentra en la carpeta `backend` y requiere **Node.js** para ejecutarse.  
El frontend utiliza archivos HTML, CSS y JS, y se encuentra en la carpeta `dashboard/auth`.

---

## Instrucciones para ejecutar

1. **Backend**  
   - Abrir una terminal en la carpeta `backend`.  
   - Instalar dependencias:  
     ```bash
     npm install
     ```  
   - Ejecutar el servidor:  
     ```bash
     node index.js
     ```  
   - El servidor estará corriendo en `http://localhost:4000` (o el puerto configurado).

2. **Frontend**  
   - Abrir una terminal en la carpeta raíz del frontend.  
   - Instalar dependencias (si aplica):  
     ```bash
     npm install
     ```  
   - Abrir el archivo `sign-in.html` con **Live Server**:  
     - Asegúrate de tener instalada la extensión **Live Server** en tu editor (por ejemplo, VSCode).  
     - Click derecho sobre `sign-in.html` → **Open with Live Server**.

---

## Notas importantes

- Primero asegúrate de que el **backend esté corriendo** antes de abrir el frontend, para que las peticiones a la API funcionen correctamente.  
- Configura las rutas de la API en los archivos JS del frontend si cambias el puerto o la dirección del backend.  
- Esta guía asume que estás trabajando en un entorno local con Node.js instalado.


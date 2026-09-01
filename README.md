# 🌿 Mi Clóset Sostenible — Venta de Clóset / Venta de Garage SPA

Una hermosa aplicación web de una sola página (SPA) construida con **React**, **Vite** y **Tailwind CSS v4** diseñada específicamente para vender ropa personal (Closet Sale / Venta de Garaje). No requiere base de datos ni panel de administración complejo; es estática, responsiva, moderna y lista para desplegarse gratis en **Vercel** o cualquier hosting estático.

---

## ✨ Características de la Aplicación

- **Paleta de Colores de Estilo Tierra**: Diseño refinado en verdes bosque y beiges cálidos, brindando una atmósfera orgánica y sostenible.
- **Barra de Filtros Combinados (AND)**: Filtra dinámicamente por talla, color, marca y categoría.
- **Buscador Integrado**: Caja de texto para buscar por nombre, marca, descripción o palabras clave de forma instantánea.
- **Control "Ocultar Vendidos"**: Activado por defecto para mostrar solo lo disponible, pero con opción de ver lo vendido para generar confianza.
- **Carrusel de Imágenes Individual**: Cada tarjeta cuenta con controles interactivos si posee más de una foto.
- **Botón de Compra por WhatsApp**: Al hacer clic en una prenda, se abre un modal detallado y un botón de contacto que autogenera un mensaje personalizado para el vendedor con los datos exactos del artículo (nombre, marca, talla, precio).
- **Ficha Técnica & Instrucciones de Compra**: Sección superior informativa para guiar al comprador sin fricciones.
- **Totalmente Responsivo**: Optimizada con especial mimo para celulares, que es desde donde entrarán el 90% de tus clientes.

---

## 🛠️ Cómo Configurar la Venta (Edición Manual)

### 1. Cambiar tus Datos de Contacto (Vendedor)
Abre el archivo [`src/App.jsx`](src/App.jsx) y edita estas dos constantes que están en la parte superior (líneas 20-21 aproximadamente):

```javascript
const WHATSAPP_NUMBER = "34600000000"; // Tu número con código de país (sin '+' ni espacios)
const SELLER_NAME = "Giov";           // Tu nombre
```

---

### 2. Gestionar las Prendas (Tu Fuente de Verdad)
El archivo [`src/data/items.js`](src/data/items.js) es la única base de datos del sistema. Cada prenda es un objeto con la siguiente estructura:

```javascript
{
  id: 1,
  nombre: "Abrigo de Lana Cruzado",
  marca: "Massimo Dutti",
  talla: "M",
  color: "Beige",
  categoria: "Abrigos",
  precio: 85,
  descripcion: "Abrigo cruzado de lana premium en tono beige arena...",
  vendido: false, // Cambia a true para marcar como vendido
  imagenes: ["abrigo-lana-1.svg", "abrigo-lana-2.svg"] // Nombre del archivo en /public/images/
}
```

#### ➕ ¿Cómo agregar una prenda nueva?
1. Guarda las fotos de la prenda dentro de la carpeta `/public/images/`.
2. Añade un nuevo objeto al arreglo en [`src/data/items.js`](src/data/items.js) con un `id` único.
3. ¡Listo! La web cargará y adaptará los filtros automáticamente sin tocar una sola línea de código React.

#### 🏷️ ¿Cómo marcar como vendida una prenda?
1. Ve al objeto correspondiente en [`src/data/items.js`](src/data/items.js).
2. Cambia `"vendido": false` por `"vendido": true`.
3. Al guardar, la prenda mostrará una etiqueta estilizada de **"VENDIDO"** y la imagen se renderizará con filtro de escala de grises y opacidad reducida.

---

## 🚀 Despliegue en Vercel (100% Gratis y en 1 Minuto)

Dado que la aplicación es totalmente estática, no tiene bases de datos activas ni backend, por lo que su alojamiento en Vercel es extremadamente rápido y libre de costos:

1. Sube este proyecto a tu cuenta de **GitHub**, **GitLab** o **Bitbucket**.
2. Entra a [Vercel](https://vercel.com/) e inicia sesión.
3. Haz clic en **"Add New"** > **"Project"**.
4. Selecciona tu repositorio y haz clic en **"Import"**.
5. Vercel detectará automáticamente que es un proyecto de **Vite**. No necesitas configurar variables de entorno (`env vars`) ni configuraciones adicionales.
6. Haz clic en **"Deploy"** y ¡felicidades! Tu venta de clóset estará en línea y lista para compartir.

---

## 💻 Desarrollo Local

Para correr el proyecto en tu computadora y probar tus cambios localmente:

1. Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre [http://localhost:5173](http://localhost:5173) en tu navegador para ver los cambios en tiempo real.

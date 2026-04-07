# 🍽️ El Maná - Restaurante Premium

Página web profesional y elegante para el restaurante El Maná, ubicado en Ferreñafe, Perú. Diseñada con una apariencia de restaurante 5 estrellas, enfocada en atraer clientes y facilitar pedidos rápidos mediante WhatsApp.

## 🌟 Características Principales

### 🎨 Diseño Premium
- **Estilo elegante y moderno**: Inspirado en restaurantes de lujo
- **Paleta de colores profesional**: Negro, blanco, dorado y tonos cálidos
- **Tipografía moderna**: Google Fonts (Poppins)
- **Animaciones suaves**: Efectos hover, transiciones y animaciones al scroll
- **Diseño responsive**: Optimizado para todos los dispositivos (mobile-first)

### 📋 Sistema de Menú Inteligente
- **Menú semanal**: Cambia automáticamente según el día de la semana
- **Detección automática**: Resalta el menú del día actual
- **Fácil edición**: Archivo `menu.json` simple y editable
- **Manejo de errores**: Muestra mensajes amigables si no hay menú disponible

### 📱 Pedidos por WhatsApp
- **Pedidos rápidos**: Sistema optimizado para pedidos de un solo plato
- **Mensaje automático**: Formato profesional con toda la información del plato
- **Integración directa**: Redirección automática a WhatsApp
- **Incluye imagen**: El mensaje contiene la URL de la imagen del plato

### 🗺️ Ubicación y Contacto
- **Mapa interactivo**: Google Maps integrado con ubicación real
- **Información completa**: Horarios, dirección y métodos de contacto
- **Botones de acción**: Llamadas a la acción claras y visibles

## 📁 Estructura del Proyecto

```
ElMana/
├── index.html          # Página principal
├── styles.css          # Estilos CSS premium
├── script.js           # Lógica JavaScript inteligente
├── menu.json           # Archivo de menú editable
├── README.md           # Documentación
└── favicon.ico         # Icono del sitio (opcional)
```

## 🚀 Configuración Rápida

### 1. Personalizar Información del Restaurante

Edita los siguientes archivos:

#### `index.html`
- **Número de WhatsApp**: Reemplaza `519XXXXXXXX` con tu número real
- **Meta tags**: Actualiza el título y descripción
- **Contenido**: Modifica textos según necesites

#### `script.js`
- **Línea 3**: Actualiza el número de WhatsApp:
```javascript
const WHATSAPP_NUMBER = '519XXXXXXXX'; // Reemplazar con número real
```

### 2. Configurar el Menú

Edita `menu.json` con tu información:

```json
{
  "lunes": [
    {
      "nombre": "Nombre del Plato",
      "descripcion": "Descripción breve y atractiva",
      "precio": "25.00",
      "imagen": "URL de la imagen del plato"
    }
  ]
}
```

**Estructura por día:**
- `lunes`, `martes`, `miercoles`, `jueves`, `viernes`, `sabado`, `domingo`
- Cada día puede tener múltiples platos
- Si un día no tiene platos, mostrará "Menú no disponible hoy"

### 3. Imágenes

#### Opción A: Usar GitHub Pages (Recomendado)
1. Crea un repositorio en GitHub
2. Sube las imágenes a una carpeta `images/`
3. Usa URLs como: `https://username.github.io/repo/images/plato.jpg`

#### Opción B: Usar servicio externo
- Imgur, Cloudinary, o cualquier servicio de hosting de imágenes
- Asegúrate de que las URLs sean públicas y accesibles

### 4. **Control de Versiones**

#### Actualización Automática de Versión
El sistema incluye control de versiones automático:

```powershell
# Actualizar versión con descripción
.\update-version.ps1 "Nueva funcionalidad de promociones"

# O con descripción por defecto
.\update-version.ps1
```

#### Estructura de Versiones
- **Formato:** `vX.Y.Z (YYYY-MM-DD)`
- **Incremento automático:** Patch (Z) aumenta con cada actualización
- **Registro:** Fecha y descripción del cambio
- **Visual:** Versión mostrada en footer del sitio

#### Archivos de Versión
- **`config.json`**: Contiene información de versión
- **`update-version.ps1`**: Script PowerShell para Windows
- **`update-version.sh`**: Script Bash para Linux/Mac

#### Flujo de Trabajo
1. Realizar cambios en el código
2. Ejecutar script de versión: `.\update-version.ps1 "descripción"`
3. Revisar cambios en config.json
4. Hacer commit: `git add . && git commit -m "vX.Y.Z: descripción"`
5. Push: `git push`

### 5. **Despliegue** en GitHub Pages

### Método 1: Interfaz Web

1. **Crear Repositorio**
   - Ve a GitHub y crea un nuevo repositorio llamado `ElMana`

2. **Activar GitHub Pages**
   - Ve a Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` y `/ (root)`
   - Haz clic en Save

3. **Acceder al Sitio**
   - Tu sitio estará disponible en: `https://username.github.io/ElMana/`

### Método 2: GitHub CLI

```bash
# Clonar el repositorio
git clone https://github.com/username/ElMana.git
cd ElMana

# Añadir archivos
git add .
git commit -m "Inicializar sitio web de El Maná"
git push origin main

# Activar GitHub Pages
gh pages create
```

### Método 3: Subir por FTP

Si tienes hosting propio:
1. Sube todos los archivos a la carpeta principal (`public_html` o similar)
2. Asegúrate de que `index.html` sea el archivo por defecto

## ⚙️ Personalización Avanzada

### Colores y Estilos

Edita `styles.css` para personalizar:

```css
:root {
    --color-primary: #000000;      /* Fondo principal */
    --color-secondary: #FFFFFF;    /* Texto */
    --color-accent: #D4AF37;       /* Dorado */
    --color-warm: #D2691E;         /* Naranja oscuro */
}
```

### Animaciones

Las animaciones están en `styles.css`:
- `.hero-content`: Animación de entrada
- `.menu-card`: Efectos hover
- `@keyframes fadeInUp`: Animación de aparición

### JavaScript Personalizado

Funciones principales en `script.js`:
- `getCurrentDay()`: Detecta el día actual
- `showDayMenu()`: Muestra menú del día
- `orderDish()`: Genera mensaje de WhatsApp

## 📱 Optimización Móvil

El sitio está optimizado para:
- **Smartphones**: Diseño mobile-first
- **Tablets**: Layout adaptativo
- **Desktop**: Experiencia completa

### Puntos Clave:
- Menú hamburguesa para navegación móvil
- Botones grandes y fáciles de tocar
- Textos legibles en pantallas pequeñas
- Imágenes optimizadas para carga rápida

## 🔧 Mantenimiento

### Actualizar el Menú

1. Abre `menu.json`
2. Modifica los platos según necesites
3. Sube el archivo actualizado a tu hosting
4. Los cambios se reflejarán inmediatamente

### Agregar Promociones

Edita la sección de promociones en `index.html`:

```html
<div class="promotion-card">
    <div class="promotion-image">
        <img src="URL imagen" alt="Nombre promoción">
    </div>
    <div class="promotion-content">
        <h3>Nombre de la Promoción</h3>
        <p>Descripción</p>
        <div class="promotion-price">
            <span class="current-price">S/. XX.XX</span>
        </div>
        <a href="URL WhatsApp" class="btn btn-primary">Pedir Ahora</a>
    </div>
</div>
```

## 📊 SEO y Meta Tags

El sitio incluye optimización SEO básica:

### Meta Tags en `index.html`
```html
<meta name="description" content="Restaurante El Maná en Ferreñafe, Perú">
<meta name="keywords" content="restaurante, Ferreñafe, comida peruana">
<meta property="og:title" content="El Maná - Restaurante Premium">
<meta property="og:description" content="Experiencia gastronómica premium">
```

### Sugerencias Adicionales
1. **Google Analytics**: Añade tu código de seguimiento
2. **Google My Business**: Registra tu restaurante
3. **Redes Sociales**: Enlaza tus perfiles sociales
4. **Testimonios**: Agrega reseñas de clientes

## 🐛 Solución de Problemas

### Problemas Comunes

#### Menú no carga
- Verifica que `menu.json` esté en la misma carpeta
- Revisa la sintaxis JSON (usa validador online)
- Asegúrate de que las URLs de las imágenes funcionen

#### WhatsApp no funciona
- Verifica el número de teléfono en `script.js`
- Formato correcto: `51` (código Perú) + número sin 9
- Ejemplo: `51912345678`

#### Mapa no muestra ubicación correcta
- Actualiza las coordenadas en el iframe de Google Maps
- Ve a Google Maps → Compartir → Insertar mapa
- Copia el nuevo código iframe

#### Imágenes no cargan
- Verifica que las URLs sean públicas
- Usa HTTPS en todas las URLs
- Comprueba que las imágenes no sean muy pesadas

### Debug Mode

El sitio incluye funciones de debug:

```javascript
// En la consola del navegador
window.ElMana.reloadMenu();     // Recargar menú
window.ElMana.getCurrentDay(); // Ver día actual
window.ElMana.menuData();      // Ver datos del menú
```

## 📞 Soporte

Si necesitas ayuda adicional:

1. **Revisa este README**: La mayoría de problemas están documentados
2. **Consola del navegador**: Revisa errores en F12 → Console
3. **Validador HTML**: Usa W3C Validator para verificar HTML
4. **Validador CSS**: Usa W3C CSS Validator para estilos

## 📄 Licencia

Este proyecto es de uso libre para el restaurante El Maná. 

---

**Desarrollado con ❤️ para El Maná - Ferreñafe, Perú**

*Última actualización: 2026*

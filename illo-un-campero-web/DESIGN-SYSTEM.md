# Design System — Un Campero Web
## Basado en análisis del frontend real · Inspirado en McDonald's, Burger King, Five Guys

---

## 1. Identidad Visual & Atmósfera

Un Campero opera con una identidad **bold y enérgica** propia de las grandes cadenas de fast food. El naranja (`#F39200`) es el alma de la marca — aparece en CTAs, estados activos, acentos del footer, y como color de foco en inputs. El negro profundo (`#0d1117`) actúa como contrapeso: footer, botón de carrito, cabecera del móvil. Juntos forman una pareja de alto contraste muy reconocible (piensa en Burger King con su naranja/negro).

El verde (`#008445`) existe en los tokens pero no se usa activamente en la UI actual — es una oportunidad sin explotar para el sistema de feedback positivo (confirmaciones, pedidos exitosos).

La tipografía es **Poppins** en todo el sistema: un geométrico sans-serif humanista que equilibra amabilidad y modernidad. Es la misma elección que muchas apps de food delivery actuales (funciona, pero tiene margen de diferenciación).

Las superficies son blancas y claras (`#ffffff`, `#f9f9f9`, `#fcfcfc`), con el naranja haciendo todo el trabajo de jerarquía visual.

**Características clave del sistema actual:**
- Naranja corporativo (`#F39200`) como color de acción universal
- Negro puro (`#0d1117`) para superficies "premium" (footer, carrito, header móvil)
- Blanco puro / gris muy claro como canvas — sin temperatura
- Botones siempre en border-radius `50px` (pill) en el header; `8–15px` en el interior
- Sombras suaves y multicapa (`0 4px 12px rgba(0,0,0,0.08)`)
- Animaciones de entrada en header (`slideDownFade`) y modales (`slideUpShort`)
- Backdrop-filter blur en header (efecto glassmorphism moderno)
- Dark mode implementado via `[data-theme="dark"]`

---

## 2. Paleta de Colores y Roles

### Primarios de Marca

| Nombre | Hex | Rol |
|--------|-----|-----|
| **Naranja Illo** | `#F39200` | Color de marca principal. CTAs primarios, estados activos de nav, acentos de footer, foco de inputs, badges de precio, dividers, iconos de usuario |
| **Naranja Oscuro** | `#D88200` / `#E68A00` | Hover del naranja — se oscurece ligeramente en interacción |
| **Naranja Tint** | `rgba(243,146,0,0.08)` | Hover de nav links sin active state |
| **Naranja Ultra-light** | `rgba(243,146,0,0.1)` | Fondo del badge de precio en modal de producto |
| **Negro Profundo** | `#0d1117` | Footer, botón carrito, cabecera del drawer móvil, botón "Iniciar sesión" en header login |
| **Verde Illo** | `#008445` | Token definido, disponible para confirmaciones, estados success, pedido exitoso |

### Superficies y Canvas

| Nombre | Hex | Rol |
|--------|-----|-----|
| **Blanco Puro** | `#ffffff` | Canvas principal de página, tarjetas de producto, modales, login box, dropdown |
| **Gris Claro** | `#EAEAEA` | Token disponible para bordes y separadores |
| **Gris Carta** | `#fcfcfc` | Canvas de la página Carta (ligeramente más cálido que el blanco) |
| **Gris Fondo** | `#f4f5f7` | Fondo de la pantalla de login |
| **Gris Card Background** | `#f9f9f9` | Superficies de tarjeta secundarias |
| **Gris Cantidad** | `#f8f8f8` | Fondo del stepper de cantidad en el modal slim |

### Texto

| Nombre | Valor | Uso |
|--------|-------|-----|
| **Texto Primario** | `#1a1a1a` / `#222` | Títulos principales de página, nombres de producto |
| **Texto Secundario** | `#333` / `#444` | Nav links, labels de formulario |
| **Texto Terciario** | `#666` / `#667085` | Descripciones cortas de producto, breadcrumbs |
| **Texto Muted** | `#777` / `#888` | Descripciones en modal, textos de ayuda |
| **Texto Footer** | `#c9d1d9` | Links y texto del footer sobre negro |
| **Texto Footer Muted** | `#8b949e` | Descripción y copyright del footer |
| **Texto Blanco** | `#ffffff` | Texto sobre naranja, sobre negro |

### Semánticos

| Nombre | Hex | Uso |
|--------|-----|-----|
| **Error / Destructivo** | `#e74c3c` | Validaciones, enlace de logout, acciones admin peligrosas |
| **Error Hover** | `#c0392b` | Hover del rojo |
| **Error Tint** | `rgba(231,76,60,0.08)` | Fondo hover de items de admin/logout |
| **Borde Input** | `#ddd` | Borde por defecto de inputs |
| **Borde Separador** | `#f0f0f0` | Divisores en dropdown y footer del drawer móvil |
| **Borde Footer** | `#21262d` | Separadores internos del footer oscuro |

---

## 3. Tipografía

### Familia de Fuentes

```css
font-family: 'Poppins', Arial, sans-serif;
```

Poppins es el único typeface del sistema — geométrico, redondo, moderno. Se usa desde `0.7rem` (labels de sección en móvil) hasta `4rem` (hero de la carta).

### Jerarquía

| Rol | Tamaño | Peso | Uso |
|-----|--------|------|-----|
| Hero / Display | `4rem` / 64px | 800 | H1 del hero de la Carta |
| Título Categoría | `2.5rem` / 40px | 800 | Sección de categoría en la carta, uppercase |
| Título Sección | `1.8rem` / 29px | 800 | Intro de la carta (`carta-intro h2`) |
| Título Subcategoría | `1.5rem` / 24px | — | Subcategoría con acento naranja izquierdo |
| Título Card / Modal | `1.5rem` / 24px | 800 | Nombre de producto en modal slim |
| H1 Login | `1.55rem` / 25px | 700 | Títulos de pantallas de auth |
| Nav Desktop | `0.95rem` / ~15px | 600 | Links de navegación principal |
| Nav User Header | `0.9rem` / ~14px | 700 | Nombre de usuario en la pill |
| Body Primario | `0.95rem` / ~15px | 400 | Texto general de párrafos |
| Body Secundario | `0.875rem` / 14px | 600–700 | Items de dropdown, labels de formulario |
| Pequeño | `0.85rem` / ~14px | 400 | Descripción footer, horarios, textos de apoyo |
| Micro | `0.78–0.82rem` | 600–700 | Labels de botones de idioma, error-text, labels de input |
| Badge / Label | `0.7rem` | 700 | Badge "OFERTA", sección admin en menú móvil |

**Principios:**
- El peso 700–800 hace todo el trabajo de jerarquía — los tamaños escalan moderadamente
- `letter-spacing: 1px` + `text-transform: uppercase` para labels de sección (footer headers, admin labels)
- `line-height: 1.6–1.7` para textos de párrafo descriptivos

---

## 4. Componentes

### Botones

**1. CTA Primario Naranja — "Añadir al pedido", "Iniciar sesión", "Volver a la carta"**
- Background: `#F39200`
- Texto: `#ffffff`
- Border: ninguno
- Radius: `8px` (formularios/interior) / `15px` (modal slim) / `50px` (header)
- Padding: `13px 16px` (full-width) / `16px` (modal CTA)
- Font: Poppins, `0.95rem`, weight 700–800
- Hover: background `#D88200`, `transform: translateY(-1px)`
- Sombra hover: `0 8px 20px rgba(243,146,0,0.2)`
- Disabled: `opacity: 0.6; cursor: not-allowed`

**2. Botón Negro — "Iniciar sesión" (header), "Carrito"**
- Background: `#0d1117`
- Texto: `#ffffff`
- Border: ninguno
- Radius: `50px`
- Padding: `11px 24px`
- Font: Poppins, weight 700
- Hover: `transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.1)`

**3. Botón Blanco Outlined — "Registrarse" (header)**
- Background: `white`
- Texto: `#0d1117`
- Border: `1px solid #eee`
- Radius: `50px`
- Padding: `11px 24px`
- Sombra: `0 2px 10px rgba(0,0,0,0.05)`
- Hover: igual que negro

**4. Nav Link Activo (pill)**
- Background: `#F39200`
- Texto: `white`
- Radius: `50px`
- Padding: `9–10px 20–22px`
- Sombra: `0 4–5px 15px rgba(243,146,0,0.25–0.30)`

**5. Nav Link Inactivo hover**
- Background: `rgba(243,146,0,0.08)`
- Texto: `#F39200`
- Sin borde, misma geometría

**6. Botón Circular de Cantidad (stepper)**
- Width/Height: `30–35px`
- Background: `white`
- Border: `1.5px solid #F39200`
- Color: `#F39200`
- Radius: `50%`
- Hover: `background: #F39200; color: white`

**7. Filtro de Categoría (sticky nav de la Carta)**
- Default: `background: white; border: 1px solid #eee`
- Activo: `background: #F39200; color: white; border-color: #F39200; transform: scale(1.1); box-shadow: 0 5px 15px rgba(243,146,0,0.3)`
- Radius: `50px`, Padding: `8px 20px`

### Tarjetas y Contenedores

**Tarjeta de Producto (lista horizontal)**
- Background: `white`
- Radius: `15px`
- Sombra: `0 4px 12px rgba(0,0,0,0.08)`
- Height fija: `160px`
- Hover: `transform: translateY(-3px)`
- Layout: flex horizontal — info (flex:1) + imagen (110×85px)
- Imagen: `object-fit: contain`, radius `10px`

**Modal de Producto Slim**
- Background: `#ffffff`
- Max-width: `420px`
- Radius: `25px`
- Sombra: `0 20px 50px rgba(0,0,0,0.3)`
- Overlay: `rgba(0,0,0,0.8)` + `backdrop-filter: blur(8px)`
- Animación: `slideUpShort 0.3s ease-out` (translateY 20px → 0)
- Hero de imagen: `220px` altura, `object-fit: contain`, padding `10px`
- Divider de acento: `40px × 4px`, background naranja, radius `10px`, margen `12px 0`
- Badge de precio: `rgba(243,146,0,0.1)` bg, texto `#F39200`, padding `5px 12px`, radius `10px`

**Tarjeta de Carrito**
- Background: `white`
- Radius: `12px`
- Sombra: `0 2px 8px rgba(0,0,0,0.07)`
- Hover: `0 4px 16px rgba(0,0,0,0.10)`
- Imagen: `75×75px`, `object-fit: cover`, radius `8px`

**Login Box**
- Background: `white`
- Radius: `16px`
- Sombra: `0 4px 24px rgba(0,0,0,0.08)`
- Padding: `40px 36px`
- Max-width: `400px`

**Dropdown de Usuario**
- Background: `white`
- Radius: `16px`
- Sombra: `0 12px 35px rgba(0,0,0,0.12)`
- Border: `1px solid rgba(0,0,0,0.05)`
- Padding: `10px`
- Items hover: `background: #fff8f0; color: #F39200`
- Animación: `dropdownIn 0.25s ease-out` (translateY 8px → 0)

### Navegación

**Header Global**
- Height: `85px`
- Position: `sticky top: 0`
- Background: `transparent` con `::before` en `rgba(255,255,255,0.90–0.92)` + `backdrop-filter: blur(12–15px)`
- Sombra: `0 2px 20px rgba(0,0,0,0.06)`
- Border-bottom: `1px solid rgba(0,0,0,0.05)` (header-login)
- Layout desktop: grid `1fr auto 1fr` (izq / centro / dcha)
- Logo: `height: 52px`, hover `scale(1.05)`
- z-index: `2000–5000`

**Menú Móvil (Drawer)**
- Overlay: `rgba(0,0,0,0.45)` sobre toda la pantalla
- Drawer: `min(340px, 88vw)`, fondo blanco, desde la derecha
- Cabecera del drawer: `#0d1117` con avatar naranja y nombre en blanco
- Animación: `slideInRight 0.28s cubic-bezier(0.16,1,0.3,1)`
- Nav items hover: `background: #fff8f0; color: #F39200`
- Botón logout: `background: #0d1117; color: white`

### Inputs y Formularios

**Input de Texto**
- Border: `1px solid #ddd`
- Radius: `8px`
- Padding: `11px 14px`
- Focus: `border-color: #F39200; box-shadow: 0 0 0 3px rgba(243,146,0,0.1)`
- Error: `border-color: #e74c3c`
- Error text: `color: #e74c3c; font-size: 0.78rem`

**Buscador (Carta)**
- Radius: `50px` (pill)
- Padding: `15px 50px 15px 25px`
- Sombra: `0 10px 25px rgba(0,0,0,0.2)`
- Sin border, sin outline

### Hero Sections

**Hero de Carta**
- Imagen de fondo, `height: 300px`, `background-size: cover`
- Overlay: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))`
- H1: `4rem`, weight 800, blanco

**Footer**
- Background: `#0d1117`
- Border-top: `4px solid #F39200` — la línea naranja es la firma visual del footer
- Grid: `1.8fr 1fr 1fr 1fr`
- Column headers: `#F39200`, `0.9rem`, weight 700, uppercase, `letter-spacing: 1px`
- Links: `#c9d1d9` → hover `#F39200` + `padding-left: 4px`
- Social icons hover: `color: #F39200; transform: translateY(-3px)`
- Copyright: `#8b949e`

---

## 5. Elevación y Sombras

| Nivel | Sombra | Uso |
|-------|--------|-----|
| Micro | `0 2px 8px rgba(0,0,0,0.07)` | Tarjetas de carrito |
| Tarjeta | `0 4px 12px rgba(0,0,0,0.08)` | Tarjetas de producto |
| Card Hover | `0 4px 16px rgba(0,0,0,0.10)` | Hover de carrito |
| Header | `0 2px 20px rgba(0,0,0,0.06)` | Navegación global |
| Dropdown | `0 12px 35px rgba(0,0,0,0.12)` | Menú de usuario |
| Modal | `0 20px 50px rgba(0,0,0,0.3)` | Modal de producto |
| Login | `0 4px 24px rgba(0,0,0,0.08)` | Caja de login |
| Foco Input | `0 0 0 3px rgba(243,146,0,0.10)` | Input con foco activo |
| CTA Hover | `0 8px 20px rgba(243,146,0,0.20)` | Botón naranja al hacer hover |
| Nav Active | `0 5px 15px rgba(243,146,0,0.25–0.30)` | Link activo en navegación |

---

## 6. Sistema de Espaciado

Basado en múltiplos de `4px`:

| Token | Valor | Uso típico |
|-------|-------|------------|
| `--space-1` | `4px` | Padding micro (badge) |
| `--space-2` | `8px` | Gap entre elementos inline, padding pequeño |
| `--space-3` | `12px` | Padding de pills, gap de acciones |
| `--space-4` | `16px` | Padding estándar de card, gap de columnas |
| `--space-5` | `20px` | Padding de nav links, gap del nav |
| `--space-6` | `24px` | Padding de botones de header, gap de footer |
| `--space-7` | `30px` | Padding horizontal del header container |
| `--space-8` | `40px` | Padding de login box, gap del footer grid |
| `--space-9` | `60px` | Padding top del footer |

**Ancho máximo de contenedores:**
- Header: `max-width: 1400–1450px`
- Carta / Carrito: `max-width: 1200px`
- Sticky nav carta: `max-width: 800px`
- Login: `max-width: 400px`

---

## 7. Radios de Borde

| Valor | Uso |
|-------|-----|
| `50px` | Todos los botones del header, filtros de categoría, buscador pill |
| `15–16px` | Tarjetas de producto, login box |
| `12–15px` | Tarjetas de carrito, drawer nav items |
| `10px` | Imagen en tarjeta de producto, badge de precio en modal |
| `8px` | Inputs de formulario, botones de interior (login, carrito) |
| `50%` | Avatar de usuario, botones circulares de stepper |

---

## 8. Animaciones y Micro-interacciones

```css
/* Entrada del header */
@keyframes slideDownFade {
  from { opacity: 0; transform: translateY(-15px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Duración: 0.6s cubic-bezier(0.16, 1, 0.3, 1) */

/* Entrada de modal / drawer */
@keyframes slideUpShort {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Duración: 0.3s ease-out */

/* Entrada del dropdown de usuario */
@keyframes dropdownIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Duración: 0.25s ease-out */

/* Entrada del drawer móvil */
@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}
/* Duración: 0.28s cubic-bezier(0.16,1,0.3,1) */

/* Fondo del overlay móvil */
@keyframes fadeInBg {
  from { opacity: 0; }
  to   { opacity: 1; }
}
/* Duración: 0.25s ease */
```

**Reglas generales:**
- Hover de botones: `transform: translateY(-1px a -3px)` + sombra más pronunciada
- Hover de tarjetas: `transform: translateY(-3px)`
- Hover de logo: `transform: scale(1.05)`
- Hamburger activo: las barras rotan a X con `transform` y cambian a naranja
- Transición estándar: `0.2s–0.3s ease` o `all 0.25s`

---

## 9. Breakpoints y Comportamiento Responsivo

| Punto | Ancho | Cambio principal |
|-------|-------|-----------------|
| Desktop grande | > 1100px | Nav completa visible, 3 columnas |
| Tablet/móvil | ≤ 1100px (header-user) | Se oculta nav desktop, aparece hamburger |
| Tablet/móvil | ≤ 1000px (header-login) | Se oculta centro y acciones, hamburger |
| Tablet | ≤ 960px | Footer pasa a 2 columnas |
| Móvil | ≤ 560px | Footer pasa a 1 columna |

---

## 10. Dark Mode

Activado via `[data-theme="dark"]` en el `<body>` o `<html>`:

```css
[data-theme="dark"] {
  --background-color: #121212;
  --text-color: #ffffff;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --text-muted: #888;
  --card-background: #1e1e1e;
  --border-color: #333;
  --border-separator: #2a2a2a;
  --gris-fondo: #181818;
  --gris-carta: #1a1a1a;
}
```

Los tokens de naranja y negro se mantienen igual en dark mode — son colores de marca, no de superficie.

---

## 11. Variables CSS — Referencia rápida

Todas las variables están definidas en `src/styles.css` bajo `:root`.

---

## 12. Do's y Don'ts

### ✅ Do
- Usar `#F39200` como único color de acción — no introducir segundos colores de CTA
- Mantener el `border-radius: 50px` en todos los botones del header y filtros de categoría
- Aplicar `transform: translateY(-2px)` como micro-interacción universal de hover
- Usar `backdrop-filter: blur(12–15px)` en elementos flotantes (header, sticky nav)
- Reservar `#0d1117` negro para superficies de alto contraste (footer, carrito, drawer header)
- Layered shadows suaves (2 capas máximo) — nunca una sola sombra dura
- El borde naranja de `4px` en el top del footer es una firma visual — mantenerlo siempre
- El acento lateral naranja (`border-left: 5px solid #F39200`) en subtítulos de categoría — es un patrón reconocible
- Usar el verde `#008445` para confirmaciones y estados de éxito (pedido completado)
- `letter-spacing: 1px` + `text-transform: uppercase` solo para labels de sección (footer headers, admin labels)

### ❌ Don't
- No cuadrar los botones del header — el `50px` pill es definitorio
- No usar el rojo `#e74c3c` fuera de contextos destructivos / error
- No introducir gradients en fondos de página — el sistema es plano con bloques de color
- No mezclar radios: `25px` es para modales, `15px` para tarjetas, `8px` para inputs
- No usar el naranja como color de texto sobre blanco en tamaños < 14px (contraste insuficiente)
- No añadir más fuentes — Poppins es universal en todo el sistema
- No usar sombras > `0.3 alpha` fuera de modales
- No eliminar el `backdrop-filter` del header — es un elemento de modernidad del diseño
- No usar gradients de color en botones — el naranja plano es la marca

---

## 13. Prompts de Ejemplo para Generar Componentes

1. **Botón CTA principal:** "Crea un botón primario con `background: #F39200`, texto blanco, Poppins weight 700, `border-radius: 8px`, padding `13px 16px`. Hover: `background: #D88200`, `transform: translateY(-1px)`. Sin border."

2. **Tarjeta de producto:** "Tarjeta horizontal en blanco, `border-radius: 15px`, `box-shadow: 0 4px 12px rgba(0,0,0,0.08)`, height fija `160px`. Left: info (nombre `1.1rem/700/#222` + descripción `0.8rem/#666` 2 líneas clamp + precio `1rem/800/#333`). Right: imagen `110×85px object-fit:contain`. Hover: `translateY(-3px)`."

3. **Header:** "Header sticky `85px`, `backdrop-filter: blur(15px)` en `::before` con `rgba(255,255,255,0.92)`. Grid 3 columnas: logo izq / nav center / acciones dcha. Nav links `50px border-radius`, activo `#F39200` con sombra naranja. Botones: negro pill izq + blanco pill dcha. Sombra: `0 2px 20px rgba(0,0,0,0.06)`."

4. **Footer oscuro:** "Footer `#0d1117` con `border-top: 4px solid #F39200`. Grid 4 columnas `1.8fr 1fr 1fr 1fr`. Headers de columna: `#F39200`, uppercase, `letter-spacing: 1px`. Links: `#c9d1d9` → hover `#F39200` con `padding-left: 4px`. Copyright: `#8b949e`. Responsive: 2 cols en tablet, 1 col en móvil."

5. **Modal de producto:** "Modal centrado max `420px`, `border-radius: 25px`, `box-shadow: 0 20px 50px rgba(0,0,0,0.3)`. Overlay `rgba(0,0,0,0.8) + blur(8px)`. Imagen `220px object-fit:contain`. Body: nombre `1.5rem/800`, divider naranja `40×4px radius 10px`, descripción `#777`. Badge precio: `rgba(243,146,0,0.1)` bg, texto `#F39200`. CTA full-width naranja `border-radius: 15px`. Animación: `slideUpShort` 0.3s."

6. **Input de formulario:** "Input con `border: 1px solid #ddd`, `border-radius: 8px`, padding `11px 14px`, Poppins. Focus: `border-color: #F39200; box-shadow: 0 0 0 3px rgba(243,146,0,0.10)`. Error: `border-color: #e74c3c`. Label: Poppins `0.82rem` weight 600, `color: #333`, margin-bottom `6px`."

7. **Filtro de categoría sticky:** "Sticky nav `backdrop-filter: blur(10px) background rgba(255,255,255,0.9)`. Botones pill `50px radius`, default `white border #eee`. Activo: `#F39200 white scale(1.1) box-shadow: 0 5px 15px rgba(243,146,0,0.3)`. Max-width `800px` centrado."

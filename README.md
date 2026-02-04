# 🍔 Illo-UnCampero

> "Illo, ¿nos pedimos un campero?" - La web definitiva para pedir tus camperos malagueños online.

**Illo-UnCampero** es una plataforma Full-Stack diseñada para digitalizar la experiencia de las hamburgueserías de barrio. Desde el clásico campero de jamón y queso hasta el de pollo con extra de alioli, nuestra misión es que nunca te falte un mollete antequerano bien planchado en tu mesa.

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

---

## ✨ Características

*   **🥖 Carta Digital:** Explora todos los camperos (pollo, atún, tortilla...) con fotos reales y precios actualizados.
*   **🎨 ¡A tu gusto!:** Personaliza cada pedido. ¿Sin cebolla? ¿Doble de queso? Tú mandas.
*   **⚡ Pedidos en Tiempo Real:** Gracias a la integración con Firebase, el estado de tu pedido se actualiza al instante.
*   **🔐 Acceso "Illo":** Registro e inicio de sesión rápido con Firebase Authentication.
*   **👨‍🍳 Panel de Comandancia:** Gestión para el restaurante donde reciben los pedidos y gestionan el stock desde el backend en Spring Boot.

---

## 🛠️ Stack Tecnológico

*   **Frontend:** Angular 17+ (con Signals y Tailwind CSS).
*   **Backend:** Spring Boot 3 (Java 17) para la lógica de negocio.
*   **Base de Datos:** Firebase Cloud Firestore (NoSQL en tiempo real).
*   **Seguridad:** Spring Security + Firebase Admin SDK.
*   **Almacenamiento:** Firebase Storage (para las fotos de los molletes).

---

## 🚀 Instalación y Configuración

### 1. Requisitos previos
*   Node.js y npm
*   Java JDK 17
*   Una cuenta en Firebase Console

### 2. Backend (Spring Boot)
1. Navega a la carpeta: `cd backend-illo-uncampero`.
2. Descarga tu clave de cuenta de servicio (`serviceAccountKey.json`) desde Firebase.
3. Guárdala en `src/main/resources/`.
4. Configura el `application.properties`:

```properties
firebase.config.path=classpath:serviceAccountKey.json
firebase.database.url=https://tu-proyecto.firebaseio.com

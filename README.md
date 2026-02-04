🍔 Illo-UnCampero
"Illo, ¿nos pedimos un campero?" - La web definitiva para pedir tus camperos malagueños online.
Illo-UnCampero es una plataforma Full-Stack diseñada para digitalizar la experiencia de las hamburgueserías de barrio. Desde el clásico campero de jamón y queso hasta el de pollo con extra de alioli, nuestra misión es que nunca te falte un mollete antequerano bien planchado en tu mesa.
![alt text](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)

![alt text](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)

![alt text](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
✨ Características
🥖 Carta Digital: Explora todos los camperos (pollo, atún, tortilla...) con fotos reales y precios actualizados.
🎨 ¡A tu gusto!: Personaliza cada pedido. ¿Sin cebolla? ¿Doble de queso? Tú mandas.
⚡ Pedidos en Tiempo Real: Gracias a la integración con Firebase, el estado de tu pedido se actualiza al instante.
🔐 Acceso "Illo": Registro e inicio de sesión rápido con Firebase Authentication.
👨‍🍳 Panel de Comandancia: Gestión para el restaurante donde reciben los pedidos y gestionan el stock desde el backend en Spring Boot.
🛠️ Stack Tecnológico
Frontend: Angular 17+ (con Signals y Tailwind CSS).
Backend: Spring Boot 3 (Java 17) para la lógica de negocio y gestión de pedidos.
Base de Datos: Firebase Cloud Firestore (Base de datos NoSQL en tiempo real).
Seguridad: Spring Security + Firebase Admin SDK.
Almacenamiento: Firebase Storage (para las fotos de los molletes).
🚀 Instalación y Configuración[1][2][3]
1. Requisitos previos
Node.js y npm[4]
Java JDK 17
Una cuenta en Firebase Console
2. Backend (Spring Boot)
Navega a la carpeta: cd backend-illo-uncampero.
Crea tu proyecto en Firebase y descarga la clave de cuenta de servicio (serviceAccountKey.json).
Guárdala en src/main/resources/.
Configura el application.properties:
code
Properties
firebase.config.path=classpath:serviceAccountKey.json
firebase.database.url=https://tu-proyecto.firebaseio.com
Ejecuta: ./mvnw spring-boot:run
3. Frontend (Angular)
Navega a la carpeta: cd frontend-illo-uncampero.
Instala dependencias: npm install.[1][3]
Configura tus credenciales en src/environments/environment.ts:
code
TypeScript
export const environment = {
  firebase: {
    apiKey: "TU_API_KEY",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    // ... rest of config
  }
};
Lanza la app: ng serve y abre http://localhost:4200.
📐 Arquitectura
code
Mermaid
graph TD
    A[Frontend: Angular] -- "Auth & Realtime Data" --> B((Firebase))
    A -- "REST API (Pedidos/Admin)" --> C[Backend: Spring Boot]
    C -- "Admin SDK" --> B
🤝 Contribuciones
¿Quieres añadir el "Campero de la Casa" o mejorar el alioli del código?
Haz un fork del proyecto.
Crea una rama (git checkout -b feature/MejoraAlioli).
Haz commit de tus cambios (git commit -m 'Añadido extra de mayonesa').
Sube la rama (git push origin feature/MejoraAlioli).
Abre un Pull Request.[2]
📄 Licencia
Este proyecto está bajo la Licencia MIT - mira el archivo LICENSE para detalles.
✉️ Contacto
Proyecto creado por [Tu Nombre] - [tu-email@ejemplo.com]
Hecho con ❤️ en Málaga (o donde quiera que te comas un buen campero).

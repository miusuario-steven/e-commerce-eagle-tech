🦅 EagleTech E-Commerce

Este es un proyecto de e-commerce desarrollado como parte de mi formación profesional, es construido con tecnologías modernas y una arquitectura hexagonal, con el objetivo de aplicar buenas prácticas de desarrollo full stack.

📦 Tecnologías utilizadas

🔙 Backend (Java + Spring Boot)
- Java 17
- Spring Boot 3.4.3
- Spring Security + JWT
- PostgreSQL
- MapStruct (mapeo de entidades)
- Lombok (reducción de boilerplate)
- PayPal SDK (integración de pagos)
- Arquitectura Hexagonal
- Maven

🔜 Frontend (Angular)
- Angular 17
- TypeScript
- Tailwind CSS
- Angular Interceptors
- Servicios HTTP
- Componentes Modulares

🧠 Arquitectura

El proyecto sigue una arquitectura **hexagonal**, separando claramente las capas:

- **Dominio:** modelos y puertos
- **Aplicación:** lógica de negocio en servicios
- **Infraestructura:** adaptadores, controladores REST, mappers y persistencia
- **Frontend:** Angular modularizado por componentes

🔐 Funcionalidades destacadas

🛒 Usuario
- Registro y autenticación con JWT
- Visualización de productos
- Carrito de compras
- Realización de pedidos
- Pago con PayPal
- Historial de órdenes

🛠️ Administrador
- CRUD de productos y categorías
- Gestión visual de datos
- Seguridad por roles (USER, ADMIN)


📦 Descripción del proyecto desarrollado

 Se desarrolló un **sistema E-commerce**  con **funcionalidades** tales como:

- Registro y autenticación de usuarios con distintos roles (`ADMIN` y `USER`).
- Visualización de productos por parte de los usuarios.
- Gestión de productos y categorías desde el panel de administrador.
- Carrito de compras y proceso de checkout básico.
- Integración de pasarela de pago con PayPal.
- Seguridad basada en JWT (JSON Web Tokens).
- Comunicación del cliente Angular con servicios REST de Spring Boot.
- Arquitectura Hexagonal aplicada al diseño del backend.

📋 Requerimientos funcionales

1. Permitir a usuarios registrarse y autenticarse.
2. Visualizar productos disponibles.
3. Agregar productos al carrito.
4. Administrar productos y categorías (rol `ADMIN`).
5. Realizar pagos a través de PayPal.
6. Acceso diferenciado según rol de usuario.
7. Interfaz amigable y adaptable con Angular.

🚫 Requerimientos no funcionales

1. Seguridad:
    - Cifrado de contraseñas con `BCrypt`.
    - Validación de roles con Spring Security.
    - Tokens JWT para autenticación.
2. Rendimiento:
    - Peticiones asincrónicas desde Angular.
    - Carga rápida de vistas usando Angular standalone components.
3. Mantenibilidad:
    - Separación de capas (hexagonal).
    - DTOs para comunicación entre frontend y backend.
4. Escalabilidad:
    - Arquitectura RESTful lista para escalar.
    - Separación clara entre lógica de negocio, infraestructura y presentación.

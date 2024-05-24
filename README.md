# 🏋️‍♂️ Gimnasio Fiori - Central de Turnos

¡Bienvenidos a Gimnasio Fiori! Esta es una aplicación desarrollada con el stack MERN (MongoDB, Express, React, Node.js) para gestionar los turnos de un gimnasio. La aplicación cuenta con diferentes roles de usuario: clientes, administradores y empleados, cada uno con su propio conjunto de funcionalidades.

## 🚀 Despliegue Provisorio

Puedes visitar la versión en línea de nuestra aplicación [aquí](https://gimnasio-fiori.vercel.app/) 🌐.

## 🌟 Funcionalidades

### 👥 Clientes

- **Perfil**: Vista y edición del perfil del cliente.
- **Clases Disponibles**: Visualización de todas las clases disponibles en el gimnasio.
- **Clases Anotadas**: Listado de las clases en las que el cliente se ha inscrito.

### 🧑‍🏫 Empleados

- **Alumnos en Clases**: Vista de los alumnos inscritos en las clases que dicta el empleado.
- **Clases que Dicta**: Listado de las clases que el empleado está dictando.

### 👨‍💼 Administradores

- **Usuarios**: Gestión de todos los usuarios del sistema.
- **Clases**: Gestión de todas las clases del gimnasio.
- **Alumnos en Clases**: Vista detallada de los alumnos inscritos en cada clase.
- **Listado de Empleados**: Gestión de todos los empleados del gimnasio.

### 🔔 Notificaciones

El sistema incluye notificaciones que se envían en los siguientes eventos:

- ✅ Confirmación de inscripción a una clase.
- 👩‍💼 Confirmación de un empleado.
- ❌ Eliminación de una clase.
- 🗑️ Eliminación de un usuario.

## 🛠 Tecnologías Utilizadas

Para la construcción de esta aplicación hemos utilizado las siguientes tecnologías:

- **MongoDB**: Base de datos NoSQL 🗄️.
- **Express**: Framework de Node.js para construir el backend ⚙️.
- **React**: Biblioteca de JavaScript para construir la interfaz de usuario 🖥️.
- **Node.js**: Entorno de ejecución para JavaScript en el servidor 🌐.
- **Vercel**: Para el despliegue y hosting de la aplicación 🚀.

## 📬 Contacto

Si tienes alguna pregunta o deseas saber más sobre nuestros servicios, no dudes en contactarnos a través de nuestro formulario en la sección de contacto de la página web 📧.

## 🤝 Contribuciones

¡Estamos abiertos a contribuciones! Si deseas colaborar con nuestro proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio 🍴.
2. Crea una rama nueva (`git checkout -b feature/nueva-funcionalidad`) 🌿.
3. Realiza los cambios necesarios y haz commit (`git commit -m 'Agrega nueva funcionalidad'`) ✍️.
4. Sube los cambios a tu repositorio (`git push origin feature/nueva-funcionalidad`) 🚀.
5. Abre un Pull Request en nuestro repositorio 🔄.

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles 📄.

## 📂 Estructura del Repositorio

```plaintext
/
├── backend/
│   ├── controllers/    # Controladores de la aplicación
│   ├── models/         # Modelos de datos (Mongoose)
│   ├── routes/         # Definición de las rutas API
│   ├── server.js       # Configuración del servidor
├── frontend/
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   ├── pages/      # Páginas principales
│   │   ├── App.js      # Componente principal
│   │   ├── index.js    # Punto de entrada
│   ├── public/
│   │   ├── index.html  # Plantilla HTML
│   │   ├── ...         # Otros archivos públicos
├── .env                # Variables de entorno
├── package.json        # Dependencias y scripts
└── README.md           # Este archivo


¡Gracias por visitar Gimnasio Fiori! 🏋️‍♀️✨
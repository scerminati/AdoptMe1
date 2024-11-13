# AdoptMe - Mock de Datos

Este proyecto es la programación del backend para la aplicación de adopción de mascotas "AdoptMe". Fue realizado como parte del curso **Programación Backend III: Testing y Escalabilidad Backend** de **CODERHOUSE**, comisión 70070, con el profesor Omar Jesús Maniás. La aplicación original ha sido ampliada para incluir funcionalidad de generación de datos ficticios de mascotas y usuarios, facilitando el desarrollo y las pruebas de la plataforma.

Se puede encontrar el código original en [este repositorio](https://github.com/CoderContenidos/RecursosBackend-Adoptme) y el código actualizado en el nuevo repositorio: [AdoptMe1](https://github.com/scerminati/AdoptMe1).

## Tabla de Contenidos

1. [Descripción](#descripción)
2. [Instalación](#instalación)
3. [Uso](#uso)
4. [Rutas](#rutas)
5. [Controladores](#controladores)
6. [Funcionalidad de `utils`](#funcionalidad-de-utils)
7. [Estructura del Proyecto](#estructura-del-proyecto)
8. [Recursos Utilizados](#recursos-utilizados)
9. [Pruebas de la API](#pruebas-de-la-api)

## Descripción

Este proyecto permite generar datos de prueba para la aplicación de adopción de mascotas utilizando la librería `@faker-js/faker`. La API permite crear usuarios y mascotas ficticios que pueden almacenarse en la base de datos para facilitar el desarrollo y pruebas de la aplicación.

### Funcionalidades Añadidas

- **Rutas adicionales**: Permiten la generación masiva de usuarios y mascotas de prueba.
- **Controladores**: Controladores que manejan la generación y almacenamiento de datos ficticios en la base de datos a través de servicios.

## Instalación

1. Clonar el repositorio:

```bash
   git clone https://github.com/scerminati/AdoptMe1
```

2. Instalar las dependencias:

```bash
   npm install
```

3. Crear un archivo `.env` basado en `.env.example` y configurar las variables necesarias.

4. Iniciar el servidor:

```bash
   npm start
```

## Uso

La API permite generar datos de prueba, como mascotas y usuarios, en cantidades especificadas. Se pueden utilizar herramientas como Postman o cURL para hacer peticiones a los endpoints disponibles.

## Rutas

### Generación de Datos de Prueba

- `GET /mockingpets/:q`: Genera una cantidad específica de mascotas de prueba.

  - **Parámetro**: `q` - La cantidad de mascotas a generar (por defecto es 50).

- `GET /mockingusers/:q`: Genera una cantidad específica de usuarios de prueba.

  - **Parámetro**: `q` - La cantidad de usuarios a generar (por defecto es 50).

- `POST /generateData`: Genera y guarda en la base de datos una cantidad específica de mascotas y/o usuarios.
  - **Cuerpo de la solicitud**:
    ```json
    {
      "petQuantity": 50, // Número de mascotas a generar
      "userQuantity": 50 // Número de usuarios a generar
    }
    ```

## Controladores

- `generatePets`: Genera una cantidad específica de mascotas de prueba usando la función `mockPets`.
- `generateUsers`: Genera una cantidad específica de usuarios de prueba usando la función `mockUsers`.
- `generateData`: Genera y guarda una cantidad específica de mascotas y usuarios de prueba en la base de datos, según los valores proporcionados en el cuerpo de la solicitud.

## Funcionalidad de `utils`

La carpeta `utils` contiene funciones que permiten generar datos ficticios de mascotas y usuarios. Estas funciones se apoyan en la librería `@faker-js/faker` para generar aleatoriamente atributos como nombres, especies y características de las mascotas, así como información básica de los usuarios (nombre, apellido, correo electrónico y rol). 

- **`mockPets`**: Esta función genera un conjunto de datos ficticios para una mascota, eligiendo aleatoriamente una especie y generando un nombre y una fecha de nacimiento. Además, asigna una mascota como no adoptada y sin dueño.
  
- **`mockUsers`**: Genera datos ficticios de usuarios, como nombre, apellido, correo electrónico y un rol asignado aleatoriamente (administrador o usuario). También se incluye una contraseña predeterminada, que es cifrada para asegurar la privacidad.

Ambas funciones están diseñadas para facilitar la creación de datos de prueba en la base de datos de la aplicación.

## Estructura del Proyecto

El proyecto está organizado en las siguientes carpetas y archivos:

```bash
adoptme1/                           # Carpeta principal del proyecto
├── src/                              # Carpeta principal del código fuente
│   ├── controllers/                  # Controladores que gestionan la lógica de negocio
│   │   ├── adoptions.controller.js   # Controlador para la gestión de adopciones
│   │   ├── **mocks.controller.js**   # Controlador para la generación de datos ficticios (nuevo)
│   │   ├── pets.controller.js        # Controlador para la gestión de mascotas
│   │   ├── sessions.controller.js    # Controlador para la gestión de sesiones de usuario
│   │   └── users.controller.js       # Controlador para la gestión de usuarios
│   ├── dao/                          # Data Access Objects (DAO) que interactúan con la base de datos
│   │   ├── models/                   # Modelos de datos
│   │   │   ├── Adoption.js           # Modelo de adopción
│   │   │   ├── Pet.js                # Modelo de mascota
│   │   │   └── User.js               # Modelo de usuario
│   │   ├── Adoption.js               # Lógica de acceso a datos para adopciones
│   │   ├── Pets.dao.js               # Lógica de acceso a datos para mascotas
│   │   └── Users.dao.js              # Lógica de acceso a datos para usuarios
│   ├── dto/                          # Data Transfer Objects (DTO) para la transferencia de datos
│   │   ├── Pet.dto.js                # DTO de mascota
│   │   └── User.dto.js               # DTO de usuario
│   ├── public/                       # Archivos públicos accesibles
│   │   └── img/                      # Carpeta de imágenes
│   ├── repository/                   # Repositorios que manejan la persistencia de datos
│   │   ├── AdoptionRepository.js     # Repositorio para adopciones
│   │   ├── GenericRepository.js      # Repositorio genérico para operaciones comunes
│   │   ├── PetRepository.js          # Repositorio para mascotas
│   │   └── UserRepository.js         # Repositorio para usuarios
│   ├── routes/                       # Rutas de la API
│   │   ├── adoption.router.js        # Rutas para adopciones
│   │   ├── **mocks.router.js**       # Rutas para la generación de datos ficticios (nuevo)
│   │   ├── pets.router.js            # Rutas para mascotas
│   │   ├── sessions.router.js        # Rutas para la gestión de sesiones
│   │   └── users.router.js           # Rutas para usuarios
│   ├── services/                     # Lógica de negocio separada en servicios
│   │   └── index.js                  # Servicio principal de la aplicación
│   ├── utils/                        # Utilidades generales
│   │   ├── index.js                  # Funciones utilitarias generales
│   │   ├── mocks.js                  # Funciones para generar datos ficticios (nuevo)
│   │   └── uploader.js               # Funciones para manejar la carga de archivos
│   └── **app.js**                    # Archivo principal de la aplicación, donde se configura el servidor (modificado)
├── package-lock.json                 # Archivo de bloqueo de dependencias
├── package.json                      # Archivo de configuración de dependencias y scripts
└── README.md                         # Documentación del proyecto
```

Esta es la estructura principal de los archivos de la aplicación, organizada en diversas carpetas para controlar el acceso a los datos, las rutas, los servicios y los controladores.

- **controllers**: Contiene la lógica de negocio de los controladores (`mocks.controller.js`) que gestionan la generación de datos de prueba.
- **routes**: Define las rutas de la API, incluyendo las nuevas rutas para generar usuarios y mascotas (`mocks.router.js`).
- **services**: Contiene la lógica de acceso a datos y las operaciones de la base de datos para usuarios y mascotas.
- **utils**: Contiene funciones de utilidad, incluyendo las funciones `mockPets` y `mockUsers` para generar datos ficticios.

## Recursos Utilizados

En este proyecto se utilizaron las siguientes dependencias y herramientas:

### Dependencias

- **bcrypt**: Librería para el hashing de contraseñas.
- **cookie-parser**: Middleware para el manejo de cookies en las solicitudes.
- **dotenv**: Carga de variables de entorno desde un archivo `.env`.
- **express**: Framework para la creación de aplicaciones web en Node.js.
- **jsonwebtoken**: Manejo de JSON Web Tokens (JWT) para la autenticación.
- **mongoose**: ODM (Object Data Modeling) para MongoDB y Node.js.
- **multer**: Middleware para la carga de archivos (en este caso, imágenes).
- **supertest**: Librería para realizar pruebas HTTP en la API.
- **cors**: Middleware para permitir el intercambio de recursos entre diferentes orígenes (CORS).
- **express-handlebars**: Motor de plantillas Handlebars para generar vistas dinámicas.
- **morgan**: Middleware para el registro de peticiones HTTP.
- **connect-mongo**: Almacenamiento de sesiones en MongoDB.
- **passport**: Middleware para la autenticación.
- **passport-local**: Estrategia de autenticación local para Passport.
- **validator**: Herramienta para la validación de entradas (como emails y contraseñas).

### Dependencias de Desarrollo

- **@faker-js/faker**: Generación de datos falsos para pruebas y desarrollo.
- **chai**: Librería para la aserción en las pruebas.
- **commitizen**: Herramienta para la creación de mensajes de commit con un formato estándar.
- **mocha**: Framework de pruebas para JavaScript.

## Pruebas de la API

En esta sección se muestran los tests de los diferentes endpoints implementados en la API. Cada test incluye un ejemplo de la solicitud y la respuesta, así como capturas de pantalla de la ejecución en **Postman** o **cURL**.

### 1. Generación de Mascotas

#### Descripción:
Este endpoint permite generar una cantidad específica de mascotas de prueba. Puedes utilizar este endpoint para obtener una lista de mascotas aleatorias para pruebas en el sistema.

#### Endpoint:
`GET api/mocks/mockingpets/:q`

**Parámetro:**
- `q`: Número de mascotas a generar. Por defecto, se generan 50 si el parámetro no está especificado.

#### Ejemplo de Solicitud:
```bash
GET http://localhost:8080/api/mocks/mockingpets/3
```

#### Ejemplo de Respuesta:
```json
 [
        {
            "name": "Gracie",
            "specie": "dog - Chien Français Tricolore",
            "birthDate": "2014-10-13T02:45:55.015Z",
            "adopted": false,
            "owner": null
        },
        {
            "name": "Maggie",
            "specie": "snake - Perrotet's shieldtail snake",
            "birthDate": "2014-05-31T06:36:55.853Z",
            "adopted": false,
            "owner": null
        },
        {
            "name": "Bella",
            "specie": "rabbit - Mini Lop",
            "birthDate": "2011-08-15T08:44:48.389Z",
            "adopted": false,
            "owner": null
        }
    ]
```

#### Captura de Test:
![Primer Test](image.png)

---

### 2. Generación de Usuarios

#### Descripción:
Este endpoint permite generar una cantidad específica de usuarios de prueba. Puedes utilizar este endpoint para obtener usuarios con datos aleatorios para pruebas en el sistema.

#### Endpoint:
`GET /api/mocks/mockingusers/:q`

**Parámetro:**
- `q`: Número de usuarios a generar. Por defecto, se generan 50 si el parámetro no está especificado.

#### Ejemplo de Solicitud:
```bash
GET http://localhost:8080/api/mocks/mockingusers/3
```

#### Ejemplo de Respuesta:
```json
[
        {
            "first_name": "Darrel",
            "last_name": "Beahan",
            "email": "Maribel62@yahoo.com",
            "password": "$2b$10$Q5hhx/7q/.uKMuseI9BFT..iKpKxspy9PkacWoRX5urnro7ji.iEm",
            "role": "user",
            "pets": []
        },
        {
            "first_name": "Matt",
            "last_name": "Corkery",
            "email": "Casandra.Fadel@yahoo.com",
            "password": "$2b$10$I7z8QQ0kv8Zy/aoG498UvOxqtresX68k9oYCxTESRcvF6CqOYV8Ka",
            "role": "user",
            "pets": []
        },
        {
            "first_name": "Ethyl",
            "last_name": "Mitchell-Schmeler",
            "email": "Johnny39@yahoo.com",
            "password": "$2b$10$TrFV8B5hCwpi5GLw58aDAuKiUi5F4iDEnXSUT/3jIbtwXTjzKnUEG",
            "role": "user",
            "pets": []
        }
    ]
```

#### Captura de Test:
![Segundo Test](image-1.png)

---

### 3. Generación Masiva de Mascotas y Usuarios

#### Descripción:
Este endpoint permite generar tanto mascotas como usuarios de manera masiva en una sola solicitud. Es útil cuando se necesitan grandes cantidades de datos para pruebas o para simular cargas.

#### Endpoint:
`POST api/mocks/generateData`

#### Ejemplo de Solicitud:
```bash
GET http://localhost:8080/api/mocks/generateData
```

**Cuerpo de la Solicitud:**
```json
{
  "petQuantity": 1,
  "userQuantity": 2
}
```

#### Ejemplo de Respuesta:
```json
"pets": [
        {
            "name": "Kobe",
            "specie": "snake - Flinders python",
            "birthDate": "2024-04-10T07:45:18.824Z",
            "adopted": false,
            "owner": null
        }
    ],
    "users": [
        {
            "first_name": "Maymie",
            "last_name": "Lockman",
            "email": "Yesenia47@gmail.com",
            "password": "$2b$10$fQoOtmRMHSOG1w0bIAZHvOzgoHCzbKal6t82HEozMyU/rRgS1okO2",
            "role": "admin",
            "pets": []
        },
        {
            "first_name": "Joanie",
            "last_name": "Crooks",
            "email": "Nick.Feeney92@yahoo.com",
            "password": "$2b$10$UmFuC1XgC3m26ASrrqVYfekMfhfXpa8ERSBUjH5wLTS0xZGU3ZR.q",
            "role": "user",
            "pets": []
        }
    ]
```

#### Captura de Test:
![Tercer Test](image-2.png)

---

### Conclusión

Cada uno de estos endpoints facilita la generación de datos de prueba para mascotas y usuarios. Las capturas mostradas anteriormente validan el funcionamiento correcto de cada uno de ellos, asegurando que las respuestas sean las esperadas en situaciones de pruebas.

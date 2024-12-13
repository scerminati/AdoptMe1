/**
 * @swagger
 * components:
 *   schemas:
 *     adoptions:
 *       type: object
 *       required:
 *         - owner
 *         - pet
 *       properties:
 *         _id:
 *           type: string
 *           description: ID de la adopción, string de Mongoose
 *         owner:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: ID del dueño (_id de mongoose)
 *         pet:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: ID de la mascota (_id de mongoose)
 *
 *     pets:
 *       type: object
 *       required:
 *         - _id
 *         - name
 *         - specie
 *       properties:
 *         _id:
 *           type: string
 *           description: ID de la mascota, string de Mongoose
 *         name:
 *           type: string
 *           description: Nombre de la mascota
 *         specie:
 *           type: string
 *           description: Especie de la mascota
 *         birthDate:
 *           type: string
 *           format: date
 *           description: Fecha de nacimiento de la mascota
 *         adopted:
 *           type: boolean
 *           description: Es "true" si está adoptado, "false" si no está adoptado
 *         owner:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: ID del dueño (_id de mongoose)
 *         image:
 *           type: string
 *           description: Dirección de la imagen de la mascota
 *
 *     users:
 *       type: object
 *       required:
 *         - _id
 *         - first_name
 *         - last_name
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: ID del usuario, string de Mongoose
 *         first_name:
 *           type: string
 *           description: Nombre del usuario
 *         last_name:
 *           type: string
 *           description: Apellido del usuario
 *         email:
 *           type: string
 *           description: Correo del usuario
 *         password:
 *           type: string
 *           description: Contraseña del usuario, encriptada.
 *         role:
 *           type: string
 *           description: Rol del usuario
 *         pets:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: ID de las mascotas (_id de mongoose)
 *
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/users'
 *
 * /api/sessions/register:
 *   post:
 *     summary: Crea un usuario nuevo
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: Nombre del usuario
 *               last_name:
 *                 type: string
 *                 description: Apellido del usuario
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario (debe ser encriptada)
 *     responses:
 *       200:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/users'
 *       400:
 *         description: Valores incompletos
 *       406:
 *         description: Email ya utilizado
 *
 * /api/users/{uid}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/users'
 *       404:
 *         description: Usuario no encontrado
 *
 *   put:
 *     summary: Actualiza un usuario por su ID
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - role
 *               - pets
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: Nombre del usuario
 *               last_name:
 *                 type: string
 *                 description: Apellido del usuario
 *               role:
 *                 type: string
 *                 description: Rol del usuario a modificar (como user o admin)
 *               pets:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Id de la mascota a agregar (como _id)
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 *
 *   delete:
 *     summary: Elimina un usuario por su ID
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 *
 * /api/pets:
 *   get:
 *     summary: Obtiene todos las mascotas
 *     tags: [pets]
 *     responses:
 *       200:
 *         description: Lista de mascotas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/pets'
 *
 *   post:
 *     summary: Crear una nueva mascota
 *     tags: [pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - specie
 *               - birthDate
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la mascota
 *               specie:
 *                 type: string
 *                 description: Especie de la mascota
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de nacimiento de la mascota
 *     responses:
 *       200:
 *         description: Mascota creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/pets'
 *       400:
 *         description: Valores incompletos
 *
 * /api/pets/{pid}:
 *   put:
 *     summary: Editar una mascota
 *     tags: [pets]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - specie
 *               - birthDate
 *               - adopted
 *               - owner
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la mascota
 *               specie:
 *                 type: string
 *                 description: Especie de la mascota
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de nacimiento de la mascota
 *               adopted:
 *                 type: boolean
 *                 description: Es verdadero cuando tiene dueño, y falso cuando no está adoptado.
 *               owner:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Id del dueño de la mascota (_id del dueño)
 *     responses:
 *       200:
 *         description: Lista de mascotas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/pets'
 *
 *   delete:
 *     summary: Borrar una mascota
 *     tags: [pets]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Lista de mascotas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/pets'
 *
 *
 * /api/adoptions:
 *   get:
 *     summary: Obtiene todas las adopciones
 *     tags: [adoptions]
 *     responses:
 *       200:
 *         description: Lista de adopciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/adoptions'
 *
 * /api/adoptions/{aid}:
 *   get:
 *     summary: Obtiene una adopción específica por su ID
 *     tags: [adoptions]
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la adopción
 *     responses:
 *       200:
 *         description: Información de la adopción
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/adoptions'
 *       404:
 *         description: Adopción no encontrada
 *
 * /api/adoptions/{uid}/{pid}:
 *   post:
 *     summary: Crea una nueva adopción
 *     tags: [adoptions]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario (dueño)
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Adopción creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/adoptions'
 *       400:
 *         description: Mascota adoptada
 *       404:
 *         description: Usuario o mascota no encontrados
 *
 */

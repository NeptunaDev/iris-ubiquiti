const express = require("express");
const Unifi = require(`node-unifi`);
const app = express();
const PORT = process.env.PORT || 80;

// Middleware para parsear el body de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/guest/s/:id", (req, res) => {
  const { id } = req.params;
  console.log("🚀 ~ app,post ~ {id}:", { id });
  const queries = req.query;
  console.log("🚀 ~ app.get ~ queries:", queries);
  return res.send(`<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Formulario de Inicio de Sesión</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #f5f5f5;
            }
            form {
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                width: 300px;
            }
            input[type="email"],
            input[type="password"] {
                width: calc(100% - 20px);
                margin-bottom: 10px;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
            }
            input[type="submit"] {
                width: 100%;
                background-color: #007bff;
                color: #fff;
                border: none;
                padding: 10px;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }
            input[type="submit"]:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <form action="/connecting" method="POST">
            <h2>Iniciar Sesión</h2>
            <label for="email">Correo Electrónico:</label>
            <input type="email" id="email" name="email" required>
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required>
            <input type="text" value="${queries?.ap}" id="ap" name = "ap">
            <input type="text" value="${queries?.id}" id="id" name = "id">
            <input type="text" value="${id}" id="id" name = "site">
            <input type="submit" value="Iniciar Sesión">
        </form>
    </body>
    </html>
    `);
});

app.post("/connecting", async (req, res) => {
  const { id, ap, email, password, site } = req.body;
  console.log("🚀 ~ app.post ~ {id, ap, email, password}:", {
    id,
    ap,
    email,
    password,
    site
  });
  try{
      const unifi = new Unifi.Controller({
          host: "10.1.5.2",
          port: "8443",
          username: "iris",
          password: "Iris2024*",
          sslverify: false,
          site
        });
        const loginData = await unifi.login("iris", "Iris2024*");
        console.log(unifi.opts.site)
        console.log("🚀 ~ app.post ~ loginData:", loginData)
        const algo = await unifi.authorizeGuest(id, 2, null, null, null, ap )
        console.log("🚀 ~ app.post ~ algo:", algo)
        return res.send(`<!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mensaje Satisfactorio</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #f5f5f5;
                }
                .message {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                h2 {
                    color: #007bff;
                }
            </style>
        </head>
        <body>
            <div class="message">
                <h2>¡Inicio de Sesión Exitoso!</h2>
                <p>Has iniciado sesión correctamente en nuestra página.</p>
            </div>
        </body>
        </html>
        `)
    } catch(e){
        console.log(e.message)
    }
});

// Manejador de errores para rutas no encontradas
app.use((req, res, next) => {
  const { originalUrl, path } = req;
  console.log("🚀 ~ app.use ~ {originalUrl, path}:", { originalUrl, path });
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

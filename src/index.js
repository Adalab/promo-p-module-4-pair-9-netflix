const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

// create and config server
const server = express();
server.use(cors());
server.use(express.json());
server.set("view engine", "ejs");

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

const db = new Database("./src/db/database.db", {
  // con verbose le decimos que muestre en la consola todas las queries que se ejecuten
  verbose: console.log,
  // así podemos comprobar qué queries estamos haciendo en todo momento
});

server.get("/movies", (req, res) => {
  let movies;
  if (req.query.gender === "") {
    const query = db.prepare(
      `SELECT * FROM movies ORDER BY name ${req.query.sort}`
    );
    movies = query.all();
  } else {
    const query = db.prepare(
      `SELECT * FROM movies WHERE gender=? ORDER BY name ${req.query.sort}`
    );
    movies = query.all(req.query.gender);
  }

  res.json({
    success: true,
    movies: movies,
  });
});

server.post("/login", (req, res) => {
  console.log(req.body);
  console.log("hola");

  const query = db.prepare(`SELECT * FROM users WHERE email=? AND password=?`);
  const foundUser = query.get(req.body.email, req.body.password);

  if (foundUser) {
    res.json({
      success: true,
      userId: foundUser.id,
    });
  } else {
    res.json({
      success: false,
      errorMessage: "Usuaria/o no encontrada/o",
    });
  }
});

server.get("/movie/:movieId", (req, res) => {
  console.log(req.params);
  const query = db.prepare(
    `SELECT * FROM movies WHERE id = ${req.params.movieId}`
  );
  const foundMovie = query.get();

  res.render("movie", foundMovie);
});

server.post("/sign-up", (req, res) => {
  const userEmail = db.prepare("SELECT email FROM users WHERE email= ?");
  const foundUser = userEmail.get(req.body.email);

  if (foundUser === undefined) {
    const query = db.prepare(
      "INSERT INTO users (email, password) VALUES (?, ?)"
    );
    const result = query.run(req.body.email, req.body.password);
    console.log(result);
    res.json({ success: true, errorMessage: "Usuaria creada" });
  } else {
    res.json({
      success: false,
      errorMessage: "Usuaria ya existente",
    });
  }
});

server.post("/profile", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const id = req.header.userId;
  const query = db.prepare(
    "UPDATE users SET name=?, email=?, password=? WHERE id=?"
  );
  console.log(id);
  console.log(name);
  console.log(req.body);
  const userUpdate = query.run(name, email, password, id);
  console.log(userUpdate);
  if (userUpdate.changes !== 0) {
    res.json({
      error: false,
      msj: "se modificó con éxito",
    });
  } else {
    res.json({
      error: true,
      msj: "ha ocurrido un error",
    });
  }
});

const staticServerPathWeb = "./src/public-react"; // En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathWeb));

const staticServerPathImages = "./src/public-movies-images/"; // En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathImages));

const staticServerPathStyle = "./src/web/src/stylesheets"; // En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathStyle));

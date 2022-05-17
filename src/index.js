const express = require('express');
const cors = require('cors');
const movies = require('./data/movies.json');
const users = require('./data/users.json');
// create and config server
const server = express();
server.use(cors());
server.use(express.json());
server.set('view engine', 'ejs');

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

server.get('/movies', (req, res) => {
  const genderFilterParam = req.query.gender.toLowerCase()
    ? req.query.gender
    : '';
  res.json({
    success: true,
    movies: movies.filter((movie) =>
      movie.gender.includes(genderFilterParam.toLowerCase())
    ),
  });
});

server.post('/login', (req, res) => {
  console.log(req.body);
  console.log('hola');
  const foundUser = users.find(
    (user) =>
      user.email === req.body.email.toLowerCase() &&
      user.password === req.body.password
  );
  if (foundUser) {
    res.json({
      success: true,
      userId: 'id_de_la_usuaria_encontrada',
    });
  } else {
    res.json({
      success: false,
      errorMessage: 'Usuaria/o no encontrada/o',
    });
  }
});

server.get('/movie/:movieId', (req, res) => {
  console.log(req.params);
  const foundMovie = movies.find((movie) => movie.id === req.params.movieId);
  console.log(foundMovie);
  res.render('movie', foundMovie);
});

const staticServerPathWeb = './src/public-react'; // En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathWeb));

const staticServerPathImages = './src/public-movies-images/'; // En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathImages));

const staticServerPathStyle = './src/web/src/stylesheets'; // En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathStyle));

const express = require("express");
const cors = require("cors");

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

server.get("/movies", (req, res) => {
  res.json({
    success: true,
    movies: [
      {
        id: "1",
        title: "Gambita de dama",
        gender: "Drama",
        image: "https://via.placeholder.com/150",
      },
      {
        id: "2",
        title: "Friends",
        gender: "Comedia",
        image: "https://via.placeholder.com/150",
      },
    ],
  });
});

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(express.json());

// 2. Modelo de datos inicial
let movies = [
  {
    "id": 1,
    "title": "Inception",
    "description": "Una película de ciencia ficción dirigida por Christopher Nolan",
    "votes": 0
  },
  {
    "id": 2,
    "title": "Titanic",
    "description": "Historia romántica dirigida por James Cameron",
    "votes": 0
  },
  {
    "id": 3,
    "title": "The Matrix",
    "description": "Película de acción y ciencia ficción dirigida por los hermanos Wachowski",
    "votes": 0
  }
];

// Contador para generar IDs únicos de nuevas películas
let nextId = 4;

// 3a. GET /movies - Obtener todas las películas
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// 3c. GET /movie/:id - Obtener detalles de una película específica
app.get('/movie/:id', (req, res) => {
  const movieId = parseInt(req.params.id);
  
  if (isNaN(movieId)) {
    return res.status(400).json({ error: "El ID proporcionado debe ser un número válido." });
  }

  const movie = movies.find(m => m.id === movieId);

  if (!movie) {
    return res.status(404).json({ error: "Película no encontrada." });
  }

  res.status(200).json(movie);
});

// 3b. POST /vote/:id - Registrar un voto para una película
app.post('/vote/:id', (req, res) => {
  const movieId = parseInt(req.params.id);

  if (isNaN(movieId)) {
    return res.status(400).json({ error: "El ID proporcionado debe ser un número válido." });
  }

  const movie = movies.find(m => m.id === movieId);

  if (!movie) {
    return res.status(404).json({ error: "Película no encontrada." });
  }

  movie.votes += 1;
  res.status(200).json({ message: "Voto registrado correctamente." });
});

// 3d. GET /result - Obtener películas ordenadas por votos de mayor a menor
app.get('/result', (req, res) => {
  // Se crea una copia superficial para no alterar el orden original del array principal
  const sortedMovies = [...movies].sort((a, b) => b.votes - a.votes);
  
  // Mapeamos para devolver solo las propiedades requeridas en el ejemplo de respuesta
  const result = sortedMovies.map(m => ({
    id: m.id,
    title: m.title,
    votes: m.votes
  }));

  res.status(200).json(result);
});

// 5a. POST /movies - Agregar una nueva película
app.post('/movies', (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Los campos 'title' y 'description' son obligatorios." });
  }

  const newMovie = {
    id: nextId++,
    title,
    description,
    votes: 0
  };

  movies.push(newMovie);
  res.status(201).json({ message: "Película agregada con éxito.", movie: newMovie });
});

// 5b. PUT /movie/:id - Modificar una película existente
app.put('/movie/:id', (req, res) => {
  const movieId = parseInt(req.params.id);
  const { title, description } = req.body;

  if (isNaN(movieId)) {
    return res.status(400).json({ error: "El ID proporcionado debe ser un número válido." });
  }

  if (!title && !description) {
    return res.status(400).json({ error: "Debe proporcionar al menos un campo ('title' o 'description') para actualizar." });
  }

  const movie = movies.find(m => m.id === movieId);

  if (!movie) {
    return res.status(404).json({ error: "Película no encontrada." });
  }

  if (title) movie.title = title;
  if (description) movie.description = description;

  res.status(200).json({ message: "Película actualizada con éxito.", movie });
});

// 5c. DELETE /movie/:id - Eliminar una película (solo si no tiene votos)
app.delete('/movie/:id', (req, res) => {
  const movieId = parseInt(req.params.id);

  if (isNaN(movieId)) {
    return res.status(400).json({ error: "El ID proporcionado debe ser un número válido." });
  }

  const movieIndex = movies.findIndex(m => m.id === movieId);

  if (movieIndex === -1) {
    return res.status(404).json({ error: "Película no encontrada." });
  }

  // Validación: solo eliminar si no tiene votos (votes === 0)
  if (movies[movieIndex].votes > 0) {
    return res.status(400).json({ error: "No se puede eliminar la película porque ya cuenta con votos registrados." });
  }

  movies.splice(movieIndex, 1);
  res.status(200).json({ message: "Película eliminada con éxito." });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor de votación de películas corriendo en http://localhost:${PORT}`);
});

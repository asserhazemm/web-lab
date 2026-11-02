import React from "react";
import ReactDOM from "react-dom";
import { useState } from "react";
import "./styles.css";

// ===== Component 1: the 5 stars (used in the form AND on every movie) =====
// Props: rating = how many stars are filled, onRate = function to call when a star is clicked
function StarRating({ rating, onRate }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="stars">
      {stars.map((n) => (
        <span key={n} className="star" onClick={() => onRate(n)}>
          {n <= rating ? "⭐" : "☆"}
        </span>
      ))}
    </div>
  );
}

// ===== Component 2: the form for adding a movie =====
// It remembers what the user is typing, then hands the finished movie up to App
function MovieForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  function handleAdd() {
    if (title.trim() === "") return; // ignore empty titles
    onAdd(title.trim(), comment.trim(), rating);
    setTitle("");
    setComment("");
    setRating(0);
  }

  return (
    <div className="form">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAdd();
        }}
        placeholder="Movie title"
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a short review..."
      />
      <div className="form-row">
        <span>Your rating:</span>
        <StarRating rating={rating} onRate={setRating} />
      </div>
      <button className="add" onClick={handleAdd}>
        Add movie
      </button>
    </div>
  );
}

// ===== Component 3: one movie card =====
function MovieItem({ movie, onRate, onRemove }) {
  return (
    <li className="movie">
      <div className="movie-header">
        <h3>{movie.title}</h3>
        <button className="remove" onClick={() => onRemove(movie.id)}>
          ✕
        </button>
      </div>
      <StarRating rating={movie.rating} onRate={(n) => onRate(movie.id, n)} />
      <p className="count">{movie.rating} / 5 stars given</p>
      {movie.comment ? (
        <p className="comment">“{movie.comment}”</p>
      ) : (
        <p className="comment muted">No review written.</p>
      )}
    </li>
  );
}

// ===== Our page: owns the data (state) and passes it down as props =====
function App() {
  const [movies, setMovies] = useState([]);

  function handleAdd(title, comment, rating) {
    const newMovie = { id: Date.now(), title: title, comment: comment, rating: rating };
    setMovies([...movies, newMovie]); // copy the old list and add the new movie at the end
  }

  function handleRemove(id) {
    setMovies(movies.filter((m) => m.id !== id)); // keep every movie except this one
  }

  function handleRate(id, rating) {
    setMovies(movies.map((m) => (m.id === id ? { ...m, rating: rating } : m)));
  }

  return (
    <div className="app">
      <h1>🎬 Movies Watch List</h1>
      <MovieForm onAdd={handleAdd} />
      {movies.length === 0 ? (
        <p className="empty">No movies yet. Add the first one you watched!</p>
      ) : (
        <ul className="list">
          {movies.map((movie) => (
            <MovieItem
              key={movie.id}
              movie={movie}
              onRate={handleRate}
              onRemove={handleRemove}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
// If your sandbox uses React 18+, replace the 2 lines above with:
//   import { createRoot } from "react-dom/client";   (put this at the top)
//   createRoot(rootElement).render(<App />);

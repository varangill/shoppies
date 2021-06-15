import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { getSuggestedQuery } from '@testing-library/react';


function App() {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [nominees, setNominees] = useState([]);
  const [disabledButtons, setDisabledButtons] = useState([]);
  const [error, setError] = useState('');
  require('dotenv').config()

  const onSubmit = async(e) => { //submitting a search for a movie
    e.preventDefault();
    setSearchResults([]);

    if (search.trim() === '') {
      alert("Error: Invalid entry");
      return;
    }

    const response = await fetch(
      `https://www.omdbapi.com/?s=${search}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`
    );

    const results = await response.json();
    if (results.Search) {
      setSearchResults([...results.Search]);
    } else {
      alert("Error: Invalid entry");
    }

  }

  const onNominate = async(movie) => {
    console.log(movie);
    if (nominees.length > 4) {
      alert("Error: Max movies selected");
      return;
    }

    const response = await fetch(
      `https://www.omdbapi.com/?i=${movie}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`
    );

    const { Title, imdbID, Year} = await response.json();
    console.log(imdbID);
    setNominees([{ Title, imdbID, Year }, ...nominees]);
  }

  const onDelete = (movie) => {
    setNominees(nominees.filter(
      ({ imdbID }) => imdbID != movie
    ));
  }
  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={onSubmit}>
          <h2>Movie Title</h2>
          <input 
            value={search}
            required
            type="search"
            className="textinput"
            onChange={(e) => setSearch(e.currentTarget.value)}
          />

          <button type="submit" className="button">Submit</button>
        </form>
        <h2>Results...</h2>
        {searchResults
            ? searchResults.map(({ Title, Year, imdbID }) => (
                <li key={imdbID} className="list">
                  <span>{Title}</span> - <span>{Year}</span>
                  <button
                    type="button"
                    className="button"
                    onClick={() => onNominate(imdbID)}
                  >
                    Nominate
                  </button>
                </li>
              ))
            : ''}

        <h2>Nominations...</h2>
        {nominees
              ? nominees.map(({ Title, Year, imdbID }) => (
                  <li key={imdbID} className="list">
                    <span>{Title}</span> - <span>{Year}</span>
                    <button 
                      type="button" 
                      className="button" 
                      onClick={() => onDelete(imdbID)}
                    >
                      Remove
                    </button>
                  </li>
                ))
              : ''}
      </header>
    </div>
  );
}

export default App;

// Styles
import "./App.css";

// Hooks
import { useEffect, useState } from "react";

// Contexts
import { PokemonContext } from "./contexts/PokemonContext";

// Components
import Card from "./components/Card";

async function asyncGetPokemons(setPokemons) {
  const data = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
  const pokemonsResponse = await data.json();

  const arrPokemonObj = pokemonsResponse.results.map(async (pokemonItem) => {
    const response = await fetch(pokemonItem.url);
    const arrObjPokemon = await response.json();
    return arrObjPokemon;
  });

  const newMixedArray = pokemonsResponse.results.map(async (pokemon, index) => {
    let pokemonObj = await arrPokemonObj[index];
    let urlImgPokemon = pokemonObj.sprites.other.home.front_default;

    return {
      name: pokemon.name,
      img: urlImgPokemon,
    };
  });

  setPokemons(newMixedArray);
}

function App() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    asyncGetPokemons(setPokemons);
  }, []);

  return (
    <>
      <h1>Pokemons</h1>
      <div className="container">

        <PokemonContext.Provider value={pokemons}>
          <Card />
        </PokemonContext.Provider>

      </div>
    </>
  );
}

export default App;

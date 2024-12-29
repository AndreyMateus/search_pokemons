// Styles
import styles from "./cardStyles.module.css";

// Hooks
import { useContext, useEffect, useState } from "react";

// Context
import { PokemonContext } from "../contexts/PokemonContext";

async function asyncGetPokemons(setPokemons, PokemonsContext) {
    if (PokemonContext) {
        const result = await Promise.all(PokemonsContext);
        setPokemons([...result]);
    }
}

export default function Card() {
    // Contexts
    const PokemonsContext = useContext(PokemonContext);

    // States
    const [pokemonsState, setPokemons] = useState([]);
    const [inputText, setInputText] = useState("");
    const [filteredPokemons, setFilteredPokemons] = useState([]);

    useEffect(() => {
        asyncGetPokemons(setPokemons, PokemonsContext);

        //! Vamos ficar assistindo o "context" que são os dados compartilhados, se eles se atualizarem, nós executaremos essa função novamente e atualizaremos o componente abaixo.
    }, [PokemonsContext]);

    useEffect(() => {
        //! Se o ARRAY com todos os pokemons, for ALTERADO pelo "useEffect()" ACIMA, então vamos ATUALIZAR o "RETORNO" de TODOS os POKEMONS, quando o FILTRO for mostrar TODOS os POKEMONS.
        setFilteredPokemons(pokemonsState);
    }, [pokemonsState]);

    //! toda vez que o VALOR do INPUT MUDAR, essa função será CHAMADA/EXECUTADA.
    function handleInput(e) {
        const valueInput = e.target.value;
        setInputText(valueInput);

        if (valueInput.length > 0) {
            const filterPokemon = pokemonsState.filter((pokemon) => {
                return pokemon.name.toLowerCase().includes(valueInput.toLowerCase());
            });

            //? Se não encontrar qualquer resultado, envie esse resultado, para que não seja usada a animação de "carregando...", quando não achar algum pokemon.
            if (filterPokemon.length === 0) {
                setFilteredPokemons([{
                    name: "Pokemon não encontrado",
                    img: "not found"
                }]);
                return;
            }

            //! OBS: utilizamos UM NOVO STATE chamado "filteredPokemons", pois se usassemos o "array original" com todos os pokemons, se atualizasemos ele com o NOVO ARRAY "RETORNADO" pelo "filter()", estariamos ZERANDO NOSSA "BASE DE DADOS" que contém os POKEMONS, então agora com um "STATE" só para o "CAMPO DE BUSCA/FILTRO", teremos SEMPRE "TODOS os VALORES ORIGINAIS" e os "FILTRADOS".
            setFilteredPokemons(filterPokemon);
        }
        else {
            setFilteredPokemons(pokemonsState);
        }
    }

    return (
        <>
            <input type="text"
                value={inputText}
                onChange={handleInput}
                className={styles.input}
                placeholder="Digite o nome do pokemon"
            />

            <div className={styles.containerCard}>

                {filteredPokemons.length > 0 ? filteredPokemons.map(pokemon => {
                    //! Validando se a URL veio preenchida.
                    if (pokemon.img) {
                        return (
                            <div key={pokemon.name} className={styles.card}>
                                <h2>{pokemon.name}</h2>
                                <img src={pokemon.img}
                                    alt={pokemon.img === "not found" ? "" : `Pokemon ${pokemon.name}`} />
                            </div>
                        );
                    }
                }) : <p className={styles.textLoading}>Carregando...</p>}

            </div>
        </>
    );
}
"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import styles from "./page.module.css";

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
  types: {
    type: {
      name: string;
    };
  }[];
}

interface PokemonAPIResponse {
  results: { name: string; url: string }[];
}
const typeColors: { [key: string]: string } = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const PokemonCard: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get<PokemonAPIResponse>('https://pokeapi.co/api/v2/pokemon?limit=1000');
        const pokemonData = await Promise.all(
          response.data.results.map(async (pokemon) => {
            const pokemonDetails = await axios.get<Pokemon>(pokemon.url);
            return pokemonDetails.data;
          })
        );
        setPokemonList(pokemonData);
        setFilteredPokemonList(pokemonData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filteredList = pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(value));
    setFilteredPokemonList(filteredList);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Kanto Region Pokémon</h1>
      <input
        type="text"
        placeholder="Search Pokémon"
        value={searchTerm}
        onChange={handleSearch}
        className={styles.searchBarStyle}
      />
      <div className="flex flex-wrap">
        {filteredPokemonList.map((pokemon) => {
          const primaryType = pokemon.types[0]?.type.name;
          const backgroundColor = typeColors[primaryType] || '#fff'; 
          return (
            <div
              key={pokemon.id}
              className={styles.cardStyle}
              style={{ backgroundColor }} 
            >
              <img src={pokemon.sprites.front_default} alt={pokemon.name} />
              <h2>{pokemon.name}</h2>
              <p>ID: {pokemon.id}</p>
              <p>Type: {pokemon.types.map(type => type.type.name).join(', ')}</p>
              <p>HP: {pokemon.stats.find(stat => stat.stat.name === 'hp')?.base_stat}</p>
              <p>Height: {pokemon.height} decimetres</p>
              <p>Weight: {pokemon.weight} hectograms</p>
              <p>Abilities: {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
              <p>Stats: {pokemon.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join(', ')}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PokemonCard;

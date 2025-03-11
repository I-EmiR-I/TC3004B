import React, { useState, useEffect } from 'react';
import { Heart, Shield, Swords, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Pokemon {
  name: string;
  url: string;
  details?: {
    id: number;
    sprites: {
      other: {
        'official-artwork': {
          front_default: string;
        };
      };
    };
    types: Array<{
      type: {
        name: string;
      };
    }>;
    stats: Array<{
      base_stat: number;
      stat: {
        name: string;
      };
    }>;
  };
}

function App() {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [displayedPokemon, setDisplayedPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchPokemonList = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=25');
      const data = await response.json();
      
      // Fetch details for each Pokemon
      const pokemonWithDetails = await Promise.all(
        data.results.map(async (pokemon: Pokemon) => {
          const detailsResponse = await fetch(pokemon.url);
          const details = await detailsResponse.json();
          return {
            ...pokemon,
            details
          };
        })
      );
      
      setAllPokemon(pokemonWithDetails);
      setError(null);
    } catch (err) {
      setError('Error al cargar los Pokémon');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemonList();
  }, []);

  useEffect(() => {
    const filteredPokemon = allPokemon.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pokemon.details?.id.toString().includes(searchTerm)
    );

    setDisplayedPokemon(filteredPokemon);
    setCurrentPage(1);
  }, [searchTerm, allPokemon]);

  const totalPages = Math.ceil(displayedPokemon.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPokemon = displayedPokemon.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-blue-200',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-green-600',
      rock: 'bg-yellow-800',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-800',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300',
    };
    return colors[type] || 'bg-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg p-4 fixed w-full top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-blue-600">Pokédex</h1>
          
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar Pokémon..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </form>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-8 px-4">
        {loading ? (
          <div className="text-xl font-semibold text-center">Cargando...</div>
        ) : error ? (
          <div className="text-xl font-semibold text-red-500 text-center">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {paginatedPokemon.map((pokemon) => (
                <div key={pokemon.name} className="bg-white rounded-xl shadow-xl overflow-hidden transform transition hover:scale-105">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6">
                    <img
                      src={pokemon.details?.sprites.other['official-artwork'].front_default}
                      alt={pokemon.name}
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-3xl font-bold capitalize mb-4 text-center">
                      {pokemon.name}
                    </h2>
                    
                    <div className="flex gap-2 justify-center mb-6">
                      {pokemon.details?.types.map((type, index) => (
                        <span
                          key={index}
                          className={`${getTypeColor(type.type.name)} text-white px-3 py-1 rounded-full text-sm font-semibold`}
                        >
                          {type.type.name}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Heart className="text-red-500" />
                        <div className="bg-gray-200 w-full rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{
                              width: `${(pokemon.details?.stats[0].base_stat || 0) / 255 * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-8">{pokemon.details?.stats[0].base_stat}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Swords className="text-blue-500" />
                        <div className="bg-gray-200 w-full rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${(pokemon.details?.stats[1].base_stat || 0) / 255 * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-8">{pokemon.details?.stats[1].base_stat}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Shield className="text-green-500" />
                        <div className="bg-gray-200 w-full rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${(pokemon.details?.stats[2].base_stat || 0) / 255 * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-8">{pokemon.details?.stats[2].base_stat}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Anterior
              </button>
              
              <span className="font-semibold">
                Página {currentPage} de {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Siguiente
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
import { createRoot } from "react-dom/client";
import { useState } from "react";
import {
  createApi,
  ApiProvider,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
interface PokemonDetailData {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  sprites: {
    front_default: string;
  };
}
interface PokemonListing {
  count: number;
  results: Array<{
    name: string;
    url: string;
  }>;
}

// const fakePokemonListing = {
//   count: 1126,
//   next: "https://pokeapi.co/api/v2/pokemon?limit=9",
//   previous: null,
//   results: [
//     {
//       name: "bulbasaur",
//       url: "https://pokeapi.co/api/v2/pokemon/1/",
//     },
//     {
//       name: "ivysaur",
//       url: "https://pokeapi.co/api/v2/pokemon/2/",
//     },
//     {
//       name: "venusaur",
//       url: "https://pokeapi.co/api/v2/pokemon/3/",
//     },
//     {
//       name: "charmander",
//       url: "https://pokeapi.co/api/v2/pokemon/4/",
//     },
//     {
//       name: "charmeleon",
//       url: "https://pokeapi.co/api/v2/pokemon/5/",
//     },
//     {
//       name: "charizard",
//       url: "https://pokeapi.co/api/v2/pokemon/6/",
//     },
//     {
//       name: "squirtle",
//       url: "https://pokeapi.co/api/v2/pokemon/7/",
//     },
//     {
//       name: "wartortle",
//       url: "https://pokeapi.co/api/v2/pokemon/8/",
//     },
//     {
//       name: "blastoise",
//       url: "https://pokeapi.co/api/v2/pokemon/9/",
//     },
//   ],
// };
// const fakePokemonDetailData = {
//   id: 1,
//   name: "bulbasaur",
//   height: 7,
//   weight: 69,
//   types: [
//     {
//       slot: 1,
//       type: { name: "grass", url: "https://pokeapi.co/api/v2/type/12/" },
//     },
//     {
//       slot: 2,
//       type: { name: "poison", url: "https://pokeapi.co/api/v2/type/4/" },
//     },
//   ],
//   sprites: {
//     front_default:
//       "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
//   },
// };
// const simulateLoading = () => {
//   return new Promise((resolve) => setTimeout(resolve, 2000));
// };
const api = createApi({
  // baseQuery: async (url) => {
  //   const result = await fetch(url);
  //   if (result.ok) {
  //     const data = result.json();
  //     return {
  //       data: data,
  //     };
  //   } else {
  //     return "error";
  //   }
  // },
  baseQuery: fetchBaseQuery({
    baseUrl: "https://pokeapi.co/api/v2/",
  }),
  endpoints: (builder) => ({
    pokemonList: builder.query<PokemonListing, void>({
      // async queryFn() {
      //   const result = await fetch(
      //     "https://pokeapi.co/api/v2/pokemon?offset=9&limit=9"
      //   );
      //   if (result.ok) {
      //     const data = result.json();
      //     return {
      //       data: data,
      //     };
      //   } else {
      //     return "error";
      //   }
      // },
      // 可以直接返回url
      // query() {
      //   return "pokemon?offset=9&limit=9";
      //   // return "https://pokeapi.co/api/v2/pokemon?offset=9&limit=9";
      // },
      // 返回 查询的url  通过对象
      query() {
        return {
          url: "pokemon",

          params: {
            offset: 9,
            limit: 9,
          },
          method: "GET",
        };
      },
    }),
    pokemonDetail: builder.query<PokemonDetailData, { name: string }>({
      // async queryFn({ name }) {
      //   const result = await fetch(
      //     `https://pokeapi.co/api/v2/pokemon/${name}/`
      //   );
      //   if (result.ok) {
      //     const data = result.json();
      //     return {
      //       data: data,
      //     };
      //   } else {
      //     return "error";
      //   }
      // },
      query({ name }) {
        // return `https://pokeapi.co/api/v2/pokemon/${name}/`;
        return `pokemon/${name}/`;
      },
    }),
  }),
});

const { usePokemonListQuery, usePokemonDetailQuery } = api;
console.log(usePokemonListQuery);

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState<string | undefined>(
    undefined
  );

  return (
    <>
      <header>
        <h1>My Pokedex</h1>
      </header>
      <main>
        {selectedPokemon ? (
          <>
            <PokemonDetails pokemonName={selectedPokemon} />
            <button onClick={() => setSelectedPokemon(undefined)}>back</button>
          </>
        ) : (
          <PokemonList onPokemonSelected={setSelectedPokemon}></PokemonList>
        )}
      </main>
    </>
  );
}
function PokemonDetails({ pokemonName }: { pokemonName: string }) {
  const { isLoading, isError, data, isUninitialized } = usePokemonDetailQuery({
    name: pokemonName,
  });
  if (isLoading || isUninitialized) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }

  return (
    <article>
      <h2>{data.name}</h2>
      <img src={data.sprites.front_default} alt="" />
      <ul>
        <li>id:{data.id}</li>
        <li>height:{data.height}</li>
        <li>weight:{data.weight}</li>
        <li>types:</li>
      </ul>
    </article>
  );

  //
}
function PokemonList({
  onPokemonSelected,
}: {
  onPokemonSelected: (name: string) => void;
}) {
  const { isLoading, isError, data, isUninitialized } = usePokemonListQuery();
  if (isLoading || isUninitialized) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }
  return (
    <article>
      <h2>Overview</h2>
      {data.results.map((pokemon) => (
        <ol key={pokemon.name}>
          <button onClick={() => onPokemonSelected(pokemon.name)}>
            {pokemon.name}
          </button>
        </ol>
      ))}
    </article>
  );

  //
}
export default App;

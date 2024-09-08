document.addEventListener("DOMContentLoaded", () => {
  showWelcomeImage();

  document
    .getElementById("search-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const pokemonName = document
        .getElementById("pokemon-name")
        .value.toLowerCase();
      searchPokemon(pokemonName);
    });

  document
    .getElementById("search-id-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const pokemonId = document.getElementById("pokemon-id").value;
      searchPokemonById(pokemonId);
    });

  document
    .getElementById("search-form")
    .addEventListener("submit", function (event) {
      const nameInput = document.getElementById("pokemon-name").value;
      if (/[\d]/.test(nameInput)) {
        alert("Por favor, ingresa solo letras para buscar por nombre.");
        event.preventDefault(); 
      }
    });

  async function searchPokemon(name) {
    const pokemonListContainer = document.getElementById("pokemon-list");
    pokemonListContainer.innerHTML = "";
    document.getElementById("welcome-image").style.display = "none";
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (response.ok) {
        const data = await response.json();
        displayPokemon(data);
      } else {
        pokemonListContainer.innerHTML = "<p>Pokémon no encontrado.</p>";
      }
    } catch (error) {
      console.error("Error searching Pokémon:", error);
    }
  }

  async function searchPokemonById(id) {
    const pokemonListContainer = document.getElementById("pokemon-list");
    pokemonListContainer.innerHTML = "";
    document.getElementById("welcome-image").style.display = "none";
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (response.ok) {
        const data = await response.json();
        displayPokemon(data);
      } else {
        pokemonListContainer.innerHTML = "<p>Pokémon no encontrado por ID.</p>";
      }
    } catch (error) {
      console.error("Error searching Pokémon by ID:", error);
    }
  }

  function displayPokemon(pokemon) {
    const pokemonCard = document.createElement("div");
    pokemonCard.className = "pokemon-card";
    pokemonCard.innerHTML = `
        <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <p>ID: ${pokemon.id}</p>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Peso: ${pokemon.weight / 10} kg</p> <!-- Mostrar peso en kg -->
        <p>Tipo: ${pokemon.types
          .map((typeInfo) => typeInfo.type.name)
          .join(", ")}</p>
    `;
    document.getElementById("pokemon-list").appendChild(pokemonCard);
  }

  window.filterByType = async (type) => {
    const pokemonListContainer = document.getElementById("pokemon-list");
    pokemonListContainer.innerHTML = "";
    document.getElementById("welcome-image").style.display = "none";
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      if (response.ok) {
        const data = await response.json();
        const pokemonPromises = data.pokemon.map((pokemonEntry) =>
          fetch(pokemonEntry.pokemon.url)
        );
        const pokemonResponses = await Promise.all(pokemonPromises);
        const pokemonData = await Promise.all(
          pokemonResponses.map((response) => response.json())
        );
        pokemonData.forEach((pokemon) => displayPokemon(pokemon));
      } else {
        pokemonListContainer.innerHTML =
          "<p>No Pokémon found for this type.</p>";
      }
    } catch (error) {
      console.error("Error filtering by type:", error);
    }
  };

  function showWelcomeImage() {
    document.getElementById("welcome-image").style.display = "block";
  }

  document.getElementById("reset-page").addEventListener("click", () => {
    document.getElementById("pokemon-name").value = "";
    document.getElementById("pokemon-id").value = ""; 
    document.getElementById("pokemon-list").innerHTML = "";
    showWelcomeImage();
  });
});

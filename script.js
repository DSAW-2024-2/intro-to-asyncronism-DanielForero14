document.addEventListener("DOMContentLoaded", () => {
  // Mostrar los botones de filtro y la imagen de bienvenida al cargar la página
  showWelcomeImage();

  // Manejar la entrada del formulario de búsqueda
  document
    .getElementById("search-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const pokemonName = document
        .getElementById("pokemon-name")
        .value.toLowerCase();
      searchPokemon(pokemonName);
    });

  // Manejar la entrada del formulario de búsqueda por ID
  document
    .getElementById("search-id-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const pokemonId = document.getElementById("pokemon-id").value;
      searchPokemonById(pokemonId);
    });

  // Validación del campo de búsqueda por nombre
  document
    .getElementById("search-form")
    .addEventListener("submit", function (event) {
      const nameInput = document.getElementById("pokemon-name").value;
      if (/[\d]/.test(nameInput)) {
        alert("Por favor, ingresa solo letras para buscar por nombre.");
        event.preventDefault(); // Evita el envío del formulario
      }
    });

  // Función para buscar Pokémon por nombre
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

  // Función para buscar Pokémon por ID
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

  // Función para mostrar los detalles del Pokémon en el orden deseado
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

  // Función para filtrar Pokémon por tipo
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

  // Función para mostrar la imagen de bienvenida y botones de filtro al inicio
  function showWelcomeImage() {
    document.getElementById("welcome-image").style.display = "block";
  }

  // Función para reiniciar la página al estado inicial
  document.getElementById("reset-page").addEventListener("click", () => {
    document.getElementById("pokemon-name").value = "";
    document.getElementById("pokemon-id").value = ""; // Limpia el campo de búsqueda por ID
    document.getElementById("pokemon-list").innerHTML = "";
    showWelcomeImage();
  });
});

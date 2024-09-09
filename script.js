document.addEventListener("DOMContentLoaded", () => {
    showWelcomeImage(); // Display the welcome image when the page loads
  
    document
      .getElementById("search-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the form from submitting in the traditional way
        const pokemonName = document
          .getElementById("pokemon-name")
          .value.toLowerCase(); // Get the Pokémon name from the input and convert it to lowercase
        searchPokemon(pokemonName); // Call the function to search for Pokémon by name
      });
  
    document
      .getElementById("search-id-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the form from submitting in the traditional way
        const pokemonId = document.getElementById("pokemon-id").value; // Get the Pokémon ID from the input
        searchPokemonById(pokemonId); // Call the function to search for Pokémon by ID
      });
  
    document
      .getElementById("search-form")
      .addEventListener("submit", function (event) {
        const nameInput = document.getElementById("pokemon-name").value;
        if (/[\d]/.test(nameInput)) {
          alert("Por favor, ingresa solo letras para buscar por nombre."); // Alert user to enter only letters
          event.preventDefault(); // Prevent the form from submitting if there are numbers in the input
        }
      });
  
    async function searchPokemon(name) {
      const pokemonListContainer = document.getElementById("pokemon-list");
      pokemonListContainer.innerHTML = ""; // Clear the Pokémon list container
      document.getElementById("welcome-image").style.display = "none"; // Hide the welcome image
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`); // Fetch Pokémon data from the API
        if (response.ok) {
          const data = await response.json(); // Convert the response to JSON
          displayPokemon(data); // Display the Pokémon data on the page
        } else {
          pokemonListContainer.innerHTML = "<p>Pokémon no encontrado.</p>"; // Display a message if Pokémon is not found
        }
      } catch (error) {
        console.error("Error searching Pokémon:", error); // Log any errors that occur during the fetch
      }
    }
  
    async function searchPokemonById(id) {
      const pokemonListContainer = document.getElementById("pokemon-list");
      pokemonListContainer.innerHTML = ""; // Clear the Pokémon list container
      document.getElementById("welcome-image").style.display = "none"; // Hide the welcome image
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`); // Fetch Pokémon data by ID from the API
        if (response.ok) {
          const data = await response.json(); // Convert the response to JSON
          displayPokemon(data); // Display the Pokémon data on the page
        } else {
          pokemonListContainer.innerHTML = "<p>Pokémon no encontrado por ID.</p>"; // Display a message if Pokémon is not found by ID
        }
      } catch (error) {
        console.error("Error searching Pokémon by ID:", error); // Log any errors that occur during the fetch
      }
    }
  
    function displayPokemon(pokemon) {
      const pokemonCard = document.createElement("div"); // Create a new div element for the Pokémon card
      pokemonCard.className = "pokemon-card"; // Assign the "pokemon-card" class to the div
      pokemonCard.innerHTML = `
          <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2> <!-- Capitalize the first letter of the Pokémon name -->
          <p>ID: ${pokemon.id}</p> <!-- Display the Pokémon ID -->
          <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}"> <!-- Display the Pokémon image -->
          <p>Peso: ${pokemon.weight / 10} kg</p> <!-- Display the Pokémon weight in kg -->
          <p>Tipo: ${pokemon.types
            .map((typeInfo) => typeInfo.type.name)
            .join(", ")}</p> <!-- Display the Pokémon types, joined by a comma -->
      `;
      document.getElementById("pokemon-list").appendChild(pokemonCard); // Append the Pokémon card to the Pokémon list container
    }
  
    window.filterByType = async (type) => {
      const pokemonListContainer = document.getElementById("pokemon-list");
      pokemonListContainer.innerHTML = ""; // Clear the Pokémon list container
      document.getElementById("welcome-image").style.display = "none"; // Hide the welcome image
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`); // Fetch Pokémon data by type from the API
        if (response.ok) {
          const data = await response.json(); // Convert the response to JSON
          const pokemonPromises = data.pokemon.map((pokemonEntry) =>
            fetch(pokemonEntry.pokemon.url)
          ); // Create an array of promises to fetch each Pokémon
          const pokemonResponses = await Promise.all(pokemonPromises); // Wait for all fetches to complete
          const pokemonData = await Promise.all(
            pokemonResponses.map((response) => response.json())
          ); // Convert all responses to JSON
          pokemonData.forEach((pokemon) => displayPokemon(pokemon)); // Display each Pokémon on the page
        } else {
          pokemonListContainer.innerHTML =
            "<p>No Pokémon found for this type.</p>"; // Display a message if no Pokémon is found for this type
        }
      } catch (error) {
        console.error("Error filtering by type:", error); // Log any errors that occur during the fetch
      }
    };
  
    function showWelcomeImage() {
      document.getElementById("welcome-image").style.display = "block"; // Display the welcome image
    }
  
    document.getElementById("reset-page").addEventListener("click", () => {
      document.getElementById("pokemon-name").value = ""; // Clear the Pokémon name input
      document.getElementById("pokemon-id").value = ""; // Clear the Pokémon ID input
      document.getElementById("pokemon-list").innerHTML = ""; // Clear the Pokémon list container
      showWelcomeImage(); // Display the welcome image
    });
  });
  
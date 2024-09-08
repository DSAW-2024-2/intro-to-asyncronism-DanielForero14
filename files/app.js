document.addEventListener('DOMContentLoaded', () => {
    // Mostrar los botones de filtro y la imagen de bienvenida al cargar la página
    showWelcomeImage();

    // Manejar la entrada del formulario de búsqueda
    document.getElementById('search-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const pokemonName = document.getElementById('pokemon-name').value.toLowerCase();
        searchPokemon(pokemonName);
    });

    async function searchPokemon(name) {
        const pokemonListContainer = document.getElementById('pokemon-list');
        pokemonListContainer.innerHTML = '';
        document.getElementById('welcome-image').style.display = 'none';
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            if (response.ok) {
                const data = await response.json();
                displayPokemon(data);
            } else {
                pokemonListContainer.innerHTML = '<p>Pokémon no encontrado.</p>';
            }
        } catch (error) {
            console.error('Error searching Pokémon:', error);
        }
    }

    function displayPokemon(pokemon) {
        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'pokemon-card';
        pokemonCard.innerHTML = `
            <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <p>Peso: ${pokemon.weight / 10} kg</p> <!-- Mostrar peso en kg -->
            <p>Tipo: ${pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
        `;
        document.getElementById('pokemon-list').appendChild(pokemonCard);
    }

    // Función para filtrar por tipo
    window.filterByType = async (type) => {
        const pokemonListContainer = document.getElementById('pokemon-list');
        pokemonListContainer.innerHTML = '';
        document.getElementById('welcome-image').style.display = 'none';
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
            const data = await response.json();
            const promises = data.pokemon.map(pokemonEntry => fetch(pokemonEntry.pokemon.url).then(res => res.json()));
            const pokemonDetails = await Promise.all(promises);
            pokemonDetails.forEach(displayPokemon);
        } catch (error) {
            console.error('Error filtering Pokémon by type:', error);
        }
    };

    function showWelcomeImage() {
        document.getElementById('welcome-image').style.display = 'block';
        document.getElementById('pokemon-list').innerHTML = '';
    }
});

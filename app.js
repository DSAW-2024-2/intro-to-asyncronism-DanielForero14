document.getElementById('search-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const pokemonName = document.getElementById('pokemon-name').value.toLowerCase();
    const pokemonInfoContainer = document.getElementById('pokemon-info');
    pokemonInfoContainer.innerHTML = ''; // Clear previous results

    try {
        // Fetch basic pokemon data
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if (!response.ok) throw new Error('Pokemon not found');
        const data = await response.json();

        // Fetch pokemon species data
        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();

        // Fetch pokemon ability data
        const abilityResponse = await fetch(data.abilities[0].ability.url);
        const abilityData = await abilityResponse.json();

        // Display Pokemon data
        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card');
        pokemonCard.innerHTML = `
            <h2>${data.name}</h2>
            <img src="${data.sprites.front_default}" alt="${data.name}">
            <p>Weight: ${data.weight}</p>
            <p>Species: ${speciesData.name}</p>
            <p>First Ability: ${abilityData.name} - ${abilityData.effect_entries[0].short_effect}</p>
        `;
        pokemonInfoContainer.appendChild(pokemonCard);

    } catch (error) {
        pokemonInfoContainer.innerHTML = `<p>${error.message}</p>`;
    }
});

let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=1015";

  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon &&
      "detailsUrl" in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.log("Pokemon Not Found");
    }
  }

  function getAll() {
    return pokemonList;
  }

  // add pokemon item
  function addListItem(pokemon) {
    let pokedexList = document.querySelector(".pokemon-list");

    //Create <li>, btn and <img> elements
    let listItem = document.createElement("li");
    let listBtn = document.createElement("button");
    let btnImg = document.createElement("img");

    //Set button text to pokemon name
    listBtn.innerText = pokemon.name;
    listBtn.classList.add("pokemon-list__item");

    // pokemon button image
    btnImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

    //Append img to btn, btn to <li> and <li> to <ul>
    listBtn.appendChild(btnImg);
    listItem.appendChild(listBtn);
    pokedexList.appendChild(listItem);

    //Call btnListener() function
    btnListener(listBtn, pokemon);

    // suggestion based of text
    let nameList = document.getElementById("datalistOptions");
    let option = document.createElement("option");
    option.value = pokemon.name;
    nameList.appendChild(option);

    listBtn.setAttribute("id", pokemon.id);
  }

  // search pokedex functions

  function searchData(pokemonName) {
    let searchResult = "";
    searchResult = pokemonList.filter(
      (pokemon) => pokemon.name === pokemonName
    );

    searchResult.forEach(function (resultItem) {
      let result = document.getElementById("searchBtn");
      result.href = `${resultItem.id}`;

      const elementToScrollTo = document.getElementById(result.href);
      if (elementToScrollTo) {
        elementToScrollTo.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      }
    });
    if (searchResult.length === 0) {
      alert("Invalid Pokemon! Try Again");
    }
  }

  function clickSearch() {
    let searchBtn = document.getElementById("searchBtn");
    searchBtn.addEventListener("click", function () {
      let result = document.getElementById("searchBtn");
      result.href = "";
      let searchInput = document.getElementById("exampleDataList");
      searchData(searchInput.value.toLowerCase());
    });
  }

  // Pokemon modal
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      let modalContainer = document.querySelector("#modal-container");

      // Clear all modal content
      modalContainer.innerHTML = "";

      //Create modal
      let modal = document.createElement("div");
      modal.classList.add("pokemon-modal");

      //Add close btn
      let closeButton = document.createElement("button");
      closeButton.classList.add("modal-close");
      closeButton.innerText = "X";
      closeButton.addEventListener("click", hideModal);

      // Pokemon Name
      let modalName = document.createElement("h1");
      modalName.innerText = pokemon.name;

      // Pokemon Height
      let pokemonHeight = document.createElement("h3");
      pokemonHeight.innerText = "Height: ";

      let pokemonHeightValue = document.createElement("p");
      pokemonHeightValue.innerText = `${pokemon.height / 10} m`;

      // pokemon Type
      let pokemonType = document.createElement("h3");
      pokemonType.innerText = "Type:";

      let TypeValue = document.createElement("p");
      TypeValue.innerText = pokemon.types[0].type.name;
      // if there is second type
      let TypeValue2 = document.createElement("p");
      if (pokemon.types.length > 1) {
        TypeValue2.innerText = pokemon.types[1].type.name;
      } else {
        TypeValue2.innerText = "";
      }

      //Add img
      let modalImg = document.createElement("img");
      modalImg.src = pokemon.imageUrl;
      modalImg.classList.add("cardImg");
      // create <div> to hold img
      let imgCard = document.createElement("div");
      imgCard.classList.add("card");

      //Append the <img> to imgCard to cardHolder
      imgCard.appendChild(modalImg);

      // append modal content to div
      modal.appendChild(imgCard);
      modal.appendChild(closeButton);
      modal.appendChild(modalName);
      modal.appendChild(pokemonHeight);
      modal.appendChild(pokemonHeightValue);
      modal.appendChild(pokemonType);
      modal.appendChild(TypeValue);
      modal.appendChild(TypeValue2);

      modalContainer.appendChild(modal);

      modalContainer.classList.add("is-visible");

      // removes modal when clicking outside.
      modalContainer.addEventListener("click", (e) => {
        let target = e.target;
        if (target === modalContainer) {
          hideModal();
        }
      });
    });
  }

  function hideModal() {
    let modalContainer = document.getElementById("modal-container");
    modalContainer.classList.remove("is-visible");
  }

  //use ESC to close window
  window.addEventListener("keydown", (e) => {
    let modalContainer = document.querySelector("modal-container");
    if (e.key === "Escape" && modalContainer.classList.contains("is-visible")) {
      hideModal();
    }
  });

  //Button event listen to show pokemon details
  function btnListener(buttons, pokemon) {
    buttons.addEventListener("click", function () {
      showDetails(pokemon);
    });
  }

  //load list of pokemon from API
  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item, index) {
          let pokemon = {
            id: index + 1,
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  //load details for each pokemon selected
  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        item.imageUrl = details.sprites.other["official-artwork"].front_default;
        item.imageUrlBack = item.height = details.height;
        item.types = details.types;
        item.ability = details.ability;
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    showDetails: showDetails,
    loadDetails: loadDetails,
    clickSearch: clickSearch,
  };
})();

// forEach function to show all pokemon
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
  // Search function
  pokemonRepository.clickSearch();
});

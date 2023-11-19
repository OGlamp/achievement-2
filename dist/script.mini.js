let pokemonRepository = (function () {
  let e = [];
  function t(t) {
    "object" == typeof t && "name" in t && "detailsUrl" in t
      ? e.push(t)
      : console.log("Pokemon Not Found");
  }
  function n() {
    return e;
  }
  function i(e) {
    a(e).then(function () {
      let t = document.querySelector("#modal-container");
      t.innerHTML = "";
      let n = document.createElement("div");
      n.classList.add("pokemon-modal");
      let i = document.createElement("button");
      i.classList.add("modal-close"),
        (i.innerText = "X"),
        i.addEventListener("click", l);
      let a = document.createElement("h1");
      a.innerText = e.name;
      let o = document.createElement("h3");
      o.innerText = "Height: ";
      let r = document.createElement("p");
      r.innerText = `${e.height / 10} m`;
      let c = document.createElement("h3");
      c.innerText = "Type:";
      let d = document.createElement("p");
      d.innerText = e.types[0].type.name;
      let s = document.createElement("p");
      e.types.length > 1
        ? (s.innerText = e.types[1].type.name)
        : (s.innerText = "");
      let p = document.createElement("img");
      (p.src = e.imageUrl), p.classList.add("cardImg");
      let m = document.createElement("div");
      m.classList.add("card"),
        m.appendChild(p),
        n.appendChild(m),
        n.appendChild(i),
        n.appendChild(a),
        n.appendChild(o),
        n.appendChild(r),
        n.appendChild(c),
        n.appendChild(d),
        n.appendChild(s),
        t.appendChild(n),
        t.classList.add("is-visible"),
        t.addEventListener("click", (e) => {
          e.target === t && l();
        });
    });
  }
  function l() {
    document.getElementById("modal-container").classList.remove("is-visible");
  }
  function a(e) {
    return fetch(e.detailsUrl)
      .then(function (e) {
        return e.json();
      })
      .then(function (t) {
        (e.imageUrl = t.sprites.other["official-artwork"].front_default),
          (e.imageUrlBack = e.height = t.height),
          (e.types = t.types),
          (e.ability = t.ability);
      })
      .catch(function (e) {
        console.error(e);
      });
  }
  return (
    window.addEventListener("keydown", (e) => {
      let t = document.querySelector("modal-container");
      "Escape" === e.key && t.classList.contains("is-visible") && l();
    }),
    {
      add: t,
      getAll: n,
      addListItem: function e(t) {
        let n = document.querySelector(".pokemon-list"),
          l = document.createElement("li"),
          a = document.createElement("button"),
          o = document.createElement("img");
        (a.innerText = t.name),
          a.classList.add("pokemon-list__item"),
          (o.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${t.id}.png`),
          a.appendChild(o),
          l.appendChild(a),
          n.appendChild(l),
          (function e(t, n) {
            t.addEventListener("click", function () {
              i(n);
            });
          })(a, t);
        let r = document.getElementById("datalistOptions"),
          c = document.createElement("option");
        (c.value = t.name), r.appendChild(c), a.setAttribute("id", t.id);
      },
      loadList: function e() {
        return fetch("https://pokeapi.co/api/v2/pokemon/?limit=1015")
          .then(function (e) {
            return e.json();
          })
          .then(function (e) {
            e.results.forEach(function (e, n) {
              t({ id: n + 1, name: e.name, detailsUrl: e.url });
            });
          })
          .catch(function (e) {
            console.error(e);
          });
      },
      showDetails: i,
      loadDetails: a,
      clickSearch: function t() {
        document
          .getElementById("searchBtn")
          .addEventListener("click", function () {
            var t;
            document.getElementById("searchBtn").href = "";
            let n;
            (t = document
              .getElementById("exampleDataList")
              .value.toLowerCase()),
              (n = ""),
              (n = e.filter((e) => e.name === t)).forEach(function (e) {
                let t = document.getElementById("searchBtn");
                t.href = `${e.id}`;
                let n = document.getElementById(t.href);
                n && n.scrollIntoView({ block: "center", behavior: "smooth" });
              }),
              0 === n.length && alert("Invalid Pokemon! Try Again");
          });
      },
    }
  );
})();
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (e) {
    pokemonRepository.addListItem(e);
  }),
    pokemonRepository.clickSearch();
});

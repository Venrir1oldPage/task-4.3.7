const input = document.querySelector(".search");
const varsContainer = document.querySelector(".varsContainer");
const searchVariant = document.querySelector(".var");
const list = document.querySelector(".list");

function getData(inputValue) {
  return Promise.resolve().then(() => {
    return fetch(
      `https://api.github.com/search/repositories?q=${inputValue}&sort=stars&order=desc&page=1&per_page=5`
    ).then((response) => response.json());
  });
}

function onChange(e) {
  varsContainer.textContent = null;
  let value = e.target.value;
  if (value.length === 0) {
    varsContainer.textContent = null;
    return;
  }
  if (value === " ") return;
  getData(value)
    .then((data) => {
      const arr = data.items;
      for (let item of arr) {
        let objRes = {
          name: item.description,
          stars: item.stargazers_count,
          owner: item.owner.login,
        };
        createVar(objRes);
      }
    })
    .catch((err) => {
      let error = createEl("div", "error", err.description);
      input.insertAdjacentElement("afterend", error);
      console.log(err);
    });

  function createEl(tag, className, value) {
    const el = document.createElement(tag);
    el.classList.add(className);
    el.textContent = value;
    return el;
  }
}

onChange = debounce(onChange, 500);

input.addEventListener("keyup", onChange);

function debounce(fn, ms) {
  let timeout;
  return function () {
    const fnCall = () => {
      fn.apply(this, arguments);
    };
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, ms);
  };
}

function createEl(tag, className, value) {
  const el = document.createElement(tag);
  el.classList.add(className);
  el.textContent = value;
  return el;
}

function createVar(obj) {
  let searchVariant = createEl("div", "var", obj.name);

  if (searchVariant.textContent.length > 30) {
    searchVariant.textContent = searchVariant.textContent.slice(0, 30) + "...";
  }
  searchVariant.addEventListener("click", () => {
    createItem(obj);
    input.value = "";
    varsContainer.textContent = null;
  });
  varsContainer.insertAdjacentElement("beforeend", searchVariant);
}

function createItem(obj) {
  let item = createEl("li", "item"),
    info = createEl("div", "info"),
    btn = createEl("button", "del"),
    name = createEl("p", "info__data", "Name: " + obj.name),
    owner = createEl("p", "info__data", "Owner: " + obj.owner),
    stars = createEl("p", "info__data", "Stars: " + obj.stars);
  info.insertAdjacentElement("beforeend", name);
  info.insertAdjacentElement("beforeend", owner);
  info.insertAdjacentElement("beforeend", stars);
  item.insertAdjacentElement("beforeend", info);
  item.insertAdjacentElement("beforeend", btn);
  list.insertAdjacentElement("beforeend", item);

  if (name.textContent.length > 30) {
    name.textContent = item.textContent.slice(0, 30) + "...";
  }
  btn.addEventListener("click", function (e) {
    item.remove();
  });
}

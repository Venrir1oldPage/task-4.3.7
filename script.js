const input = document.querySelector(".search"); // для облегчения проверку добавила комменты к изменениям, выделила стили в отдельный файл, переименовала некоторые переменные
const outputContainer = document.querySelector(".outputContainer");
const list = document.querySelector(".list");

function getData(inputValue) {
  return Promise.resolve().then(() => {
    return fetch(
      `https://api.github.com/search/repositories?q=${inputValue}&sort=stars&order=desc&page=1&per_page=5`
    ).then((response) => response.json());
  });
}

function onChange(e) {
  outputContainer.textContent = null;
  let value = e.target.value;
  if (value.length === 0) {
    outputContainer.textContent = null;
    return;
  }
  if (!value.trim().length > 0) return; // поменяла условие
  getData(value)
    .then((data) => {
      const arr = data.items;
      for (let item of arr) {
        let repInfo = {
          name: item.name ? item.name : "неизвестно", //поменяла item.description на item.name но изначально был description потому что в поиске тогда выдавалось название репозитория с теми словами, которые вбиваются в поиске. с name названия в выдаче не всегда совпадают с тем, что ищешь
          stars: item.stargazers_count ? item.stargazers_count : "неизвестно",
          owner: item.owner.login ? item.name : "неизвестно",
        };
        createOutput(repInfo);
      }
    })
    .catch((err) => {
      console.log(err);
    });
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

function createElement(tag, className, value) {
  const el = document.createElement(tag);
  el.classList.add(className);
  el.textContent = value;
  return el;
}

function createOutput(obj) {
  let output = createElement("div", "output", obj.name);

  if (output.textContent.length > 30) {
    output.textContent = searchVariant.textContent.slice(0, 30) + "...";
  }
  output.addEventListener("click", function addToList() {
    createItem(obj);
    input.value = "";
    outputContainer.textContent = null;
    output.removeEventListener("click", addToList); //удалила обработчик 1
  });
  outputContainer.insertAdjacentElement("beforeend", output);
}

function createItem(obj) {
  let item = createElement("li", "item"),
    info = createElement("div", "info"),
    btn = createElement("button", "del"),
    name = createElement("p", "info__data", "Name: " + obj.name),
    owner = createElement("p", "info__data", "Owner: " + obj.owner),
    stars = createElement("p", "info__data", "Stars: " + obj.stars);
  info.insertAdjacentElement("beforeend", name);
  info.insertAdjacentElement("beforeend", owner);
  info.insertAdjacentElement("beforeend", stars);
  item.insertAdjacentElement("beforeend", info);
  item.insertAdjacentElement("beforeend", btn);
  list.insertAdjacentElement("beforeend", item);

  if (name.textContent.length > 30) {
    name.textContent = item.textContent.slice(0, 30) + "...";
  }
  btn.addEventListener("click", function removeItem() {
    item.remove();
    btn.removeEventListener("click", removeItem); //удалила обработчик 2
  });
}

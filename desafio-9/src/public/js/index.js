const socket = io();

const list = document.querySelector("#products");

socket.on("products", (data) => {
  list.innerHTML = "";
  data.forEach((product) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = product.title;
    list.appendChild(listItem);
  });
});

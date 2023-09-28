socket = io();

let user = "";

Swal.fire({
  title: "Write down your email",
  input: "text",
  confirmButtonText: "Submit",
}).then((result) => {
  user = result.value;
});

const box = document.querySelector("#box");
const content = document.querySelector("#content");

box.addEventListener("change", (e) => {
  socket.emit("message", {
    mail: user,
    message: e.target.value,
  });
});

socket.on("new_message", (data) => {
  const messages = data.map(({ mail, message }) => {
    return `<p>${mail} said: ${message}</p>`;
  });

  content.innerHTML = messages.join("");
});

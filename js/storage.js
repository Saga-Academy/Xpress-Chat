function getMessages() {
  return JSON.parse(localStorage.getItem("messages") || "[]");
}

function saveMessages(messages) {
  localStorage.setItem("messages", JSON.stringify(messages));
}

const emojis = ["😀","😂","😍","😎","😭","👍","❤️","🔥"];

emojiBtn.onclick = () => {
  picker.innerHTML = emojis.map(e =>
    `<span onclick="addEmoji('${e}')">${e}</span>`
  ).join("");
};

function addEmoji(e) {
  input.value += e;
}

let socket;
let username = "";
const userId = Math.random().toString(36).substring(2, 10);

window.startChat = function () {
  const input = document.getElementById("usernameInput");
  username = input.value.trim();

  if (!username) return;

  document.getElementById("usernamePage").classList.remove("active");
  document.getElementById("chatPage").classList.add("active");

  connectWebSocket();
};

function connectWebSocket() {
  socket = new WebSocket('ws://localhost:3000');

  socket.onopen = function () {
    const joinMsg = {
      type: "system",
      message: `${username} joined the chat`,
      userId: "system",
      timestamp: new Date().toLocaleTimeString()
    };
    socket.send(JSON.stringify(joinMsg));
  };

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    const messages = document.getElementById('messages');
    const li = document.createElement('li');

    const time = `<span style="font-size: 0.75em; color: #888;"> [${data.timestamp}]</span>`;

    if (data.type === "system") {
      li.textContent = data.message;
      li.style.textAlign = "center";
      li.style.fontStyle = "italic";
      li.style.color = "#666";
    } else {
      li.innerHTML = `<strong>${data.username}:</strong> ${data.message} ${time}`;
      li.classList.add('message');
      li.classList.add(data.userId === userId ? 'self' : 'other');
    }

    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
  };
}

window.sendMessage = function () {
  const input = document.getElementById('messageInput');
  const msg = input.value.trim();

  if (msg !== '') {
    const data = {
      type: "chat",
      message: msg,
      username: username,
      userId: userId,
      timestamp: new Date().toLocaleTimeString()
    };

    socket.send(JSON.stringify(data));
    input.value = '';
  }
};

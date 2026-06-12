/* ============================================
   MODERN CHAT APP — Frontend Logic
   ============================================ */

// ─── Parse URL params ───────────────────────────────────────────────
const params = new URLSearchParams(window.location.search);
const username = params.get("username");
const room = params.get("room");

// Redirect if no credentials
if (!username || !room) {
  window.location.href = "/";
}

// ─── DOM refs ────────────────────────────────────────────────────────
const messagesEl = document.getElementById("messages");
const messagesAreaEl = document.getElementById("messagesArea");
const messageInputEl = document.getElementById("messageInput");
const sendBtnEl = document.getElementById("sendBtn");
const locationBtnEl = document.getElementById("locationBtn");
const usersListEl = document.getElementById("usersList");
const userCountEl = document.getElementById("userCount");
const roomNameEl = document.getElementById("roomName");
const headerRoomNameEl = document.getElementById("headerRoomName");
const connectionStatusEl = document.getElementById("connectionStatus");
const headerStatusEl = document.getElementById("headerStatus");
const headerStatusTextEl = document.getElementById("headerStatusText");
const typingAreaEl = document.getElementById("typingArea");
const typingNameEl = document.getElementById("typingName");
const charCountEl = document.getElementById("charCount");
const toastContainerEl = document.getElementById("toastContainer");
const leaveBtnEl = document.getElementById("leaveBtn");
const sidebarEl = document.getElementById("sidebar");
const sidebarOverlayEl = document.getElementById("sidebarOverlay");
const menuToggleEl = document.getElementById("menuToggle");
const sidebarCloseEl = document.getElementById("sidebarClose");

// ─── State ────────────────────────────────────────────────────────────
let currentUsers = [];
let typingTimeout = null;
let isTyping = false;
let typingClearTimeout = null;
const MAX_CHARS = 500;

// ─── Socket.IO connection ─────────────────────────────────────────────
const socket = io();

// ─── Helpers ─────────────────────────────────────────────────────────

/**
 * Format timestamp to a readable time string
 */
function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Get initials from username (up to 2 chars)
 */
function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

/**
 * Generate a consistent hue for a username
 */
function userHue(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

/**
 * Escape HTML entities
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Check if the messages area is scrolled near the bottom
 */
function isNearBottom() {
  const { scrollTop, scrollHeight, clientHeight } = messagesAreaEl;
  return scrollHeight - scrollTop - clientHeight < 120;
}

/**
 * Scroll to the bottom of the messages area
 */
function scrollToBottom(force = false) {
  if (force || isNearBottom()) {
    messagesAreaEl.scrollTo({ top: messagesAreaEl.scrollHeight, behavior: "smooth" });
  }
}

/**
 * Show a toast notification
 */
function showToast(message, type = "info", duration = 4000) {
  const icons = { info: "fa-info-circle", error: "fa-exclamation-circle", success: "fa-check-circle" };
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${escapeHtml(message)}</span>`;
  toastContainerEl.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("removing");
    setTimeout(() => toast.remove(), 220);
  }, duration);
}

/**
 * Update the connection status UI
 */
function setConnectionStatus(state) {
  const statuses = {
    connected: { text: "Connected", cls: "connected" },
    disconnected: { text: "Disconnected", cls: "disconnected" },
    connecting: { text: "Connecting...", cls: "" },
  };
  const s = statuses[state] || statuses.connecting;

  connectionStatusEl.className = `connection-status ${s.cls}`;
  connectionStatusEl.querySelector(".status-text").textContent = s.text;

  headerStatusEl.className = `header-status ${s.cls}`;
  headerStatusTextEl.textContent = s.text;
}

/**
 * Render a single chat message bubble
 */
function appendMessage({ username: msgUser, text, createdAt }) {
  const isOwn = msgUser.toLowerCase() === username.toLowerCase();
  const item = document.createElement("div");
  item.className = `message-item ${isOwn ? "own" : ""}`;

  const hue = userHue(msgUser);
  const avatarStyle = isOwn
    ? ""
    : `background: linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${(hue + 40) % 360}, 70%, 60%));`;

  item.innerHTML = `
    <div class="msg-avatar" style="${avatarStyle}">${getInitials(msgUser)}</div>
    <div class="msg-content">
      <div class="msg-meta">
        <span class="msg-username">${escapeHtml(isOwn ? "You" : msgUser)}</span>
        <span class="msg-time">${formatTime(createdAt)}</span>
      </div>
      <div class="msg-bubble">${escapeHtml(text)}</div>
    </div>
  `;

  messagesEl.appendChild(item);
  scrollToBottom();
}

/**
 * Render a system/bot message
 */
function appendSystemMessage({ text }) {
  const item = document.createElement("div");
  item.className = "system-message";
  item.innerHTML = `<span class="system-bubble"><i class="fas fa-robot"></i>${escapeHtml(text)}</span>`;
  messagesEl.appendChild(item);
  scrollToBottom();
}

/**
 * Render a location message
 */
function appendLocationMessage({ username: msgUser, url, createdAt }) {
  const isOwn = msgUser.toLowerCase() === username.toLowerCase();
  const item = document.createElement("div");
  item.className = `message-item ${isOwn ? "own" : ""}`;

  const hue = userHue(msgUser);
  const avatarStyle = isOwn
    ? ""
    : `background: linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${(hue + 40) % 360}, 70%, 60%));`;

  item.innerHTML = `
    <div class="msg-avatar" style="${avatarStyle}">${getInitials(msgUser)}</div>
    <div class="msg-content">
      <div class="msg-meta">
        <span class="msg-username">${escapeHtml(isOwn ? "You" : msgUser)}</span>
        <span class="msg-time">${formatTime(createdAt)}</span>
      </div>
      <a href="${url}" target="_blank" rel="noopener noreferrer" class="location-link">
        <i class="fas fa-map-marker-alt"></i> View location on Google Maps
      </a>
    </div>
  `;

  messagesEl.appendChild(item);
  scrollToBottom();
}

/**
 * Render the users list in the sidebar
 */
function renderUsers(users) {
  currentUsers = users;
  userCountEl.textContent = users.length;
  usersListEl.innerHTML = "";

  users.forEach((user) => {
    const isMe = user.username === username.trim().toLowerCase();
    const hue = userHue(user.username);
    const li = document.createElement("li");
    li.className = "user-item";
    li.innerHTML = `
      <div class="user-avatar" style="background: linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${(hue + 40) % 360}, 70%, 60%));">
        ${getInitials(user.username)}
      </div>
      <span class="user-name ${isMe ? "is-you" : ""}">${escapeHtml(user.username)}</span>
    `;
    usersListEl.appendChild(li);
  });
}

/**
 * Show the empty state hint
 */
function showEmptyState() {
  if (messagesEl.children.length === 0) {
    const el = document.createElement("div");
    el.className = "empty-state";
    el.id = "emptyState";
    el.innerHTML = `
      <i class="fas fa-comments"></i>
      <h3>No messages yet</h3>
      <p>Be the first to say something in <strong>#${escapeHtml(room.trim().toLowerCase())}</strong>!</p>
    `;
    messagesEl.appendChild(el);
  }
}

/**
 * Remove the empty state hint
 */
function removeEmptyState() {
  const el = document.getElementById("emptyState");
  if (el) el.remove();
}

// ─── Send message ─────────────────────────────────────────────────────
function sendMessage() {
  const text = messageInputEl.value.trim();
  if (!text) return;

  socket.emit("sendMessage", text, (error) => {
    if (error) showToast(error, "error");
  });

  messageInputEl.value = "";
  messageInputEl.style.height = "auto";
  charCountEl.textContent = MAX_CHARS;
  charCountEl.className = "char-count";
  stopTyping();
  messageInputEl.focus();
}

// ─── Typing indicators ────────────────────────────────────────────────
function startTyping() {
  if (!isTyping) {
    isTyping = true;
    socket.emit("typing");
  }
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(stopTyping, 2500);
}

function stopTyping() {
  if (isTyping) {
    isTyping = false;
    socket.emit("stopTyping");
  }
  clearTimeout(typingTimeout);
}

// ─── Sidebar toggle ───────────────────────────────────────────────────
function openSidebar() {
  sidebarEl.classList.add("open");
  sidebarOverlayEl.classList.add("open");
}

function closeSidebar() {
  sidebarEl.classList.remove("open");
  sidebarOverlayEl.classList.remove("open");
}

// ─── Event listeners ──────────────────────────────────────────────────

// Textarea auto-resize + char count
messageInputEl.addEventListener("input", () => {
  const len = messageInputEl.value.length;
  const remaining = MAX_CHARS - len;
  charCountEl.textContent = remaining;
  charCountEl.className = remaining < 50 ? "char-count danger" : remaining < 100 ? "char-count warn" : "char-count";

  // Auto-resize
  messageInputEl.style.height = "auto";
  messageInputEl.style.height = Math.min(messageInputEl.scrollHeight, 140) + "px";

  if (len > 0) startTyping();
  else stopTyping();
});

// Keyboard shortcuts
messageInputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + L → share location
  if ((e.ctrlKey || e.metaKey) && e.key === "l") {
    e.preventDefault();
    shareLocation();
  }
  // Escape → close sidebar on mobile
  if (e.key === "Escape") closeSidebar();
});

sendBtnEl.addEventListener("click", sendMessage);

locationBtnEl.addEventListener("click", shareLocation);

leaveBtnEl.addEventListener("click", () => {
  window.location.href = "/";
});

menuToggleEl.addEventListener("click", openSidebar);
sidebarCloseEl.addEventListener("click", closeSidebar);
sidebarOverlayEl.addEventListener("click", closeSidebar);

// ─── Location sharing ─────────────────────────────────────────────────
function shareLocation() {
  if (!navigator.geolocation) {
    showToast("Geolocation is not supported by your browser.", "error");
    return;
  }

  locationBtnEl.disabled = true;
  locationBtnEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      socket.emit(
        "sendLocation",
        { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
        (error) => {
          if (error) showToast(error, "error");
          else showToast("Location shared!", "success", 2500);
        }
      );
      locationBtnEl.disabled = false;
      locationBtnEl.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
    },
    () => {
      showToast("Unable to retrieve your location. Check browser permissions.", "error");
      locationBtnEl.disabled = false;
      locationBtnEl.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
    }
  );
}

// ─── Socket events ────────────────────────────────────────────────────

socket.on("connect", () => {
  setConnectionStatus("connected");

  // Join the room
  socket.emit("join", { username: username.trim(), room: room.trim() }, (error) => {
    if (error) {
      showToast(error, "error", 6000);
      setTimeout(() => (window.location.href = "/"), 3000);
    }
  });
});

socket.on("disconnect", () => {
  setConnectionStatus("disconnected");
  showToast("Connection lost. Trying to reconnect...", "error");
});

socket.on("reconnect", () => {
  setConnectionStatus("connected");
  showToast("Reconnected!", "success", 2000);
});

socket.on("message", (message) => {
  removeEmptyState();
  const isBotMessage =
    message.username === "ChatBot" ||
    message.username.toLowerCase() === "chatbot";

  if (isBotMessage) {
    appendSystemMessage(message);
  } else {
    appendMessage(message);
  }
});

socket.on("locationMessage", (message) => {
  removeEmptyState();
  appendLocationMessage(message);
});

socket.on("roomData", ({ room: roomName, users }) => {
  const displayRoom = roomName.toUpperCase();
  roomNameEl.textContent = displayRoom;
  headerRoomNameEl.textContent = roomName.toLowerCase();
  document.title = `#${roomName.toLowerCase()} — Modern Chat`;
  renderUsers(users);

  // Show empty state if no messages yet
  if (messagesEl.children.length === 0) showEmptyState();
});

// Typing events
socket.on("userTyping", ({ username: typingUser }) => {
  typingNameEl.textContent = typingUser;
  typingAreaEl.style.display = "block";

  clearTimeout(typingClearTimeout);
  typingClearTimeout = setTimeout(() => {
    typingAreaEl.style.display = "none";
  }, 3000);
});

socket.on("userStopTyping", () => {
  typingAreaEl.style.display = "none";
  clearTimeout(typingClearTimeout);
});

// ─── Init ─────────────────────────────────────────────────────────────
setConnectionStatus("connecting");
roomNameEl.textContent = room.trim().toUpperCase();
headerRoomNameEl.textContent = room.trim().toLowerCase();
document.title = `#${room.trim().toLowerCase()} — Modern Chat`;
messageInputEl.focus();

// ─── iOS Safari viewport fix ──────────────────────────────────────────
// iOS Safari in portrait mode has an unreliable viewport height because
// of the address bar. We measure the real inner height and set a CSS var.
function setAppHeight() {
  const h = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  document.documentElement.style.setProperty("--app-height", h + "px");
}

setAppHeight();
window.addEventListener("resize", setAppHeight);

// visualViewport fires when the keyboard appears/disappears on iOS
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", () => {
    setAppHeight();
    // When keyboard is open, scroll messages to bottom so input stays visible
    setTimeout(() => scrollToBottom(true), 100);
  });
}

// ─── iOS send button: use touchend to avoid 300ms click delay ─────────
sendBtnEl.addEventListener("touchend", (e) => {
  e.preventDefault(); // prevent the ghost click that follows
  sendMessage();
});

# NexSync

> Real-time messaging, synchronized instantly across every device.

NexSync is a full-stack chat application built with **Node.js**, **Express**, and **Socket.IO**. It delivers low-latency, bidirectional communication through WebSockets — no polling, no delays. Users join named rooms, exchange messages in real time, and see live presence updates the moment someone enters or leaves.

---

## Preview

```
https://nexsync-7jcc.onrender.com/
```

> Two devices. One URL. No setup required for end users.

---

## Features

- **Real-time messaging** — WebSocket-powered delivery with zero perceptible lag
- **Multi-room support** — Isolated chat rooms created on demand
- **Live presence** — See who joins and leaves in real time
- **Typing indicators** — Animated feedback when another user is composing
- **Location sharing** — Share your coordinates as a Google Maps link
- **Auto-reconnect** — Graceful recovery on dropped connections
- **Responsive UI** — Works across desktop, tablet, and mobile
- **No account required** — Just a username and a room name

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Real-time | Socket.IO (WebSocket) |
| Frontend | Vanilla JS, HTML5, CSS3 |
| Fonts | Inter (Google Fonts) |
| Icons | Font Awesome |
| Deployment | Render.com |

---

## Project Structure

```
nexsync/
├── src/
│   ├── index.js              # Express server + Socket.IO event handlers
│   └── utils/
│       ├── messages.js       # Message object factory
│       └── user.js           # In-memory user registry
├── public/
│   ├── index.html            # Join / landing page
│   ├── chat.html             # Chat interface
│   ├── css/
│   │   └── styles.css        # Full design system
│   └── js/
│       └── chat.js           # Frontend Socket.IO logic
├── .env                      # Environment variables
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- npm (included with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/nexsync.git
cd nexsync

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in your browser
# http://localhost:3000
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
HOST=0.0.0.0
```

---

## Usage

1. Open the app URL in your browser
2. Enter a username and a room name
3. Click **Join Chat** — the room is created automatically if it doesn't exist
4. Share the same URL + room name with anyone you want to chat with

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Enter` | Send message |
| `Shift + Enter` | New line |
| `Ctrl / Cmd + L` | Share your location |
| `Escape` | Close sidebar (mobile) |

---

## Deployment

NexSync is configured for one-click deployment on [Render.com](https://render.com).

### Deploy to Render

1. Push your code to a GitHub repository
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your repository and set the following:

| Setting | Value |
|---|---|
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | Free |

4. Click **Deploy** — Render will provide a public URL

The `PORT` environment variable is automatically injected by Render and handled in `src/index.js`.

---

## Socket Events

| Event | Direction | Description |
|---|---|---|
| `join` | Client → Server | Join a room with username |
| `sendMessage` | Client → Server | Send a text message |
| `sendLocation` | Client → Server | Send geolocation coordinates |
| `typing` | Client → Server | Notify others of typing start |
| `stopTyping` | Client → Server | Notify others of typing stop |
| `message` | Server → Client | Receive a chat message |
| `locationMessage` | Server → Client | Receive a location message |
| `roomData` | Server → Client | Updated room + user list |
| `userTyping` | Server → Client | Another user started typing |
| `userStopTyping` | Server → Client | Another user stopped typing |

---

## Roadmap

- [ ] Persistent message history (MongoDB / Redis)
- [ ] Private direct messaging
- [ ] File and image sharing
- [ ] User authentication (JWT)
- [ ] Message reactions
- [ ] Push notifications

---

## Contributing

Contributions are welcome.

```bash
# Fork the repository, then:
git checkout -b feature/your-feature-name
git commit -m "Add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

Please keep commits focused and PRs scoped to a single feature or fix.

---

## License

MIT © 2025 — see [LICENSE](LICENSE) for details.

---

## Acknowledgements

- [Socket.IO](https://socket.io/) — WebSocket abstraction layer
- [Express.js](https://expressjs.com/) — Minimal Node.js web framework
- [Inter](https://rsms.me/inter/) — UI typeface
- [Font Awesome](https://fontawesome.com/) — Icon library
- [Render](https://render.com/) — Hosting platform

---

<p align="center">Built with Node.js and Socket.IO</p>

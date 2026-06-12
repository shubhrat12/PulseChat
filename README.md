# PulseChat

**The heartbeat of real-time conversation.**

PulseChat is an open-source, full-stack real-time messaging application built with **Node.js**, **Express.js**, and **Socket.IO**.

It allows users to join chat rooms instantly, send messages in real time, view live user presence, share locations, and see typing indicators without creating an account or refreshing the page.

---

## Overview

PulseChat lets users start conversations instantly from any device.

A user enters a username, joins a room, and can immediately chat with anyone else in the same room. Rooms are created automatically, and all communication happens in real time using WebSockets through Socket.IO.

The project is designed to be simple, readable, and easy to extend. It is a good foundation for learning real-time communication, WebSocket architecture, and full-stack JavaScript development.

---

## Features

| Feature | Description |
|---|---|
| Real-time messaging | Messages are delivered instantly using Socket.IO |
| Chat rooms | Users can create or join named rooms |
| Live presence | Active users are shown in each room |
| Typing indicators | Users can see when someone else is typing |
| Location sharing | Users can share their location as a Google Maps link |
| Auto-reconnect | Socket.IO handles reconnection after network drops |
| Responsive design | Works on desktop, tablet, and mobile |
| No authentication required | Users only need a username and room name |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Server framework | Express.js |
| Real-time communication | Socket.IO |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Styling | Custom CSS |
| Icons | Font Awesome |
| Fonts | Inter |
| Hosting | Render, Railway, or any Node.js hosting platform |

---

## Project Structure

```bash
pulsechat/
├── src/
│   ├── index.js
│   └── utils/
│       ├── messages.js
│       └── user.js
├── public/
│   ├── index.html
│   ├── chat.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── chat.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## Folder Description

| Path | Description |
|---|---|
| `src/index.js` | Main server file that configures Express and Socket.IO |
| `src/utils/messages.js` | Creates message and location message objects |
| `src/utils/user.js` | Manages users and rooms in memory |
| `public/index.html` | Join page where users enter username and room |
| `public/chat.html` | Main chat interface |
| `public/css/styles.css` | Application styling and responsive layout |
| `public/js/chat.js` | Client-side Socket.IO logic |

---

## Getting Started

### Prerequisites

Make sure Node.js and npm are installed.

```bash
node -v
npm -v
```

Recommended:

```bash
Node.js 18+
npm 9+
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/pulsechat.git
cd pulsechat
```

Install dependencies:

```bash
npm install
```

---

## Running Locally

Start the development server:

```bash
npm run dev
```

Or start the production server:

```bash
npm start
```

Open the app in your browser:

```bash
http://localhost:3000
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
HOST=0.0.0.0
```

If no `.env` file is provided, the application uses port `3000` by default.

---

## Usage

1. Open the application in your browser.
2. Enter a username.
3. Enter a room name.
4. Click **Join Chat**.
5. Share the same room name with another user.
6. Start chatting in real time.

Rooms are created automatically when users join them.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Enter` | Send a message |
| `Shift + Enter` | Add a new line |
| `Ctrl + L` | Share location on Windows/Linux |
| `Cmd + L` | Share location on macOS |
| `Escape` | Close sidebar on mobile |

---

## Socket.IO Events

PulseChat uses Socket.IO events to communicate between the client and server.

---

## Client to Server Events

| Event | Payload | Description |
|---|---|---|
| `join` | `{ username, room }` | Adds a user to a chat room |
| `sendMessage` | `message: string` | Sends a text message to the room |
| `sendLocation` | `{ latitude, longitude }` | Sends a location message to the room |
| `typing` | None | Notifies others that the user is typing |
| `stopTyping` | None | Notifies others that the user stopped typing |

---

## Server to Client Events

| Event | Payload | Description |
|---|---|---|
| `message` | `{ username, text, createdAt }` | Sends a text message to clients |
| `locationMessage` | `{ username, url, createdAt }` | Sends a location link to clients |
| `roomData` | `{ room, users }` | Sends updated room and user data |
| `userTyping` | `{ username }` | Shows typing status for a user |
| `userStopTyping` | `{ username }` | Removes typing status for a user |

---

## Deployment

PulseChat can be deployed on any platform that supports Node.js applications.

Common options include:

- Render
- Railway
- Fly.io
- Heroku
- DigitalOcean
- AWS
- Google Cloud
- Azure

---

## Deploying on Render

1. Push the project to GitHub.
2. Log in to Render.
3. Create a new Web Service.
4. Connect your GitHub repository.
5. Use the following settings:

| Setting | Value |
|---|---|
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | Free or paid plan |

6. Deploy the service.

Render will generate a public URL after deployment.

---

## Roadmap

Planned improvements:

- Message persistence with MongoDB or Redis
- Private direct messaging
- Image and file sharing
- User authentication with JWT
- Message reactions
- Emoji support
- Read receipts
- Push notifications
- Admin room controls
- User avatars
- Message search
- Online/offline status
- Rate limiting and spam protection

---

## Future Improvements

Possible production-level upgrades:

- Store messages in MongoDB or PostgreSQL
- Store active sessions in Redis
- Add JWT-based authentication
- Add input validation and sanitization
- Add rate limiting for socket events
- Add unit and integration tests
- Add Docker support
- Add CI/CD using GitHub Actions
- Add structured logging
- Add error monitoring
- Add horizontal scaling with the Socket.IO Redis adapter

---

## Contributing

Contributions are welcome.

To contribute:

```bash
# Fork the repository

# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes

# Commit your changes
git commit -m "feat: add your feature description"

# Push your branch
git push origin feature/your-feature-name
```

Then open a pull request.

Please keep pull requests focused on a single feature, fix, or improvement.

---

## License

This project is licensed under the MIT License.

See the `LICENSE` file for more details.

---

## Acknowledgements

PulseChat uses the following technologies:

- Node.js
- Express.js
- Socket.IO
- Font Awesome
- Inter Typeface

---

## Summary

PulseChat is a simple, fast, and responsive real-time chat application built with Node.js and Socket.IO.

It demonstrates the core ideas behind modern messaging systems:

- Real-time communication
- Room-based chat
- Live user presence
- Typing indicators
- Location sharing
- Responsive frontend design

The project is lightweight, easy to understand, and ready to be extended into a more advanced chat platform.

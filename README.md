# 🤖 AI Chatbot

AI-powered chatbot with conversation memory, built with Node.js and Groq API.

![Node.js](https://img.shields.io/badge/Node.js-24.13.0-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3-F55036?style=flat)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat)

## About

A chatbot backend with AI-generated responses and per-session conversation memory.
Built as a portfolio project to demonstrate Node.js API development and LLM integration.

The bot remembers the conversation context within a session, has a configurable
personality via system prompt, and includes rate limiting to protect the API key
in public demos.

## Features

- Natural language responses in Brazilian Portuguese
- Conversation memory per session (stored with lowdb)
- Configurable bot name and personality via environment variables
- Session rate limiting to prevent API key abuse
- Ready to connect to any chat frontend

## Tech Stack

| Layer     | Technology       |
| --------- | ---------------- |
| Runtime   | Node.js 18+      |
| Framework | Express.js       |
| AI Model  | LLaMA 3.3 (Groq) |
| Database  | lowdb (JSON)     |

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Taylordossantos/AI-Chatbot.git
cd AI-chatbot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your Groq API key.
You can get a free key at: https://console.groq.com

### 4. Start the server

```bash
# Development (auto-restarts on save)
npm run dev

# Production
npm start
```

Server runs at `http://localhost:3000`.

## API Endpoints

### `POST /api/chat`

Sends a message and returns the bot's response.

**Request:**

```json
{
  "sessionId": "user-123",
  "message": "Hello, who are you?"
}
```

**Response:**

```json
{
  "reply": "Hi! I'm Aria, a virtual assistant..."
}
```

### `POST /api/clear`

Clears the conversation history for a session.

**Request:**

```json
{
  "sessionId": "user-123"
}
```

### `GET /health`

Returns server status.

## Project Structure

```
src/
├── server.js              # Entry point
├── routes/
│   └── chat.js            # API endpoints
├── services/
│   ├── ai.js              # Groq API integration
│   └── database.js        # Conversation history (lowdb)
└── middleware/
    └── sessionLimit.js    # Per-session rate limiting
```

## License

MIT

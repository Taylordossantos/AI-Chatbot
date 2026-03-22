# 🤖 AI Chatbot

AI-powered chatbot with conversation memory, knowledge base support and human handoff, built with Node.js and Groq API.

![Node.js](https://img.shields.io/badge/Node.js-24.13.0-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3-F55036?style=flat)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat)

## Live Demo

👉 [Try it here](https://ai-chatbot-production-5cff.up.railway.app)

## About

A chatbot backend with AI-generated responses, per-session conversation memory, customizable knowledge base and human handoff detection. Built as a portfolio project to demonstrate Node.js API development and LLM integration.

## Features

- 🧠 Natural language responses in Brazilian Portuguese
- 💾 Conversation memory per session
- 📋 Customizable knowledge base — paste any business information and the bot uses it to answer questions
- 🔄 Human handoff detection — recognizes when the user wants to talk to a real person
- 🎭 Three attendance modes: virtual store, medical clinic and general assistant
- 🛡️ Session rate limiting to protect the API key in public demos

## Tech Stack

| Layer     | Technology       |
| --------- | ---------------- |
| Runtime   | Node.js 24+      |
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
  "message": "What are your opening hours?",
  "mode": "store",
  "knowledge": "Opening hours: Mon-Fri 9am to 6pm"
}
```

**Response:**

```json
{
  "reply": "Our opening hours are Monday to Friday, 9am to 6pm!",
  "handoff": false
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

## How the Knowledge Base Works

The knowledge base allows the bot to answer questions based on custom business information. Just paste any text — menu items, pricing, policies, FAQs — and the bot will use it to respond accurately.

Example input:

```
Restaurant hours: Mon-Fri 11am to 10pm
Menu: Margherita Pizza $12, Pepperoni Pizza $14
Free delivery on orders over $30
```

The bot will then answer questions like "What's on the menu?" or "Do you deliver?" based on this information.

## How Human Handoff Works

The bot detects keywords like "talk to an agent", "human", "real person" and automatically triggers a handoff message, locking the chat input to simulate a real transfer to a human attendant.

## Project Structure

```
src/
├── server.js              # Entry point
├── routes/
│   └── chat.js            # API endpoints
├── services/
│   ├── ai.js              # Groq API integration and handoff detection
│   └── database.js        # Conversation history (lowdb)
└── middleware/
    └── sessionLimit.js    # Per-session rate limiting
```

## License

MIT

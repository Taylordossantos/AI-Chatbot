/**
 * server.js
 *
 * Entry point da aplicação.
 * Configura o Express, registra os middlewares e sobe o servidor.
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Libera requisições do frontend para acessar a API.
// Em produção, troque '*' pelo domínio da sua aplicação
app.use(cors({ origin: "*" }));

app.use(express.json());

app.use("/api", chatRoutes);

// Útil para verificar se o servidor está no ar
app.get("/health", (req, res) => {
  res.json({ status: "ok", bot: process.env.BOT_NAME || "Aria" });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`   Bot: ${process.env.BOT_NAME || "Aria"}`);
  console.log(
    `   Limite por sessão: ${process.env.MAX_MESSAGES_PER_SESSION || 20} mensagens`,
  );
});

/**
 * chat.js
 *
 * Define os endpoints da API:
 * - POST /api/chat  → recebe mensagem e retorna resposta do bot
 * - POST /api/clear → apaga o histórico de uma sessão
 */

import { Router } from "express";
import { chat } from "../services/ai.js";
import { getHistory, saveMessage, clearHistory } from "../services/database.js";
import { sessionLimitGuard } from "../middleware/sessionLimit.js";

const router = Router();

/**
 * POST /api/chat
 *
 * @body {string} sessionId - ID único da sessão (gerado no frontend)
 * @body {string} message   - Mensagem enviada pelo usuário
 * @body {string} mode      - Modo da conversa: 'store' | 'clinic' | 'general'
 *
 * Fluxo:
 * 1. Busca o histórico da sessão no banco
 * 2. Adiciona a nova mensagem ao histórico
 * 3. Manda o histórico completo para o Groq
 * 4. Salva as duas mensagens (user + assistant) no banco
 * 5. Retorna a resposta
 */
router.post("/chat", sessionLimitGuard, async (req, res) => {
  const { sessionId, message, mode } = req.body;

  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "Mensagem não pode ser vazia" });
  }

  // Evita mensagens gigantes que aumentariam o custo da requisição
  if (message.length > 1000) {
    return res
      .status(400)
      .json({ error: "Mensagem muito longa (máx. 1000 caracteres)" });
  }

  try {
    const history = getHistory(sessionId);
    const updatedHistory = [
      ...history,
      { role: "user", content: message.trim() },
    ];

    const reply = await chat(updatedHistory, mode);

    await saveMessage(sessionId, "user", message.trim());
    await saveMessage(sessionId, "assistant", reply);

    res.json({ reply });
  } catch (err) {
    console.error("[chat error]", err.message);
    res
      .status(500)
      .json({ error: "Erro ao processar mensagem. Tente novamente." });
  }
});

/**
 * POST /api/clear
 *
 * @body {string} sessionId - ID da sessão a ser limpa
 *
 * Chamado quando o usuário clica em "Nova conversa" no frontend.
 */
router.post("/clear", async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "sessionId é obrigatório" });
  }

  await clearHistory(sessionId);
  res.json({ ok: true });
});

export default router;

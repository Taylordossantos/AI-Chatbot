/**
 * sessionLimit.js
 *
 * Bloqueia sessões que ultrapassaram o limite de mensagens.
 * Necessário para proteger a API key em uma demo pública —
 * sem isso, qualquer pessoa poderia esgotar os créditos.
 */

import { countUserMessages } from "../services/database.js";

const MAX_MESSAGES = parseInt(process.env.MAX_MESSAGES_PER_SESSION || "20");

/**
 * Middleware que verifica se a sessão ainda está dentro do limite.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function sessionLimitGuard(req, res, next) {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "sessionId é obrigatório" });
  }

  const count = countUserMessages(sessionId);

  if (count >= MAX_MESSAGES) {
    return res.status(429).json({
      error: "limite_atingido",
      message: `Sessão de demonstração encerrada após ${MAX_MESSAGES} mensagens. Inicie uma nova conversa.`,
    });
  }

  next();
}

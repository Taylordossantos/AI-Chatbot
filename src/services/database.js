/**
 * database.js
 *
 * Cuida de salvar e buscar o histórico de conversas por sessão.
 */

import { JSONFilePreset } from "lowdb/node";

// Carrega o db.json ou cria do zero se não existir.
// O db.json está no .gitignore — dados de teste não sobem pro GitHub.
const db = await JSONFilePreset("db.json", { messages: [] });

/**
 * Retorna as últimas mensagens de uma sessão, prontas para mandar ao Claude.
 *
 * @param {string} sessionId - ID da sessão (gerado no frontend)
 * @param {number} limit - Quantas mensagens buscar (padrão: 20)
 * @returns {Array<{role: string, content: string}>}
 *
 * O limite existe por dois motivos práticos: custo e velocidade.
 * Contextos longos custam mais tokens e deixam a resposta mais lenta.
 * O .slice(-limit) pega sempre as mais recentes, descartando as antigas.
 */
export function getHistory(sessionId, limit = 20) {
  const messages = db.data.messages
    .filter((m) => m.sessionId === sessionId)
    .slice(-limit);

  // Claude só precisa de role e content.
  // sessionId e createdAt são campos internos — não enviamos.
  return messages.map(({ role, content }) => ({ role, content }));
}

/**
 * Salva uma mensagem no histórico.
 *
 * @param {string} sessionId - ID da sessão
 * @param {'user' | 'assistant'} role - Quem mandou
 * @param {string} content - O texto da mensagem
 *
 * Salvamos tanto a mensagem do usuário quanto a resposta do bot.
 * Sem isso, o Claude não teria contexto nenhum na próxima pergunta.
 */
export async function saveMessage(sessionId, role, content) {
  db.data.messages.push({
    sessionId,
    role,
    content,
    createdAt: new Date().toISOString(),
  });

  // db.write() grava no arquivo de verdade.
  // Sem ele, tudo fica só na memória e some quando o servidor reinicia.
  await db.write();
}

/**
 * Conta quantas mensagens o usuário mandou na sessão.
 *
 * @param {string} sessionId - ID da sessão
 * @returns {number}
 *
 * O middleware sessionLimit.js usa isso para bloquear sessões que
 * passaram do limite definido em MAX_MESSAGES_PER_SESSION.
 * Só contamos mensagens do usuário — as respostas do bot não entram.
 */
export function countUserMessages(sessionId) {
  return db.data.messages.filter(
    (m) => m.sessionId === sessionId && m.role === "user",
  ).length;
}

/**
 * Apaga o histórico de uma sessão.
 *
 * @param {string} sessionId - ID da sessão
 *
 * Chamado quando o usuário clica em "Nova conversa".
 * Remove só as mensagens dessa sessão — o resto fica intocado.
 */
export async function clearHistory(sessionId) {
  db.data.messages = db.data.messages.filter((m) => m.sessionId !== sessionId);

  await db.write();
}

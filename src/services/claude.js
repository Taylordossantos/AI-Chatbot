/**
 * claude.js
 *
 * Cuida da comunicação com a API da Anthropic.
 * É aqui que definimos a personalidade do bot e enviamos
 * o histórico da conversa para gerar a resposta.
 */

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const BOT_NAME = process.env.BOT_NAME || "Aria";
const BOT_PERSONA =
  process.env.BOT_PERSONA || "uma assistente virtual simpática e profissional";

/**
 * System prompt — define quem o bot é e como ele se comporta.
 *
 * Esse texto é enviado em toda requisição, mas nunca aparece
 * para o usuário. Mudar ele é suficiente para transformar
 * completamente o comportamento do bot.
 */
function buildSystemPrompt() {
  return `Você é ${BOT_NAME}, ${BOT_PERSONA}.

Você está sendo exibido como demonstração de bot de atendimento com IA
no portfólio de um desenvolvedor.

REGRAS:
- Responda sempre em português brasileiro
- Seja cordial, objetivo e útil
- Mantenha respostas curtas — estamos num chat, não num e-mail
- Use emojis com moderação
- Se perguntarem como o projeto foi feito, explique: Node.js,
  API Claude da Anthropic e lowdb para memória de conversas
- Nunca invente informações, preços ou dados de empresas reais
- Deixe claro quando necessário que é uma demo`;
}

/**
 * Envia o histórico da conversa para o Claude e retorna a resposta.
 *
 * @param {Array<{role: string, content: string}>} history - Histórico completo da sessão
 * @returns {Promise<string>} - Texto da resposta gerada
 *
 * Mandamos o histórico inteiro a cada requisição porque o Claude
 * não guarda estado entre chamadas — cada request é independente.
 * A memória da conversa existe aqui no backend, não na API.
 */
export async function chat(history) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: buildSystemPrompt(),
    messages: history,
  });

  return response.content[0].text;
}

/**
 * ai.js
 *
 * Cuida da comunicação com a API da Groq.
 * É aqui que definimos a personalidade do bot e enviamos
 * o histórico da conversa para gerar a resposta.
 */

import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const BOT_NAME = process.env.BOT_NAME || "Aria";

/**
 * System prompts por modo.
 *
 * Cada modo define um contexto diferente para o bot.
 * Trocar o system prompt é suficiente para mudar completamente
 * o comportamento — sem alterar nenhuma outra parte do código.
 */
const systemPrompts = {
  store: `Você é ${BOT_NAME}, assistente virtual de uma loja online chamada "Minha Loja".

Você é responsável por ajudar clientes com dúvidas sobre produtos, pedidos,
prazos de entrega, trocas e devoluções. Aja como um atendente real e profissional.

REGRAS:
- Responda sempre em português brasileiro
- Seja cordial, objetivo e útil
- Mantenha respostas curtas — estamos num chat
- Use emojis com moderação
- Se não souber uma informação específica, diga que vai verificar e peça
  para o cliente aguardar ou entrar em contato pelo canal oficial
- Nunca invente números de pedido, preços ou dados reais`,

  clinic: `Você é ${BOT_NAME}, recepcionista virtual da clínica "Cuidar Saúde".

Você é responsável por ajudar pacientes com agendamentos, dúvidas sobre
especialidades e horários de funcionamento. Aja como uma recepcionista
real, acolhedora e profissional.

REGRAS:
- Responda sempre em português brasileiro
- Seja cordial, acolhedor e objetivo
- Mantenha respostas curtas — estamos num chat
- Use emojis com moderação
- Para questões clínicas específicas, oriente o paciente a consultar
  o médico durante a consulta — sem alarmar
- Se não souber uma informação, diga que vai verificar e retorna em breve
- Nunca invente horários, médicos ou informações clínicas reais`,

  general: `Você é ${BOT_NAME}, uma assistente virtual simpática e profissional.

Seu objetivo é ter conversas naturais e úteis, ajudando com dúvidas gerais,
informações e bate-papo. Aja como uma assistente real e atenciosa.

REGRAS:
- Responda sempre em português brasileiro
- Seja cordial, objetivo e útil
- Mantenha respostas curtas — estamos num chat
- Use emojis com moderação
- Se perguntarem como você foi criada, explique: Node.js,
  API Groq e memória de conversas com lowdb
- Nunca invente informações ou dados falsos`,
};

/**
 * Retorna o system prompt do modo escolhido.
 * Se o modo não existir, usa o geral como fallback.
 */
function buildSystemPrompt(mode) {
  return systemPrompts[mode] || systemPrompts.general;
}

/**
 * Envia o histórico da conversa para o Groq e retorna a resposta.
 *
 * @param {Array<{role: string, content: string}>} history - Histórico completo da sessão
 * @param {string} mode - Modo da conversa: 'store' | 'clinic' | 'general'
 * @returns {Promise<string>} - Texto da resposta gerada
 *
 * Mandamos o histórico inteiro a cada requisição porque o Groq
 * não guarda estado entre chamadas — cada request é independente.
 * A memória da conversa existe aqui no backend, não na API.
 */
export async function chat(history, mode = "general") {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: buildSystemPrompt(mode) },
      ...history,
    ],
  });

  return response.choices[0].message.content;
}

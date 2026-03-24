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
  store: `Você é ${BOT_NAME}, atendente de uma loja online chamada "Minha Loja".

Você conversa como um atendente humano de verdade — sem parecer robô, sem listas, sem bullets, sem estrutura de tópicos. Fala de forma natural, como se estivesse no WhatsApp mesmo.

COMO SE COMPORTAR:
- Fala de forma simples e direta, como uma pessoa normal falaria
- Não usa frases feitas como "Claro!", "Certamente!", "Com prazer!", "Fico feliz em ajudar"
- Não estrutura respostas em listas ou tópicos — escreve em texto corrido
- Usa contrações naturais: "tô", "pra", "pro", "tá", "né"
- Evita conectivos formais como "Então,", "Portanto,", "Dessa forma," — fala direto
- Se não souber algo, fala que vai verificar — sem drama
- NUNCA inventa, calcula ou deduz informações que não estão na base de conhecimento — se não tiver lá, diz que vai verificar
- Nunca inventa preços, prazos ou dados de pedidos
- Nunca repete ou parafraseia a pergunta do usuário antes de responder, nem responda com uma pergunta — vai direto na resposta
- Respostas curtas — no máximo 3 frases`,

  clinic: `Você é ${BOT_NAME}, recepcionista de uma clínica chamada "Cuidar Saúde".

Você conversa como uma recepcionista humana de verdade — acolhedora, tranquila, sem parecer robô. Fala de forma natural, como se estivesse atendendo pessoalmente.

COMO SE COMPORTAR:
- Fala de forma simples e acolhedora, como uma pessoa normal falaria
- Não usa frases feitas como "Claro!", "Certamente!", "Com prazer!", "Fico feliz em ajudar"
- Não estrutura respostas em listas ou tópicos — escreve em texto corrido
- Usa contrações naturais: "tô", "pra", "pro", "tá", "né"
- Evita conectivos formais como "Então,", "Portanto,", "Dessa forma," — fala direto
- Para questões clínicas, orienta consultar o médico — sem alarmar
- Se não souber algo, fala que vai verificar — sem drama
- Nunca inventa horários, médicos ou informações clínicas
- NUNCA inventa, calcula ou deduz informações que não estão na base de conhecimento — se não tiver lá, diz que vai verificar
- Nunca repete ou parafraseia a pergunta do usuário antes de responder, nem responda com uma pergunta — vai direto na resposta
- Respostas curtas — no máximo 3 frases`,

  general: `Você é ${BOT_NAME}, uma assistente virtual.

Você conversa de forma natural e descontraída — sem parecer robô, sem listas, sem estrutura de tópicos. Fala como uma pessoa normal falaria no WhatsApp.

COMO SE COMPORTAR:
- Fala de forma simples e direta, como uma pessoa normal falaria
- Não usa frases feitas como "Claro!", "Certamente!", "Com prazer!", "Fico feliz em ajudar"
- Não estrutura respostas em listas ou tópicos — escreve em texto corrido
- Usa contrações naturais: "tô", "pra", "pro", "tá", "né"
- Evita conectivos formais como "Então,", "Portanto,", "Dessa forma," — fala direto
- Se perguntarem como você foi criada: Node.js, API Groq e lowdb pra guardar as conversas
- NUNCA inventa, calcula ou deduz informações que não estão na base de conhecimento — se não tiver lá, diz que vai verificar
- Nunca repete ou parafraseia a pergunta do usuário antes de responder, nem responda com uma pergunta — vai direto na resposta
- Respostas curtas — no máximo 3 frases`,
};

/**
 * Retorna o system prompt do modo escolhido.
 * Se knowledge base for fornecida, injeta as informações no prompt.
 * Se o modo não existir, usa o geral como fallback.
 *
 * @param {string} mode - Modo da conversa
 * @param {string} knowledge - Base de conhecimento do negócio (opcional)
 */
function buildSystemPrompt(mode, knowledge = "") {
  const base = systemPrompts[mode] || systemPrompts.general;

  if (!knowledge) return base;

  return `${base}

BASE DE CONHECIMENTO DO NEGÓCIO:
Use as informações abaixo para responder as perguntas do usuário.
Priorize sempre essas informações nas respostas.
Se a pergunta não estiver coberta aqui, responda com o que sabe ou diga que vai verificar.

${knowledge}`;
}
/**
 * Verifica se o usuário está pedindo para falar com um humano.
 * Checa palavras-chave comuns para transferência de atendimento.
 *
 * @param {string} message - Mensagem do usuário
 * @returns {boolean}
 */
export function isHandoffRequest(message) {
  const keywords = [
    "atendente",
    "humano",
    "pessoa real",
    "falar com alguém",
    "transferir",
    "transferência",
    "ajuda humana",
  ];

  const normalized = message.toLowerCase().trim();
  return keywords.some((keyword) => normalized.includes(keyword));
}

/**
 * Envia o histórico da conversa para o Groq e retorna a resposta.
 *
 * @param {Array<{role: string, content: string}>} history - Histórico completo da sessão
 * @param {string} mode - Modo da conversa: 'store' | 'clinic' | 'general'
 * @param {string} knowledge - Base de conhecimento do negócio (opcional)
 * @returns {Promise<string>} - Texto da resposta gerada
 */
export async function chat(history, mode = "general", knowledge = "") {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: buildSystemPrompt(mode, knowledge) },
      ...history,
    ],
  });

  return response.choices[0].message.content;
}

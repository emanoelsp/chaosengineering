import Groq from 'groq-sdk'

export const AI_MODEL = 'llama-3.3-70b-versatile'
export const AI_MAX_TOKENS = 1024
export const AI_TIMEOUT_MS = 8000

export function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY não configurada. Adicione ao .env.local')
  }
  return new Groq({ apiKey })
}

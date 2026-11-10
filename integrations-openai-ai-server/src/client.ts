import OpenAI from "openai";

/**
 * Direct OpenAI API client.
 * The API key is read only by the server and is never exposed to the browser.
 * Keep SDK retries disabled: the semantic engine owns the bounded retry budget.
 */
export function isOpenAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

// Lazily construct the client so an unused semantic feature never breaks startup.
export function createOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("MARJEA_OPENAI_NOT_CONFIGURED");
  }
  return new OpenAI({
    apiKey,
    maxRetries: 0,
    timeout: 30_000,
  });
}

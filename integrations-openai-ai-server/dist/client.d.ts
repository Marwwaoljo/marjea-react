import OpenAI from "openai";
/**
 * Direct OpenAI API client.
 * The API key is read only by the server and is never exposed to the browser.
 * Keep SDK retries disabled: the semantic engine owns the bounded retry budget.
 */
export declare function isOpenAIConfigured(): boolean;
export declare function createOpenAIClient(): OpenAI;
//# sourceMappingURL=client.d.ts.map
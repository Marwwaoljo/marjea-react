import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { createOpenAIClient, isOpenAIConfigured } from "./client";

const originalApiKey = process.env.OPENAI_API_KEY;

afterEach(() => {
  if (originalApiKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = originalApiKey;
});

test("direct OpenAI client requires only the server-side API key", () => {
  delete process.env.OPENAI_API_KEY;
  assert.equal(isOpenAIConfigured(), false);
  assert.throws(() => createOpenAIClient(), /MARJEA_OPENAI_NOT_CONFIGURED/);

  process.env.OPENAI_API_KEY = "test-openai-secret";
  assert.equal(isOpenAIConfigured(), true);
  const client = createOpenAIClient();
  assert.equal(client.baseURL, "https://api.openai.com/v1");
  assert.equal(client.maxRetries, 0);
});

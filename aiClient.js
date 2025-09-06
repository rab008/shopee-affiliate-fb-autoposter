import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config();

const hf = new InferenceClient(process.env.HF_API_KEY);

// List of models in priority order
const models = [
  "deepseek-ai/DeepSeek-R1-0528",      // free model
  "tiiuae/falcon-7b-instruct",         // fallback 1
  "mistralai/Mistral-7B-Instruct-v0.1", // fallback 2
  "facebook/opt-1.3b"                  // fallback 3
];

export async function generateDescription(product) {
  const prompt = `Write a short, catchy Facebook marketing post for this product:
  Name: ${product.name}
  Price: ${product.price}
  URL: ${product.url}`;

  for (const model of models) {
    try {
      console.log(`🧠 Trying model: ${model}`);
      const response = await hf.textGeneration({
        model,
        inputs: prompt,
        parameters: { max_new_tokens: 80 }
      });

      // Hugging Face returns array or object depending on model
      const text = response.generated_text || response[0]?.generated_text;
      if (text) {
        return text.trim();
      }
    } catch (err) {
      console.warn(`⚠️ Model ${model} failed: ${err.message}`);
    }
  }

  // If all models fail, return a basic static fallback
  return `🔥 Check out ${product.name} for only ${product.price}! Grab it here: ${product.url}`;
}

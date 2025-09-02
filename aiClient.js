import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config();

const hf = new InferenceClient(process.env.HF_API_KEY);

export async function generateDescription(product) {
  const prompt = `Write a short Facebook marketing post for this product:
  Name: ${product.name}
  Price: ${product.price}
  URL: ${product.url}`;

  const response = await hf.textGeneration({
    model: "HuggingFaceH4/zephyr-7b-alpha", // free model
    inputs: prompt,
    parameters: { max_new_tokens: 80 }
  });

  return response.generated_text;
}

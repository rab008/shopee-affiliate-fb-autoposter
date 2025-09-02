import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config();

const hf = new InferenceClient(process.env.HF_API_KEY);

export async function generateDescription(product) {
  const prompt = `Write a short Facebook marketing post for this product:
  Name: ${product.name}
  Price: ${product.price}
  URL: ${product.url}`;

  try {
    const response = await hf.textGeneration({
      model: "HuggingFaceH4/zephyr-7b-alpha", // free model
      inputs: prompt,
      parameters: { max_new_tokens: 80 }
    });

    // response is usually an array
    return response.generated_text || response[0]?.generated_text || "⚠️ No description generated";
  } catch (err) {
    console.error("Error generating description:", err);
    return `🔥 Check out ${product.name} for only ${product.price}! Grab it here: ${product.url}`;
  }
}

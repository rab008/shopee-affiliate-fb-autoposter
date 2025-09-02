// index.js
import { getMockProducts } from "./shopeeClient.js";
import { postToFacebook } from "./fbClient.js";
import dotenv from "dotenv";
import cron from "node-cron";
import { generateDescription } from "./aiClient.js";

dotenv.config();

async function startScheduler() {
  const products = await getMockProducts();
  if (!products?.length) {
    console.log("⚠️ No products found, exiting.");
    return;
  }

  console.log(`📦 Loaded ${products.length} products for autoposting.`);

  let index = 0;
  const intervalMin = parseInt(process.env.POST_INTERVAL_MIN, 10) || 60;

  // Build cron expression: "*/X * * * *" runs every X minutes
  const cronExpr = `*/${intervalMin} * * * *`;

  cron.schedule(cronExpr, async () => {
    const product = products[index];
    console.log(`\n➡️ Posting product ${index + 1}/${products.length}`);

    const description = await generateDescription(product);
    product.description = description;
    await postToFacebook(product);

    index = (index + 1) % products.length; // loop back when done
  });

  console.log(`✅ Autoposter started. Posting every ${intervalMin} minutes.`);
  console.log(`⏳ Next post will be product 1 in ${intervalMin} minutes.`);
}

startScheduler();

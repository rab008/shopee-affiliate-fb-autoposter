// fbClient.js
import axios from "axios";

export async function postToFacebook(product) {
  const pageId = process.env.FB_PAGE_ID;
  const pageAccessToken = process.env.FB_PAGE_ACCESS_TOKEN;
  const apiVersion = process.env.FB_API_VERSION || "v23.0";

  if (!pageId || !pageAccessToken) {
    console.error("❌ Missing FB_PAGE_ID or FB_PAGE_ACCESS_TOKEN in .env");
    return;
  }

  // Debug token info (after dotenv loads)
  console.log(
    "🔑 Page Token:",
    pageAccessToken.substring(0, 20) + "...",
    "length:",
    pageAccessToken.length
  );

  try {
    const res = await axios.post(
      `https://graph.facebook.com/${apiVersion}/${pageId}/feed`,
      null,
      {
        params: {
          message: `${product.name}\nPrice: ${product.price}\n\nBuy here: ${product.url}`,
          link: product.url, // optional
          access_token: pageAccessToken,
        },
      }
    );

    console.log("✅ Post successful:", res.data);
  } catch (err) {
    console.error("❌ Error posting:", err.response?.data || err.message);
  }
}

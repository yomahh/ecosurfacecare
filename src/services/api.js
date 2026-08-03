// Replace these demonstration functions with Cloudflare Pages Functions or Worker API calls.
export async function submitQuote(payload) {
  console.log("Quote payload", payload);
  return { success: true, reference: "ESC-DEMO" };
}

export async function fetchGallery() {
  return [];
}

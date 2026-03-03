// Cloudflare Pages Function — proxies API requests to avoid CORS
// Requests: /api/proxy?url=https://...
export async function onRequest(context) {
  const reqUrl = new URL(context.request.url);
  const target = reqUrl.searchParams.get("url");

  if (!target) {
    return new Response(JSON.stringify({ error: "Missing url parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await fetch(target, {
      headers: { "User-Agent": "Weathervane/1.0" },
    });
    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}

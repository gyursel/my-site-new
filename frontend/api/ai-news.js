// Fixed upstreams: this endpoint cannot proxy arbitrary user-supplied URLs.
const FEEDS = [
  "https://news.google.com/rss/search?q=" + encodeURIComponent('"изкуствен интелект" when:7d') + "&hl=bg&gl=BG&ceid=BG:bg",
  "https://news.google.com/rss/search?q=" + encodeURIComponent('(OpenAI OR ChatGPT OR Gemini OR Anthropic) when:7d') + "&hl=bg&gl=BG&ceid=BG:bg"
];
module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }
  for (const url of FEEDS) {
    try {
      const upstream = await fetch(url, {
        signal: AbortSignal.timeout(8000),
        headers: { Accept: "application/rss+xml, application/xml, text/xml" }
      });
      if (!upstream.ok) continue;
      const xml = await upstream.text();
      if (xml.length > 1500000 || !/<rss[\s>]/i.test(xml) || !/<item[\s>]/i.test(xml)) continue;
      res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=300, s-maxage=10800, stale-while-revalidate=300");
      res.setHeader("X-News-Updated-At", new Date().toISOString());
      res.setHeader("X-Content-Type-Options", "nosniff");
      return res.status(200).send(xml);
    } catch (_) { /* Try the next feed on timeout or upstream failure. */ }
  }
  res.setHeader("Cache-Control", "no-store");
  return res.status(503).json({ error: "News feed temporarily unavailable" });
};

// Static file server + API reverse proxy for Azure App Service
import { createServer, request as httpRequest } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DIST = join(__dirname, "dist");
const PORT = process.env.PORT || 8080;
const API_BASE_URL = process.env.API_BASE_URL || "http://10.1.2.250";

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

// Reverse proxy: forward /api/* requests to the backend
function proxyApi(req, res) {
  const url = new URL(API_BASE_URL + req.url);
  const proxyReq = httpRequest(
    {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method: req.method,
      headers: {
        ...req.headers,
        host: url.hostname,
      },
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    },
  );

  proxyReq.on("error", (err) => {
    console.error("Proxy error:", err.message);
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Backend unavailable" }));
  });

  req.pipe(proxyReq, { end: true });
}

async function serve(req, res) {
  // Proxy API requests to the backend
  if (req.url.startsWith("/api/")) {
    return proxyApi(req, res);
  }

  let filePath = join(DIST, req.url === "/" ? "index.html" : req.url);

  try {
    const data = await readFile(filePath);
    const ext = extname(filePath);
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
    });
    res.end(data);
  } catch {
    // SPA fallback: serve index.html for all unmatched routes
    const html = await readFile(join(DIST, "index.html"));
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  }
}

createServer(serve).listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API proxy target: ${API_BASE_URL}`);
});

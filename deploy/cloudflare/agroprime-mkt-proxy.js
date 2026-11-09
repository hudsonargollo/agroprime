// Proxy agroprime.clubemkt.digital/mkt* to the Mkt Hub.
// The site host is a Cloudflare Pages custom domain (agroprime.pages.dev), so
// nginx never sees it; this Worker route is the only place to reach the VPS.
// The Hub already lives at mkt.clubemkt.digital (exact nginx server_name).
const UPSTREAM = "https://mkt.clubemkt.digital";
const PUBLIC_ORIGIN = "https://agroprime.clubemkt.digital";

const HOP_HEADERS = [
  "host",
  "cf-connecting-ip",
  "cf-ipcountry",
  "cf-ray",
  "cf-visitor",
  "cdn-loop",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-real-ip",
];

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname !== "/mkt" && !url.pathname.startsWith("/mkt/")) {
      return new Response("Not found", { status: 404 });
    }

    const target = new URL(url.pathname + url.search, UPSTREAM);
    const headers = new Headers(request.headers);
    for (const h of HOP_HEADERS) headers.delete(h);

    const init = { method: request.method, headers, redirect: "manual" };
    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = request.body;
    }

    const res = await fetch(target, init);
    const out = new Headers(res.headers);
    const location = out.get("location");
    if (location && location.startsWith(UPSTREAM)) {
      out.set("location", PUBLIC_ORIGIN + location.slice(UPSTREAM.length));
    }

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: out,
    });
  },
};

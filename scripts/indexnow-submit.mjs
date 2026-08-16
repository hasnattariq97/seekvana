// Submit URLs to IndexNow (Bing, Yandex, Seznam, Naver).
// Usage:
//   node scripts/indexnow-submit.mjs                 -> submit every URL in the live sitemap
//   node scripts/indexnow-submit.mjs /library/a /library/b  -> submit specific paths

const HOST = "seekvana.com";
const KEY = "5e2adce3a75977d916071834c32a20a7";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH_SIZE = 10000; // IndexNow's documented per-request cap

async function getSitemapUrls() {
  const res = await fetch(`https://${HOST}/sitemap.xml`);
  if (!res.ok) {
    throw new Error(`Failed to fetch sitemap.xml: ${res.status}`);
  }
  const xml = await res.text();
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches.map((m) => m[1]);
}

async function submit(urls) {
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: KEY_LOCATION,
        urlList: batch,
      }),
    });
    if (!res.ok && res.status !== 202) {
      const body = await res.text().catch(() => "");
      throw new Error(`IndexNow submit failed: ${res.status} ${body}`);
    }
    console.log(`Submitted ${batch.length} URLs (status ${res.status})`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const urls =
    args.length > 0
      ? args.map((p) => (p.startsWith("http") ? p : `https://${HOST}${p}`))
      : await getSitemapUrls();

  console.log(`Submitting ${urls.length} URL(s) to IndexNow...`);
  await submit(urls);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

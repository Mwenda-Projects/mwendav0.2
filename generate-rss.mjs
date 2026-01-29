import fs from 'fs';
import path from 'path';

const site_url = "https://mwendav0-2.vercel.app";

try {
  // 1. Read the posts.ts file
  const postsFilePath = path.resolve('./src/data/posts.ts');
  const fileContent = fs.readFileSync(postsFilePath, 'utf-8');

  // 2. Flexible Regex: Finds titles, slugs, etc., whether they use ' or "
  const titles = [...fileContent.matchAll(/title:\s*["'](.*?)["']/g)].map(m => m[1]);
  const slugs = [...fileContent.matchAll(/slug:\s*["'](.*?)["']/g)].map(m => m[1]);
  const excerpts = [...fileContent.matchAll(/excerpt:\s*["'](.*?)["']/g)].map(m => m[1]);
  const dates = [...fileContent.matchAll(/date:\s*["'](.*?)["']/g)].map(m => m[1]);

  console.log(`Found ${titles.length} posts to add to RSS.`);

  // 3. Create RSS items
  let rssItems = "";
  for (let i = 0; i < titles.length; i++) {
    // Only add if we have at least a title and a slug
    if (titles[i] && slugs[i]) {
      rssItems += `
    <item>
      <title><![CDATA[${titles[i]}]]></title>
      <link>${site_url}/post/${slugs[i]}</link>
      <guid isPermaLink="true">${site_url}/post/${slugs[i]}</guid>
      <pubDate>${new Date(dates[i] || Date.now()).toUTCString()}</pubDate>
      <description><![CDATA[${excerpts[i] || ""}]]></description>
    </item>`;
    }
  }

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>The Mwenda Chronicles</title>
    <link>${site_url}</link>
    <description>Building early — from campus to company.</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;

  // 4. Write the file
  fs.writeFileSync('./public/feed.xml', rssFeed);
  console.log("✅ RSS Feed generated successfully!");

} catch (error) {
  console.error("❌ Error generating RSS:", error.message);
}
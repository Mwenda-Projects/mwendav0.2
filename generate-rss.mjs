import fs from 'fs';
import path from 'path';

const site_url = "https://mwendav0-2.vercel.app";

// 1. Read the posts.ts file as a raw string to avoid import errors
const postsFilePath = path.resolve('./src/data/posts.ts');
const fileContent = fs.readFileSync(postsFilePath, 'utf-8');

// 2. Extract post data using a simple Regex (This avoids the @/assets error)
// This looks for titles and slugs specifically to build the feed
const titleMatches = [...fileContent.matchAll(/title:\s*"(.*?)"/g)].map(m => m[1]);
const slugMatches = [...fileContent.matchAll(/slug:\s*"(.*?)"/g)].map(m => m[1]);
const excerptMatches = [...fileContent.matchAll(/excerpt:\s*"(.*?)"/g)].map(m => m[1]);
const dateMatches = [...fileContent.matchAll(/date:\s*"(.*?)"/g)].map(m => m[1]);

// 3. Create RSS items
let rssItems = "";
for (let i = 0; i < titleMatches.length; i++) {
  rssItems += `
    <item>
      <title><![CDATA[${titleMatches[i]}]]></title>
      <link>${site_url}/post/${slugMatches[i]}</link>
      <guid isPermaLink="true">${site_url}/post/${slugMatches[i]}</guid>
      <pubDate>${new Date(dateMatches[i] || Date.now()).toUTCString()}</pubDate>
      <description><![CDATA[${excerptMatches[i] || ""}]]></description>
    </item>`;
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
console.log("✅ RSS Feed generated successfully by parsing text!");
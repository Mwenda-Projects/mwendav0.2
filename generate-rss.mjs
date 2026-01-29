import fs from 'fs';
// This assumes your posts are in src/data/posts.ts
import { posts } from './src/data/posts.ts'; 

const site_url = "https://mwendav0-2.vercel.app";

const rssItems = posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${site_url}/post/${post.slug}</link>
      <guid isPermaLink="true">${site_url}/post/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>`).join('');

const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>The Mwenda Chronicles</title>
    <link>${site_url}</link>
    <description>Building early — from campus to company.</description>
    ${rssItems}
  </channel>
</rss>`;

// This script will automatically create/update the feed.xml in your public folder
fs.writeFileSync('./public/feed.xml', rssFeed);
console.log("✅ RSS Feed updated!");
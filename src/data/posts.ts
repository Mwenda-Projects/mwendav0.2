import heroBlog from "@/assets/hero-blog.jpg";
import post1 from "@/assets/post-1.jpg";
import post2 from "@/assets/post-2.jpg";
import post3 from "@/assets/post-3.jpg";
import post4 from "@/assets/post-4.jpg";
import post5 from "@/assets/post-5.jpg";
import post6 from "@/assets/post-6.png";
import post7 from "@/assets/post-7.png";

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  slug: string;
  author: {
    name: string;
    avatar: string;
  };
}

export const posts: Post[] = [
  {
    id: 6,
    title: "Scaling a Campus Side Hustle: From Small Wins to Serious Income",
    slug: "scaling-hustles",
    excerpt: "Scaling isn’t about grinding 24/7 or skipping classes. It’s about turning effort into leverage. Here is how to grow a campus hustle the smart way.",
    category: "Entrepreneurship",
    date: "Jan 28, 2026",
    readTime: "6 min read",
    image: post7,
    author: {
      name: "Antony Mwenda",
      avatar: post1
    },
    content: `
Most campus side hustles don’t start with some big master plan. They start with survival, curiosity, or opportunity. Mine — and many others I’ve seen — began with one simple thought: **there has to be a better way to make money while still in school.**

At first, it’s just about covering basics — data, food, transport, small wants. But if you pay attention, that small hustle starts teaching you something bigger: systems, discipline, money flow, and problem-solving. That’s when scaling becomes possible.

## 1. Make Sure It Actually Works
Before you think about growth, be honest with yourself. Ask yourself:
* **Are people willingly paying without being pushed?**
* **Do customers come back or refer others?**
* **Can I explain what I do in one clear sentence?**

If your hustle only works when you beg, underprice, or over-explain, it’s not ready to scale yet. A solid campus hustle **solves a real problem students already have.**

## 2. Turn Chaos Into Systems
Early hustle stages are messy. But chaos does not scale. You need simple systems: one clear price list, standard replies for common questions, and a preferred payment method. **Once things are written down and repeatable, your brain gets free space.**

## 3. Stop Underpricing Yourself
Most campus hustlers charge too little because they fear losing customers. But scaling is not always about getting more people — **sometimes it’s about getting better ones.** If nobody complains about your prices, they’re probably too low.

## 4. Buy Back Your Time
As a student, time is your most limited resource. You cannot attend classes, study, rest, and still do everything in your hustle alone. At some point, you must delegate. **Scaling is less about doing more and more about doing less of the wrong things.**

## 5. Use the Internet Properly
Campus hustles that stay offline grow slowly. A simple digital presence changes everything:
* **Social media builds trust.**
* **Automation saves time.**
* **AI tools increase output.**

## 6. Reinvest Like an Adult
One of the biggest mistakes is upgrading lifestyle too early. That first profit feels good, but growth feels better. **Delayed gratification is a superpower most students ignore.** Reinvest in marketing, upgrade tools, and improve branding.

## 7. Treat It Like a Real Business
Once money grows, responsibility follows. Track income and expenses, be clear with partners, and keep things clean. **A hustle you respect has a higher chance of surviving long-term.**

## 8. Don’t Sacrifice School or Health
A hustle is supposed to support your life — not destroy it. Set boundaries: fixed working hours, non-negotiable study time, and rest days. **Burnout kills more hustles than competition ever will.**

## Conclusion
Your campus is more than a place to attend lectures. It’s a **real-world lab** where you can test ideas, build discipline, and lay foundations for bigger things. Start small. Think long-term. Build something that outlives campus.`
  },
  {
    id: 1,
    title: "Building Before You’re Ready",
    excerpt: "Why waiting for perfect conditions keeps most people stuck, and how starting early compounds faster than talent ever will.",
    category: "Entrepreneurship",
    date: "Jan 22, 2026",
    readTime: "4 min read",
    image: heroBlog,
    slug: "building-before-youre-ready",
    author: {
      name: "Antony Mwenda",
      avatar: post1
    },
    content: `
## Most people wait.

They wait until they feel ready. They wait until they have money. They wait until someone validates their idea. And by the time they’re “ready,” years are already gone.

I’ve learned this early: if you wait for perfect conditions, you will never build anything meaningful.

## Starting With What You Have
When you’re in campus, broke, inexperienced, and still figuring life out, it’s easy to believe you’re behind. The truth is—you’re early.

Early enough to make mistakes quietly. Early enough to experiment without pressure. Early enough to build skills before responsibilities pile up.

## Why I’m Documenting the Journey
This blog isn’t about pretending to have everything figured out. It’s about documenting growth. About thinking in public. About leaving a trail of lessons—for myself and for anyone walking a similar path.`
  },
  {
    id: 2,
    title: "Top AI Tools for Student Entrepreneurs",
    slug: "ai-tools",
    excerpt: "How AI quietly became my secret weapon for balancing campus life and building a business.",
    category: "AI & Automation",
    date: "Jan 20, 2026",
    readTime: "6 min read",
    image: post6,
    author: {
      name: "Antony Mwenda",
      avatar: post1
    },
    content: `When I first started trying to build something while still in school, it felt overwhelming. Classes, deadlines, ideas, and no real team or money to fall back on. I wanted to do more than just survive campus life — I wanted to create.

That’s when AI quietly became my secret weapon.

**ChatGPT** was the first tool that really helped. Whenever I felt stuck, it helped me think through ideas, write content, plan projects, and even learn things faster than I could on my own. It felt like having someone to bounce ideas off at any time.

Then there was **Canva AI**. I didn’t know design, but I still needed my ideas to look serious. With Canva, I could create posters, social media posts, and simple branding that made my projects feel real — not like student experiments.

**Notion AI** helped me stay sane. School and business can easily become chaos, and having everything organized in one place made a huge difference. It became my digital notebook, planner, and idea bank all in one.

For content, **InVideo AI** made things easier. I could turn simple scripts into videos without showing my face or learning complex editing. It removed a big fear and helped me stay consistent.

Tools like **Grammarly** and AI image generators polished everything — from emails to visuals. Small details matter when you’re trying to be taken seriously, and these tools helped close that gap.

AI didn’t do the work for me. It just made starting easier.

And sometimes, that’s all you need.`
  },
  {
    id: 3,
    title: "AI Tools That Run My Business",
    excerpt: "A deep dive into the automation stack I use to handle content creation, site reports, and project management.",
    category: "AI & Automation",
    date: "Jan 18, 2026",
    readTime: "5 min read",
    image: post2,
    slug: "ai-tools-business",
    author: {
      name: "Antony Mwenda",
      avatar: post1
    },
    content: `
## Work Smarter, Not Harder

In 2026, if you aren't using AI, you are working 10x harder than necessary. Here is the stack I use to keep my ventures running while I'm in class.

### 1. Project Management
I use AI-integrated tools to track construction milestones at Civaro. It predicts delays before they happen based on weather data and supply chain speed.

### 2. Content Creation
This very blog uses AI as a thought partner. It helps me structure my reflections and polish my technical tutorials so they are easy for everyone to read.

### 3. Automation
From automated invoicing to M-Pesa payment reconciliations, automation is the only reason I haven't burnt out yet.`
  },
  {
    id: 4,
    title: "The Campus Hustler’s Manifesto",
    excerpt: "Side hustles aren't just for pocket money—they are your real-world MBA. Here is how to start.",
    category: "Hustles & Money-Making",
    date: "Jan 15, 2026",
    readTime: "7 min read",
    image: post3,
    slug: "campus-hustler-manifesto",
    author: {
      name: "Antony Mwenda",
      avatar: post1
    },
    content: `
## The Side Hustle Advantage

Don't just graduate with a degree; graduate with a portfolio. Whether it's selling gear, freelance design, or running a small agency, the lessons are universal.

**Lesson 1: Cash flow is king.** Understanding how money moves is more important than your GPA.
**Lesson 2: Customer service.** Dealing with a difficult client in campus prepares you for the corporate world.
**Lesson 3: Failure is cheap.** If your campus business fails, you still have your room and your meal card. Take the risk now.`
  },
  {
    id: 5,
    title: "Productivity for the Overwhelmed",
    excerpt: "How to manage a degree, a startup, and a personal life without losing your mind.",
    category: "Tech & Productivity",
    date: "Jan 10, 2026",
    readTime: "4 min read",
    image: post4,
    slug: "productivity-hacks",
    author: {
      name: "Antony Mwenda",
      avatar: post1
    },
    content: `
## The Myth of Balance

There is no such thing as a 50/50 balance. There is only prioritization. 

### My System:
- **Deep Work Blocks:** 2 hours every morning dedicated to Civaro Engineering.
- **The "No-Phone" Zone:** No social media until 12 PM.
- **Weekly Reviews:** Every Sunday, I audit where my time went.

If you don't control your schedule, your schedule will control you.`
  }
];

// SORTING LOGIC: Automatically sorts by date (Newest first)
const sortedPosts = [...posts].sort((a, b) => 
  new Date(b.date).getTime() - new Date(a.date).getTime()
);

export const featuredPosts = sortedPosts.slice(0, 3);
export const recentPosts = sortedPosts;

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find(post => post.slug === slug);
}

export function getRelatedPosts(currentSlug: string, limit = 3): Post[] {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return sortedPosts.slice(0, limit);
  
  return sortedPosts
    .filter(post => post.slug !== currentSlug && post.category === currentPost.category)
    .slice(0, limit);
}
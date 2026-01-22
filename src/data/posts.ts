import heroBlog from "@/assets/hero-blog.jpg";
import post1 from "@/assets/post-1.jpg";
import post2 from "@/assets/post-2.jpg";
import post3 from "@/assets/post-3.jpg";
import post4 from "@/assets/post-4.jpg";
import post5 from "@/assets/post-5.jpg";

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
    id: 1,
    title: "Building Before You’re Ready",
    excerpt: "Why waiting for perfect conditions keeps most people stuck, and how starting early compounds faster than talent ever will.",
    content: `
## Most people wait.

They wait until they feel ready. They wait until they have money. They wait until someone validates their idea. And by the time they’re “ready,” years are already gone.

I’ve learned this early: if you wait for perfect conditions, you will never build anything meaningful.

## Starting With What You Have
When you’re in campus, broke, inexperienced, and still figuring life out, it’s easy to believe you’re behind. The truth is—you’re early.

Early enough to make mistakes quietly. Early enough to experiment without pressure. Early enough to build skills before responsibilities pile up.

## Why I’m Documenting the Journey
This blog isn’t about pretending to have everything figured out. It’s about documenting growth. About thinking in public. About leaving a trail of lessons—for myself and for anyone walking a similar path.
    `,
    category: "Entrepreneurship",
    date: "Jan 22, 2026",
    readTime: "4 min read",
    image: heroBlog,
    slug: "building-before-youre-ready",
    author: {
      name: "Antony Mwenda",
      avatar: post1
    }
  },
  {
    id: 2,
    title: "Civaro Engineering: The Vision for 2026",
    excerpt: "How I am building a civil engineering firm from the ground up while still navigating the academic world.",
    content: `
## From Blueprint to Reality

Building **Civaro Engineering Ltd** isn't just about business; it's about solving infrastructure challenges with a fresh, tech-first perspective. 

### The Foundation
Most people think you need a massive office to start an engineering firm. I started with a laptop and a copy of AutoCAD. The goal is to bridge the gap between theoretical classroom knowledge and the grit of the Kenyan construction site.

### Challenges of a Student Founder
1. **Time Management:** Balancing site visits with lecture hours.
2. **Credibility:** Convincing clients that a young engineer can deliver world-class results.
3. **Scaling:** Moving from solo consulting to a structured team.

Civaro is more than a name; it's a commitment to precision and integrity in the built environment.
    `,
    category: "Civil Engineering Journey",
    date: "Jan 20, 2026",
    readTime: "6 min read",
    image: post1,
    slug: "civaro-engineering-vision",
    author: {
      name: "Antony Mwenda",
      avatar: post1
    }
  },
  {
    id: 3,
    title: "AI Tools That Run My Business",
    excerpt: "A deep dive into the automation stack I use to handle content creation, site reports, and project management.",
    content: `
## Work Smarter, Not Harder

In 2026, if you aren't using AI, you are working 10x harder than necessary. Here is the stack I use to keep my ventures running while I'm in class.

### 1. Project Management
I use AI-integrated tools to track construction milestones at Civaro. It predicts delays before they happen based on weather data and supply chain speed.

### 2. Content Creation
This very blog uses AI as a thought partner. It helps me structure my reflections and polish my technical tutorials so they are easy for everyone to read.

### 3. Automation
From automated invoicing to M-Pesa payment reconciliations, automation is the only reason I haven't burnt out yet.
    `,
    category: "AI & Automation",
    date: "Jan 18, 2026",
    readTime: "5 min read",
    image: post2,
    slug: "ai-tools-business",
    author: {
      name: "Antony Mwenda",
      avatar: post1
    }
  },
  {
    id: 4,
    title: "The Campus Hustler’s Manifesto",
    excerpt: "Side hustles aren't just for pocket money—they are your real-world MBA. Here is how to start.",
    content: `
## The Side Hustle Advantage

Don't just graduate with a degree; graduate with a portfolio. Whether it's selling gear, freelance design, or running a small agency, the lessons are universal.

**Lesson 1: Cash flow is king.** Understanding how money moves is more important than your GPA.
**Lesson 2: Customer service.** Dealing with a difficult client in campus prepares you for the corporate world.
**Lesson 3: Failure is cheap.** If your campus business fails, you still have your room and your meal card. Take the risk now.
    `,
    category: "Hustles & Money-Making",
    date: "Jan 15, 2026",
    readTime: "7 min read",
    image: post3,
    slug: "campus-hustler-manifesto",
    author: {
      name: "Antony Mwenda",
      avatar: post1
    }
  },
  {
    id: 5,
    title: "Productivity for the Overwhelmed",
    excerpt: "How to manage a degree, a startup, and a personal life without losing your mind.",
    content: `
## The Myth of Balance

There is no such thing as a 50/50 balance. There is only prioritization. 

### My System:
- **Deep Work Blocks:** 2 hours every morning dedicated to Civaro Engineering.
- **The "No-Phone" Zone:** No social media until 12 PM.
- **Weekly Reviews:** Every Sunday, I audit where my time went.

If you don't control your schedule, your schedule will control you.
    `,
    category: "Tech & Productivity",
    date: "Jan 10, 2026",
    readTime: "4 min read",
    image: post4,
    slug: "productivity-hacks",
    author: {
      name: "Antony Mwenda",
      avatar: post1
    }
  }
];

export const featuredPosts = posts.slice(0, 3);
export const recentPosts = posts.slice(3);

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find(post => post.slug === slug);
}

export function getRelatedPosts(currentSlug: string, limit = 3): Post[] {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return posts.slice(0, limit);
  
  return posts
    .filter(post => post.slug !== currentSlug && post.category === currentPost.category)
    .slice(0, limit);
}
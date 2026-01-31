import heroBlog from "@/assets/hero-blog.jpg";
import post1 from "@/assets/post-1.jpg";
import post2 from "@/assets/post-2.jpg";
import post3 from "@/assets/post-3.jpg";
import post4 from "@/assets/post-4.jpg";
import post5 from "@/assets/post-5.jpg";
import post6 from "@/assets/post-6.png";
import post7 from "@/assets/post-7.png";
import post8 from "@/assets/post-8.png";

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
    title: "Top AI Tools for Student Entrepreneurs",
    slug: "ai-tools",
    excerpt: "How AI quietly became my secret weapon for balancing campus life and building a business.",
    content: `When I first started trying to build something while still in school, it felt overwhelming. Classes, deadlines, ideas, and no real team or money to fall back on. I wanted to do more than just survive campus life — I wanted to create.

That’s when AI quietly became my secret weapon.

**ChatGPT** was the first tool that really helped. Whenever I felt stuck, it helped me think through ideas, write content, plan projects, and even learn things faster than I could on my own. It felt like having someone to bounce ideas off at any time.

Then there was **Canva AI**. I didn’t know design, but I still needed my ideas to look serious. With Canva, I could create posters, social media posts, and simple branding that made my projects feel real — not like student experiments.

**Notion AI** helped me stay sane. School and business can easily become chaos, and having everything organized in one place made a huge difference. It became my digital notebook, planner, and idea bank all in one.

For content, **InVideo AI** made things easier. I could turn simple scripts into videos without showing my face or learning complex editing. It removed a big fear and helped me stay consistent.

Tools like **Grammarly** and AI image generators polished everything — from emails to visuals. Small details matter when you’re trying to be taken seriously, and these tools helped close that gap.

AI didn’t do the work for me. It just made starting easier.

And sometimes, that’s all you need.`,
    category: "AI & Automation",
    date: "Jan 20, 2026",
    readTime: "6 min read",
    image: post6,
    author: {
      name: "Antony Mwenda",
      avatar: post1
    }
  },
  {
    id: 3,
    title: "January 2026: Quiet Wins and Big Moves",
    excerpt: "A look back at the small habits, projects, and connections that laid the foundation for bigger things this month.",
    content: `
## Quiet Wins and Big Moves

January has been busy but productive — a month of building, learning, and laying foundations for bigger things.

## 1. Habits That Stick
I kept my **Duolingo streak** alive, showing that even small daily habits can set the tone for bigger achievements.

## 2. OfliX – Turning Ideas into Action
OfliX is my platform helping local businesses get websites and Google presence. It’s not fully live yet, but I’ve started offering real services, and my blog serves as a live demo of what I can create.

## 3. Money Bite 7 – Early Validation
I launched **Money Bite 7**, my YouTube channel sharing practical money and side hustle tips for students. I now have a few early subscribers — each one proving that the content resonates and the work is being noticed.

## 4. Building Relationships
I met ##Dr. Liz and Madam Patricia##, the heads of DMLF, and connected with fellow scholars. These interactions reinforced the value of relationships and support in achieving bigger goals.

January was a **foundation month**, and I’m heading into February ready to scale OfliX, grow Money Bite 7, and keep building habits and projects that matter.

## Question for readers: What’s one small habit or project you’ve been working on this month that’s making a difference in your life? I’d love to hear your thoughts in the comments!
    `,
    category: "Personal Narratives",
    date: "Jan 31, 2026",
    readTime: "5 min read",
    image: post8,
    slug: "january-review",
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
    title: "Scaling a Campus Side Hustle: From Small Wins to Serious Income",
    excerpt: "Scaling isn’t about grinding 24/7 or skipping classes. It’s about turning effort into leverage. Here is how to grow a campus hustle the smart way.",
    category: "Entrepreneurship",
    content: `
Most campus side hustles don’t start with some big master plan. They start with survival, curiosity, or opportunity. Mine — and many others I’ve seen — began with one simple thought: **there has to be a better way to make money while still in school.

At first, it’s just about covering basics — data, food, transport, small wants. But if you pay attention, that small hustle starts teaching you something bigger: systems, discipline, money flow, and problem-solving. That’s when scaling becomes possible.

## 1. Make Sure It Actually Works
Before you think about growth, be honest with yourself. Ask yourself:
   I. Are people willingly paying without being pushed?
   II. Do customers come back or refer others?
   III. Can I explain what I do in one clear sentence?

If your hustle only works when you beg, underprice, or over-explain, it’s not ready to scale yet. A solid campus hustle **solves a real problem students already have.**

## 2. Turn Chaos Into Systems
Early hustle stages are messy. But chaos does not scale. You need simple systems: one clear price list, standard replies for common questions, and a preferred payment method. **Once things are written down and repeatable, your brain gets free space.

## 3. Stop Underpricing Yourself
Most campus hustlers charge too little because they fear losing customers. But scaling is not always about getting more people — sometimes it’s about getting better ones. If nobody complains about your prices, they’re probably too low.

## 4. Buy Back Your Time
As a student, time is your most limited resource. You cannot attend classes, study, rest, and still do everything in your hustle alone. At some point, you must delegate. **Scaling is less about doing more and more about doing less of the wrong things.

## 5. Use the Internet Properly
Campus hustles that stay offline grow slowly. A simple digital presence changes everything. Social media builds trust, a simple page explains what you do, and automation saves time. Your hustle should still make progress even when you’re in class. That’s leverage.

## 6. Reinvest Like an Adult
One of the biggest mistakes is upgrading lifestyle too early. That first profit feels good, but growth feels better. Instead of spending everything:
. Reinvest in marketing
. Upgrade tools
. Improve branding

Delayed gratification is a superpower most students ignore.

## 7. Treat It Like a Real Business
Once money grows, responsibility follows. You don’t need to overcomplicate things, but you do need structure: track income and expenses, be clear with partners, and keep things clean. A hustle you respect has a higher chance of surviving long-term.

## 8. Don’t Sacrifice School or Health
A hustle is supposed to support your life — not destroy it. Set boundaries with fixed working hours and non-negotiable study time. Burnout kills more hustles than competition ever will.

## Conclusion
Scaling a campus side hustle isn’t about luck or hype. It’s about consistency, systems, and patience. Your campus is more than a place to attend lectures. It’s a real-world lab where you can test ideas, build discipline, and lay foundations for bigger things.

Start small. Think long-term. Build something that outlives campus.
    `,
    date: "Jan 28, 2026",
    readTime: "7 min read",
    image: post7,
    slug: "scaling-hustles",
    author: {
      name: "Antony Mwenda",
      avatar: post1
    }
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
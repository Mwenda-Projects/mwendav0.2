import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, Share2, Twitter, Facebook, Linkedin, Copy } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { ReactCusdis } from 'react-cusdis';
import { Header } from "@/components/blog/Header";
import { Footer } from "@/components/blog/Footer";
import { PostCard } from "@/components/blog/PostCard";
import { Button } from "@/components/ui/button";
import { getPostBySlug, getRelatedPosts } from "@/data/posts";
import { toast } from "@/hooks/use-toast";
import authorImage from "@/assets/author.png";
import authorImage2 from "@/assets/author-2.jpg";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  
  const post = getPostBySlug(slug || "");
  const relatedPosts = getRelatedPosts(slug || "", 3);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground">Post Not Found</h1>
          <p className="mt-4 text-muted-foreground">The article you're looking for doesn't exist.</p>
          <Link to="/">
            <Button className="mt-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const siteUrl = "https://mwendav0-2.vercel.app";
  const fullPostUrl = `${siteUrl}/post/${post.slug}`;

  const handleShare = (platform: string) => {
    const text = post.title;
    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fullPostUrl)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullPostUrl)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(fullPostUrl)}&title=${encodeURIComponent(text)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(fullPostUrl);
        toast({
          title: "Link copied!",
          description: "The article link has been copied to your clipboard."
        });
        return;
    }
    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.title} | TheMwenda Chronicles</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={`${siteUrl}${post.image}`} />
        <meta property="og:url" content={fullPostUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={`${siteUrl}${post.image}`} />
      </Helmet>

      <Header />
      
      <article>
        <div className="relative h-[40vh] min-h-[400px] w-full md:h-[50vh]">
          <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        <div className="container relative -mt-32 max-w-4xl pb-16 md:-mt-40">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="rounded-2xl bg-card p-6 shadow-elegant md:p-10"
          >
            <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to all articles
            </Link>

            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
              {post.category}
            </span>

            <h1 className="mb-6 font-heading text-3xl font-bold leading-tight text-card-foreground md:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <div className="mb-8 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <img alt="Author" className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20" src={authorImage} />
                <div>
                  <p className="font-medium text-card-foreground">Antony Mwenda</p>
                  <p className="text-sm text-muted-foreground">Engineer & Entrepreneur</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 text-nowrap">
                  <Calendar className="h-4 w-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5 text-nowrap">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
              </div>
            </div>

            <div className="mb-8 flex items-center gap-3 border-y border-border py-4">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Share2 className="h-4 w-4" />
                Share:
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleShare("twitter")} aria-label="Share on Twitter">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleShare("facebook")} aria-label="Share on Facebook">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleShare("linkedin")} aria-label="Share on LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleShare("copy")} aria-label="Copy link">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-heading prose-headings:font-bold prose-h2:mt-8 prose-h2:text-2xl prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-card-foreground prose-li:text-muted-foreground">
              {post.content?.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return <h2 key={index} className="text-card-foreground">{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return <p key={index}><strong>{paragraph.replace(/\*\*/g, '')}</strong></p>;
                }
                if (paragraph.trim() === '') {
                  return null;
                }
                return <p key={index}>{paragraph}</p>;
              })}
            </div>

            <div className="mt-12 rounded-xl bg-muted/50 p-6">
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                <img alt="Author" className="h-20 w-20 rounded-full object-cover ring-2 ring-primary/20" src={authorImage2} />
                <div>
                  <h3 className="font-heading text-lg font-semibold text-card-foreground">
                    Written by Antony Mwenda
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Antony is a Civil Engineering student and the founder of Civaro Engineering Ltd. He is dedicated to documenting the build—exploring infrastructure, scaling campus startups, and leveraging AI for business efficiency.
                  </p>
                  <Link to="/about">
                    <Button variant="link" className="mt-2 h-auto p-0 text-primary">
                      Learn more about Mwenda →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* LEAVE A REPLY SECTION (CUSDIS) */}
            <div className="mt-16 border-t border-border pt-10">
              <h3 className="mb-8 font-heading text-2xl font-bold text-card-foreground">Leave a Reply</h3>
              <div className="rounded-xl overflow-hidden">
                <ReactCusdis
                  attrs={{
                    host: 'https://cusdis.com',
                    appId: '4d14ac1f-8d2f-488f-ae37-3d1d356ff691',
                    pageId: post.slug,
                    pageTitle: post.title,
                    pageUrl: fullPostUrl,
                    theme: 'auto'
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="border-t border-border bg-muted/30 py-12 md:py-16">
          <div className="container max-w-6xl">
            <h2 className="mb-8 font-heading text-2xl font-bold text-foreground md:text-3xl">
              Related Articles
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost, index) => (
                <PostCard 
                  key={relatedPost.id} 
                  post={{
                    ...relatedPost,
                    slug: `/post/${relatedPost.slug}`
                  }} 
                  index={index} 
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
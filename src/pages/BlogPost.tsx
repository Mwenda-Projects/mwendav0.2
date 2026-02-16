import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, Share2, Twitter, Facebook, Linkedin, Copy, ShieldAlert, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { ReactCusdis } from 'react-cusdis';
import { useEffect, useState } from "react";
import { Header } from "@/components/blog/Header";
import { Footer } from "@/components/blog/Footer";
import { PostCard } from "@/components/blog/PostCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import authorImage from "@/assets/author.png";
import authorImage2 from "@/assets/author-2.jpg";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPostData() {
      setLoading(true);
      try {
        // 1. Fetch the specific post from Supabase
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (postError) {
          console.error("Supabase Error:", postError.message);
        } else {
          setPost(postData);

          // 2. Fetch related posts from the same category
          const { data: relatedData } = await supabase
            .from('posts')
            .select('*')
            .eq('category', postData.category)
            .neq('slug', slug)
            .limit(3);
          
          setRelatedPosts(relatedData || []);
        }
      } catch (err) {
        console.error("Connection Error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchPostData();

    (window as any).CUSDIS_LOCALE = {
      ...((window as any).CUSDIS_LOCALE || {}),
      post: "This Section Will Be Judged. Please Don't type Recklessly 😂😁"
    };
  }, [slug]);

  const siteUrl = "https://mwendav0-2.vercel.app";
  const fullPostUrl = `${siteUrl}/post/${slug}`;

  const handleShare = (platform: string) => {
    const text = post?.title || "";
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
        toast({ title: "Link copied!", description: "The article link has been copied to your clipboard." });
        return;
    }
    if (shareUrl) window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-center py-20">
        <Header />
        <h1 className="text-3xl font-bold">Post Not Found</h1>
        <Link to="/"><Button className="mt-6">Back to Home</Button></Link>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.title} | TheMwenda Chronicles</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <Header />
      
      <article>
        <div className="relative h-[40vh] min-h-[400px] w-full md:h-[50vh]">
          <img src={post.image_url || post.image} alt={post.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        <div className="container relative -mt-32 max-w-4xl pb-16 md:-mt-40">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="rounded-2xl bg-card p-6 shadow-elegant md:p-10 border border-border/50"
          >
            <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to all articles
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
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(post.created_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.read_time || "3 min"}</span>
              </div>
            </div>

            <div className="mb-8 flex items-center gap-3 border-y border-border py-4">
              <span className="flex items-center gap-2 text-sm text-muted-foreground"><Share2 className="h-4 w-4" /> Share:</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleShare("twitter")}><Twitter className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleShare("facebook")}><Facebook className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleShare("linkedin")}><Linkedin className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleShare("copy")}><Copy className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* FULL CONTENT LOGIC FROM YOUR ORIGINAL FILE */}
            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-heading prose-headings:font-bold prose-h2:mt-8 prose-h2:text-2xl prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-card-foreground">
              {post.content?.split('\n').map((paragraph: string, index: number) => {
                if (paragraph.startsWith('## ')) {
                  return <h2 key={index} className="text-card-foreground">{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return <p key={index}><strong>{paragraph.replace(/\*\*/g, '')}</strong></p>;
                }
                if (paragraph.trim() === '') return null;
                return <p key={index}>{paragraph}</p>;
              })}
            </div>

            <div className="mt-12 rounded-xl bg-muted/50 p-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <img alt="Author" className="h-20 w-20 rounded-full object-cover ring-2 ring-primary/20" src={authorImage2} />
                <div>
                  <h3 className="font-heading text-lg font-semibold text-card-foreground">Written by Antony Mwenda</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Antony is a Civil Engineering student and the founder of Civaro Engineering Ltd.</p>
                </div>
              </div>
            </div>

            {/* CUSDIS SECTION */}
            <div className="mt-20">
              <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                <h3 className="font-heading text-xl font-bold text-card-foreground">The Judgment Zone</h3>
              </div>
              <div className="bg-muted/30 rounded-xl p-6 border border-dashed border-border">
                <ReactCusdis
                  attrs={{
                    host: 'https://cusdis.com',
                    appId: '4d14ac1f-8d2f-488f-ae37-3d1d356ff691',
                    pageId: post.slug,
                    pageTitle: post.title,
                    pageUrl: fullPostUrl,
                    theme: 'auto'
                  }}
                  lang="en"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="border-t border-border bg-muted/30 py-12">
          <div className="container max-w-6xl">
            <h2 className="mb-8 font-heading text-2xl font-bold text-foreground">Related Articles</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost, index) => (
                <PostCard 
                  key={relatedPost.id} 
                  post={{...relatedPost, slug: `/post/${relatedPost.slug}`}} 
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
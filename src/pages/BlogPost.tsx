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
      try {
        setLoading(true);
        
        // 1. Fetch main post
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (postError) {
          console.error("Supabase error:", postError.message);
        } else if (postData) {
          // Format the main post for the UI
          const formattedPost = {
            ...postData,
            date: new Date(postData.created_at).toLocaleDateString(),
            readTime: postData.read_time || "3 min",
            image: postData.image_url || postData.image
          };
          setPost(formattedPost);

          // 2. Fetch related posts
          const { data: relatedData } = await supabase
            .from('posts')
            .select('*')
            .eq('category', postData.category)
            .neq('slug', slug)
            .eq('is_published', true)
            .limit(3);
          
          if (relatedData) {
            // "Translate" related posts for the PostCard component
            const formattedRelated = relatedData.map(p => ({
              ...p,
              date: new Date(p.created_at).toLocaleDateString(),
              readTime: p.read_time || "3 min",
              image: p.image_url || p.image,
              slug: `/post/${p.slug}`
            }));
            setRelatedPosts(formattedRelated);
          }
        }
      } catch (err) {
        console.error("System error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchPostData();
    }

    (window as any).CUSDIS_LOCALE = {
      ...((window as any).CUSDIS_LOCALE || {}),
      post: "This Section Will Be Judged. Please Don't type Recklessly 😂😁"
    };
  }, [slug]);

  const siteUrl = "https://mwendav0-2.vercel.app";
  const fullPostUrl = `${siteUrl}/post/${slug}`;

  const handleShare = (platform: string) => {
    const text = post?.title || "Article";
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
        toast({ title: "Link copied!", description: "The article link has been copied." });
        return;
    }
    if (shareUrl) window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <h1 className="text-3xl font-bold">Post Not Found</h1>
          <p className="mt-4 text-muted-foreground">The chronicle '{slug}' could not be retrieved.</p>
          <Link to="/"><Button className="mt-6"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.title} | TheMwenda Chronicles</title>
      </Helmet>

      <Header />
      
      <article>
        <div className="relative h-[40vh] min-h-[400px] w-full md:h-[50vh]">
          <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        <div className="container relative -mt-32 max-w-4xl pb-16 md:-mt-40">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-card p-6 shadow-elegant md:p-10 border border-border/50">
            <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to all articles
            </Link>

            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary uppercase">
              {post.category}
            </span>

            <h1 className="mb-6 font-heading text-3xl font-bold md:text-5xl">{post.title}</h1>

            <div className="mb-8 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <img alt="Author" className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20" src={authorImage} />
                <div>
                  <p className="font-medium text-card-foreground">Antony Mwenda</p>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {post.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {post.readTime}</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
              {post.content?.split('\n').map((paragraph: string, index: number) => {
                 if (paragraph.startsWith('## ')) return <h2 key={index}>{paragraph.replace('## ', '')}</h2>;
                 if (paragraph.trim() === '') return null;
                 return <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>;
              })}
            </div>

            <div className="mt-12 rounded-xl bg-muted/50 p-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <img alt="Author" className="h-20 w-20 rounded-full object-cover ring-2 ring-primary/20" src={authorImage2} />
                <div>
                  <h3 className="font-bold">Written by Antony Mwenda</h3>
                  <p className="text-sm text-muted-foreground">Civil Engineering student & Founder of Civaro Engineering Ltd.</p>
                </div>
              </div>
            </div>

            {/* Restored Judgment Zone Styling */}
            <div className="mt-16 border-t pt-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold font-heading">The Judgment Zone</h3>
              </div>
              
              <div className="rounded-xl bg-muted/30 p-4 md:p-8 border border-border/50">
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
              <p className="mt-4 text-center text-xs text-muted-foreground italic">
                This Section Will Be Judged. Please Don't type Recklessly 😂😁
              </p>
            </div>
          </motion.div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="bg-muted/30 py-16 border-t border-border">
          <div className="container max-w-6xl">
            <h2 className="mb-8 text-2xl font-bold">Related Articles</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((rp, index) => (
                <PostCard key={rp.id} post={rp} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
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
import { supabase } from "@/lib/supabase"; // THE LIVE LINK
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
      
      // 1. Fetch the specific post from Supabase by slug
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (postError) {
        console.error("Error fetching post:", postError);
      } else {
        setPost(postData);

        // 2. Fetch related posts (same category, different slug)
        const { data: relatedData } = await supabase
          .from('posts')
          .select('*')
          .eq('category', postData.category)
          .neq('slug', slug)
          .limit(3);
        
        setRelatedPosts(relatedData || []);
      }
      setLoading(false);
    }

    if (slug) fetchPostData();

    // Custom Cusdis Warning
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground font-mono">Retrieving the Chronicles...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground">Post Not Found</h1>
          <p className="mt-4 text-muted-foreground">The article you're looking for doesn't exist in Supabase.</p>
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
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <Header />
      
      <article>
        <div className="relative h-[40vh] min-h-[400px] w-full md:h-[50vh]">
          <img src={post.image_url || post.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643"} alt={post.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        <div className="container relative -mt-32 max-w-4xl pb-16 md:-mt-40">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-card p-6 shadow-elegant md:p-10 border border-border/50">
            <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to all articles
            </Link>

            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
              {post.category}
            </span>

            <h1 className="mb-6 font-heading text-3xl font-bold leading-tight text-card-foreground md:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <div className="mb-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
               <div className="flex items-center gap-3">
                 <img alt="Author" className="h-10 w-10 rounded-full object-cover" src={authorImage} />
                 <span className="font-medium text-foreground">{post.author_name || "Antony Mwenda"}</span>
               </div>
               <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(post.created_at).toLocaleDateString()}</span>
               <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.read_time || "3 min"}</span>
            </div>

            <div className="prose prose-lg max-w-none dark:prose-invert prose-p:text-muted-foreground">
              {post.content?.split('\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>

            {/* CUSDIS COMMENT SECTION */}
            <div className="mt-20 border-t pt-10">
              <h3 className="font-heading text-xl font-bold mb-6">The Judgment Zone</h3>
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
          </motion.div>
        </div>
      </article>
      <Footer />
    </div>
  );
}
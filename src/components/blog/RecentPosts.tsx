import { useEffect, useState } from "react";
import { PostCard } from "@/components/blog/PostCard"; // Fixed the path to use the @ alias
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export function RecentPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        // Fetch all published posts, newest first
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching posts:", error.message);
        } else if (data) {
          // Format data to match what PostCard expects exactly
          const formattedPosts = data.map((post) => ({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            category: post.category,
            date: new Date(post.created_at).toLocaleDateString(),
            readTime: post.read_time || "3 min",
            image: post.image_url || post.image,
            slug: `/post/${post.slug}` 
          }));
          setPosts(formattedPosts);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground font-mono text-sm">Loading latest chronicles...</p>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-foreground">Recent Stories</h2>
        <div className="h-px flex-1 bg-border ml-6 hidden md:block" />
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">No posts found in the database yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
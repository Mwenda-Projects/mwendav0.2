import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export function FeaturedCarousel() {
  const [posts, setPosts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        setLoading(true);
        // Fetch the 3 latest published posts for the hero section
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error("Carousel Error:", error.message);
        } else if (data) {
          setPosts(data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  // Auto-play the carousel every 5 seconds
  useEffect(() => {
    if (posts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [posts]);

  if (loading || posts.length === 0) return null;

  const post = posts[currentIndex];

  return (
    <section className="relative h-[500px] w-full overflow-hidden bg-muted md:h-[600px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="relative h-full w-full"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={post.image_url || post.image}
              alt={post.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="container relative flex h-full items-center">
            <div className="max-w-2xl text-white">
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-4 inline-block rounded-full bg-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
              >
                {post.category}
              </motion.span>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6 font-heading text-4xl font-bold leading-tight md:text-6xl"
              >
                {post.title}
              </motion.h1>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-8 flex items-center gap-6 text-sm text-gray-300"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.read_time || "5 min"}
                </span>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link to={`/post/${post.slug}`}>
                    Read Story <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      {posts.length > 1 && (
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {posts.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentIndex ? "w-8 bg-primary" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
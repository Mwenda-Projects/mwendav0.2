import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Header } from "@/components/blog/Header";
import { Footer } from "@/components/blog/Footer";
import { PostCard } from "@/components/blog/PostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { posts } from "@/data/posts";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  // Synchronize internal state with URL params (e.g., when clicking search from Header)
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const searchResults = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    if (!searchTerm) return [];
    
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.category.toLowerCase().includes(searchTerm) ||
        (post.content && post.content.toLowerCase().includes(searchTerm))
    );
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {});
  };

  const clearSearch = () => {
    setQuery("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 font-heading text-4xl font-bold text-foreground md:text-5xl">
            Explore the Build
          </h1>
          <p className="mx-auto max-w-2xl font-body text-lg text-muted-foreground">
            Search through technical deep-dives, startup logs, and infrastructure insights.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="mx-auto mb-12 max-w-2xl"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, category, or engineering keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-14 pl-12 pr-32 text-lg shadow-sm"
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={clearSearch}
                  className="h-10 w-10 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                type="submit"
                className="h-10 px-4 bg-primary hover:bg-primary/90"
              >
                Search
              </Button>
            </div>
          </div>
        </motion.form>

        {query.trim() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
              <p className="text-muted-foreground">
                Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for{" "}
                <span className="font-medium text-foreground italic">"{query}"</span>
              </p>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((post, index) => (
                  <PostCard
                    key={post.id}
                    post={{
                      ...post,
                      slug: `/post/${post.slug}`,
                    }}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border border-dashed rounded-2xl bg-muted/20">
                <p className="text-xl font-medium text-foreground">No matches found.</p>
                <p className="mt-2 text-muted-foreground">
                  Try searching for "AI", "Startup", or "Civil Engineering".
                </p>
                <Button 
                  variant="outline" 
                  className="mt-6"
                  onClick={clearSearch}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {!query.trim() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="py-20 text-center border border-dashed rounded-2xl bg-muted/5"
          >
            <Search className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              Enter a keyword above to scan the archives.
            </p>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
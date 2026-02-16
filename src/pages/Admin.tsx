import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Edit, Trash2, LogOut, Eye, EyeOff, Star, StarOff, LayoutDashboard } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import PostEditor from "@/components/admin/PostEditor";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: string;
  image: string | null;
  author_name: string;
  author_image: string | null;
  author_role: string | null;
  read_time: string;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

const Admin = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Security check: If not logged in, send to auth
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Fetch posts once user is confirmed
  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      toast.error("Horta, posts failed to load.");
      console.error(error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete post");
    } else {
      toast.success("Post deleted permanently");
      fetchPosts();
    }
  };

  const togglePublish = async (post: Post) => {
    const { error } = await supabase
      .from("posts")
      .update({ is_published: !post.is_published })
      .eq("id", post.id);
    
    if (error) {
      toast.error("Status update failed");
    } else {
      toast.success(post.is_published ? "Moved to Drafts" : "Post is Live!");
      fetchPosts();
    }
  };

  const toggleFeatured = async (post: Post) => {
    const { error } = await supabase
      .from("posts")
      .update({ is_featured: !post.is_featured })
      .eq("id", post.id);
    
    if (error) {
      toast.error("Failed to update featured status");
    } else {
      toast.success(post.is_featured ? "Unstarred" : "Starred as Featured");
      fetchPosts();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Logged out safely");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-sm font-medium animate-pulse">Loading the Chronicles...</p>
        </div>
      </div>
    );
  }

  // View Switcher: If editing or creating, show the Editor component
  if (isCreating || editingPost) {
    return (
      <PostEditor
        post={editingPost}
        onClose={() => {
          setIsCreating(false);
          setEditingPost(null);
        }}
        onSave={() => {
          setIsCreating(false);
          setEditingPost(null);
          fetchPosts();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Admin Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-6 h-16 md:h-20 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="font-heading text-xl font-bold tracking-tight">Founder<span className="text-primary text-2xl">.</span></h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold text-primary uppercase tracking-widest">Logged In As</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight font-heading">The Content Vault</h2>
            <p className="text-muted-foreground">Manage your journey and milestones.</p>
          </div>
          <Button onClick={() => setIsCreating(true)} size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5 mr-2" />
            New Chronicle
          </Button>
        </div>

        <Card className="border-border shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border px-8">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              Current Blog Posts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingPosts ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 px-6">
                <div className="bg-muted w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Plus className="text-muted-foreground h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Chronicles Yet</h3>
                <p className="text-muted-foreground mb-6">Ready to share your 19th Birthday story?</p>
                <Button onClick={() => setIsCreating(true)} variant="outline">Start Writing</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/20">
                    <TableRow>
                      <TableHead className="px-8 py-4 text-xs font-bold uppercase tracking-wider">Story Title</TableHead>
                      <TableHead className="py-4 text-xs font-bold uppercase tracking-wider">Category</TableHead>
                      <TableHead className="py-4 text-xs font-bold uppercase tracking-wider">Status</TableHead>
                      <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-center">Featured</TableHead>
                      <TableHead className="py-4 text-xs font-bold uppercase tracking-wider">Created</TableHead>
                      <TableHead className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post.id} className="hover:bg-muted/10 transition-colors">
                        <TableCell className="px-8 py-6 font-semibold max-w-[250px] truncate">
                          {post.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="rounded-lg px-2 py-0 text-[10px] font-bold uppercase tracking-tighter">
                            {post.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={post.is_published ? "default" : "outline"} className="rounded-lg">
                            {post.is_published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {post.is_featured && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mx-auto" />
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </TableCell>
                        <TableCell className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => toggleFeatured(post)} title="Star as Featured">
                              {post.is_featured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => togglePublish(post)} title="Change Visibility">
                              {post.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setEditingPost(post)}>
                              <Edit className="h-4 w-4 text-primary" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-3xl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Chronicle?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{post.title}"? This will remove it from the database permanently.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="rounded-xl">Wait, Go Back</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(post.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                                  >
                                    Yes, Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <footer className="py-12 text-center text-muted-foreground text-xs">
        <p>© 2026 Admin Portal • The Mwenda Chronicles</p>
      </footer>
    </div>
  );
};

// Simple icon for the header card title
const FileText = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);

export default Admin;
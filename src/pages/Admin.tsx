import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Plus, Edit, Trash2, LogOut, Eye, EyeOff, Star, StarOff,
  LayoutDashboard, Image, Upload, X, Loader2, ExternalLink, Clock, Calendar
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
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

interface GalleryItem {
  name: string;
  url: string;
  type: "image" | "video";
}

type ActiveTab = "posts" | "gallery";

const GALLERY_BUCKET = "gallery";

const Admin = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>("posts");

  // Posts state
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);

  // Gallery state
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) fetchPosts();
  }, [user]);

  useEffect(() => {
    if (user && activeTab === "gallery") fetchGallery();
  }, [user, activeTab]);

  // ── Posts ──────────────────────────────────────────────
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
      toast.error("Posts failed to load.");
      console.error(error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) toast.error("Failed to delete post");
    else { toast.success("Post deleted permanently"); fetchPosts(); }
  };

  const togglePublish = async (post: Post) => {
    const { error } = await supabase
      .from("posts").update({ is_published: !post.is_published }).eq("id", post.id);
    if (error) toast.error("Status update failed");
    else { toast.success(post.is_published ? "Moved to Drafts" : "Post is Live!"); fetchPosts(); }
  };

  const toggleFeatured = async (post: Post) => {
    const { error } = await supabase
      .from("posts").update({ is_featured: !post.is_featured }).eq("id", post.id);
    if (error) toast.error("Failed to update featured status");
    else { toast.success(post.is_featured ? "Unstarred" : "Starred as Featured"); fetchPosts(); }
  };

  // ── Gallery ────────────────────────────────────────────
  const fetchGallery = async () => {
    setIsLoadingGallery(true);
    try {
      const { data, error } = await supabase.storage.from(GALLERY_BUCKET).list("", {
        sortBy: { column: "created_at", order: "desc" },
      });
      if (error) throw error;

      const items: GalleryItem[] = (data || [])
        .filter((f) => f.name !== ".emptyFolderPlaceholder")
        .map((file) => {
          const { data: urlData } = supabase.storage
            .from(GALLERY_BUCKET)
            .getPublicUrl(file.name);
          const ext = file.name.split(".").pop()?.toLowerCase() || "";
          const type: "image" | "video" = ["mp4", "mov", "webm", "ogg"].includes(ext)
            ? "video"
            : "image";
          return { name: file.name, url: urlData.publicUrl, type };
        });

      setGalleryItems(items);
    } catch (error) {
      toast.error("Gallery failed to load.");
      console.error(error);
    } finally {
      setIsLoadingGallery(false);
    }
  };

  const uploadFiles = async (files: FileList | File[]) => {
    setIsUploading(true);
    let successCount = 0;

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from(GALLERY_BUCKET)
        .upload(uniqueName, file, { upsert: false });
      if (error) toast.error(`Failed to upload ${file.name}`);
      else successCount++;
    }

    setIsUploading(false);
    if (successCount > 0) {
      toast.success(`${successCount} file${successCount > 1 ? "s" : ""} uploaded!`);
      fetchGallery();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  };

  const handleDeleteMedia = async (name: string) => {
    const { error } = await supabase.storage.from(GALLERY_BUCKET).remove([name]);
    if (error) toast.error("Failed to delete media");
    else { toast.success("Deleted"); fetchGallery(); }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Logged out safely");
    navigate("/auth");
  };

  // ── Loading / Editor views ─────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
          <p className="text-sm font-medium animate-pulse">Loading the Chronicles...</p>
        </div>
      </div>
    );
  }

  if (isCreating || editingPost) {
    return (
      <PostEditor
        post={editingPost}
        onClose={() => { setIsCreating(false); setEditingPost(null); }}
        onSave={() => { setIsCreating(false); setEditingPost(null); fetchPosts(); }}
      />
    );
  }

  // ── Main UI ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-6 h-16 md:h-20 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="font-heading text-xl font-bold tracking-tight">
              Founder<span className="text-primary text-2xl">.</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold text-primary uppercase tracking-widest">Logged In As</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Button
              variant="ghost" size="sm" onClick={handleSignOut}
              className="rounded-full hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight font-heading">The Content Vault</h2>
            <p className="text-muted-foreground">Manage your journey and milestones.</p>
          </div>
          {activeTab === "posts" && (
            <Button
              onClick={() => setIsCreating(true)}
              size="lg"
              className="rounded-full px-8 shadow-lg shadow-primary/20"
            >
              <Plus className="h-5 w-5 mr-2" /> New Chronicle
            </Button>
          )}
          {activeTab === "gallery" && (
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              className="rounded-full px-8 shadow-lg shadow-primary/20"
              disabled={isUploading}
            >
              {isUploading
                ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Uploading...</>
                : <><Upload className="h-5 w-5 mr-2" /> Upload Media</>
              }
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("posts")}
            className={`pb-3 px-1 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "posts"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="h-4 w-4" /> Blog Posts
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`pb-3 px-1 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "gallery"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Image className="h-4 w-4" /> Gallery
          </button>
        </div>

        {/* ── POSTS TAB ── */}
        {activeTab === "posts" && (
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
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-20 px-6">
                  <div className="bg-muted w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Plus className="text-muted-foreground h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No Chronicles Yet</h3>
                  <p className="text-muted-foreground mb-6">Ready to share your story?</p>
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
                          <TableCell className="px-8 py-6 font-semibold max-w-[250px] truncate">{post.title}</TableCell>
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
                            {new Date(post.created_at).toLocaleDateString(undefined, {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => setPreviewPost(post)} title="Preview Post">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => toggleFeatured(post)}>
                                {post.is_featured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => togglePublish(post)}>
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
                                      Are you sure you want to delete "{post.title}"? This is permanent.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="rounded-xl">Go Back</AlertDialogCancel>
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
        )}

        {/* ── GALLERY TAB ── */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-primary/10 rounded-2xl">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Drop files here or click to upload</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Supports JPG, PNG, GIF, WebP, MP4, MOV — multiple files allowed
                  </p>
                </div>
              </div>
            </div>

            {/* Gallery Grid */}
            {isLoadingGallery ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
              </div>
            ) : galleryItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-muted w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Image className="text-muted-foreground h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Media Yet</h3>
                <p className="text-muted-foreground">Upload your first image or video above.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  {galleryItems.length} item{galleryItems.length !== 1 ? "s" : ""} in gallery
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryItems.map((item) => (
                    <div
                      key={item.name}
                      className="group relative rounded-2xl overflow-hidden bg-muted border border-border aspect-square"
                    >
                      {item.type === "video" ? (
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                          muted
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="self-end p-1.5 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors">
                              <X className="h-4 w-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-3xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this media?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove it from your gallery and Supabase Storage.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteMedia(item.name)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <p className="text-white text-xs font-medium truncate">{item.name}</p>
                      </div>

                      {/* Video badge */}
                      {item.type === "video" && (
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          VIDEO
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* ── POST PREVIEW MODAL ── */}
      {previewPost && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm overflow-y-auto p-4 py-10"
          onClick={() => setPreviewPost(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-background rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-background/95 backdrop-blur border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">preview — themwendachronicles.com/blog/{previewPost.slug}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={previewPost.is_published ? "default" : "outline"} className="rounded-lg text-xs">
                  {previewPost.is_published ? "Published" : "Draft"}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  onClick={() => setPreviewPost(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            {previewPost.image && (
              <div className="w-full h-72 overflow-hidden">
                <img
                  src={previewPost.image}
                  alt={previewPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="px-8 py-10">
              {/* Category */}
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-4">
                {previewPost.category}
              </span>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-4 font-heading">
                {previewPost.title}
              </h1>

              {/* Excerpt */}
              {previewPost.excerpt && (
                <p className="text-lg text-muted-foreground leading-relaxed mb-6 border-l-4 border-primary pl-4">
                  {previewPost.excerpt}
                </p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
                {/* Author */}
                <div className="flex items-center gap-2">
                  {previewPost.author_image ? (
                    <img
                      src={previewPost.author_image}
                      alt={previewPost.author_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                      {previewPost.author_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-foreground text-xs">{previewPost.author_name}</p>
                    {previewPost.author_role && (
                      <p className="text-[11px] text-muted-foreground">{previewPost.author_role}</p>
                    )}
                  </div>
                </div>
                <span className="text-border">•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(previewPost.created_at).toLocaleDateString(undefined, {
                    month: "long", day: "numeric", year: "numeric",
                  })}
                </div>
                <span className="text-border">•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {previewPost.read_time}
                </div>
              </div>

              {/* Body Content */}
              <div
                className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-primary prose-img:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: previewPost.content }}
              />
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 flex items-center justify-between px-8 py-4 bg-background/95 backdrop-blur border-t border-border">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => { setPreviewPost(null); setEditingPost(previewPost); }}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit Post
              </Button>
              <Button
                className="rounded-full shadow-lg shadow-primary/20"
                onClick={() => {
                  togglePublish(previewPost);
                  setPreviewPost(null);
                }}
              >
                {previewPost.is_published ? (
                  <><EyeOff className="h-4 w-4 mr-2" /> Unpublish</>
                ) : (
                  <><ExternalLink className="h-4 w-4 mr-2" /> Publish Now</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <footer className="py-12 text-center text-muted-foreground text-xs">
        <p>© 2026 Admin Portal • The Mwenda Chronicles</p>
      </footer>
    </div>
  );
};

const FileText = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export default Admin;
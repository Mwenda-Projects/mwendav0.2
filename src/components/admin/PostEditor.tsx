import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Blockquote from "@tiptap/extension-blockquote";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft, Save, Eye, Edit3,
  Bold, Italic, Underline as UnderlineIcon,
  List, ListOrdered, Link as LinkIcon, Image as ImageIcon,
  Quote, Clock, Calendar
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

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

interface PostEditorProps {
  post?: Post | null;
  onClose: () => void;
  onSave: () => void;
}

const CATEGORIES = [
  "Engineering",
  "Entrepreneurship",
  "AI & Tech",
  "Productivity",
  "Personal Narratives",
  "Hustles & Money-Making",
  "Civil Engineering Journey",
  "Entrepreneurship & Scaling",
];

// ── Toolbar Button ─────────────────────────────────────
const ToolbarBtn = ({
  onClick, active, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    title={title}
    className={`p-2 rounded-lg transition-colors text-sm ${
      active
        ? "bg-primary text-white"
        : "hover:bg-muted text-foreground"
    }`}
  >
    {children}
  </button>
);

// ── Main Component ─────────────────────────────────────
const PostEditor = ({ post, onClose, onSave }: PostEditorProps) => {
  const isEditing = !!post;
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [category, setCategory] = useState(post?.category || "Engineering");
  const [readTime, setReadTime] = useState(post?.read_time || "5 min read");
  const [imageUrl, setImageUrl] = useState(post?.image || "");
  const [authorName, setAuthorName] = useState(post?.author_name || "Antony Menda");
  const [authorRole, setAuthorRole] = useState(post?.author_role || "Founder, Civaro Engineering Ltd");
  const [authorImage, setAuthorImage] = useState(post?.author_image || "/author.png");
  const [isPublished, setIsPublished] = useState(post?.is_published ?? true);
  const [isFeatured, setIsFeatured] = useState(post?.is_featured ?? false);

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing) {
      setSlug(
        title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim()
      );
    }
  }, [title, isEditing]);

  // Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ blockquote: false }),
      Underline,
      Blockquote,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-2xl my-4 max-w-full" } }),
    ],
    content: post?.content || "",
    editorProps: {
      attributes: {
        class:
          "min-h-[420px] px-6 py-5 focus:outline-none prose prose-neutral dark:prose-invert max-w-none prose-headings:font-heading prose-a:text-primary prose-img:rounded-2xl text-foreground",
      },
    },
  });

  // Link insertion
  const handleAddLink = () => {
    const url = window.prompt("Enter URL:");
    if (!url || !editor) return;
    if (editor.state.selection.empty) {
      const text = window.prompt("Link text:") || url;
      editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  // Image insertion
  const handleAddImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url && editor) editor.chain().focus().setImage({ src: url }).run();
  };

  const handleSave = async () => {
    if (!title.trim() || !slug.trim() || !editor) {
      toast.error("Title and slug are required");
      return;
    }

    setIsSaving(true);
    const content = editor.getHTML();

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content,
      category,
      read_time: readTime,
      image: imageUrl || null,
      author_name: authorName,
      author_role: authorRole || null,
      author_image: authorImage || null,
      is_published: isPublished,
      is_featured: isFeatured,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isEditing && post) {
        const { error } = await supabase.from("posts").update(payload).eq("id", post.id);
        if (error) throw error;
        toast.success("Chronicle updated!");
      } else {
        const { error } = await supabase.from("posts").insert([payload]);
        if (error) throw error;
        toast.success("Chronicle published!");
      }
      onSave();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const previewContent = editor?.getHTML() || "";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <h1 className="font-heading font-bold text-lg">
            {isEditing ? "Edit Chronicle" : "New Chronicle"}
          </h1>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-full px-6 shadow-lg shadow-primary/20"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Create Post"}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: Editor / Preview ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Title */}
            <Input
              placeholder="Post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground/40 h-auto py-3"
            />

            {/* Edit / Preview Tab Toggle */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-xl w-fit">
              <button
                onClick={() => setActiveTab("edit")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "edit"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" /> Write
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "preview"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="h-3.5 w-3.5" /> Preview
              </button>
            </div>

            {/* Editor Panel */}
            {activeTab === "edit" && (
              <div className="border border-border rounded-2xl overflow-hidden shadow-sm">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-border bg-muted/30">
                  <ToolbarBtn
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    active={editor?.isActive("bold")}
                    title="Bold"
                  >
                    <Bold className="h-4 w-4" />
                  </ToolbarBtn>
                  <ToolbarBtn
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    active={editor?.isActive("italic")}
                    title="Italic"
                  >
                    <Italic className="h-4 w-4" />
                  </ToolbarBtn>
                  <ToolbarBtn
                    onClick={() => editor?.chain().focus().toggleUnderline().run()}
                    active={editor?.isActive("underline")}
                    title="Underline"
                  >
                    <UnderlineIcon className="h-4 w-4" />
                  </ToolbarBtn>

                  <div className="w-px h-5 bg-border mx-1" />

                  <ToolbarBtn
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    active={editor?.isActive("bulletList")}
                    title="Bullet List"
                  >
                    <List className="h-4 w-4" />
                  </ToolbarBtn>
                  <ToolbarBtn
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    active={editor?.isActive("orderedList")}
                    title="Numbered List"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </ToolbarBtn>

                  <div className="w-px h-5 bg-border mx-1" />

                  <ToolbarBtn
                    onClick={handleAddLink}
                    active={editor?.isActive("link")}
                    title="Add Link"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </ToolbarBtn>
                  <ToolbarBtn
                    onClick={handleAddImage}
                    title="Add Image"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </ToolbarBtn>

                  <div className="w-px h-5 bg-border mx-1" />

                  <ToolbarBtn
                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                    active={editor?.isActive("blockquote")}
                    title="Blockquote"
                  >
                    <Quote className="h-4 w-4" />
                  </ToolbarBtn>
                </div>

                {/* Editor Content */}
                <EditorContent editor={editor} />
              </div>
            )}

            {/* Preview Panel */}
            {activeTab === "preview" && (
              <div className="border border-border rounded-2xl overflow-hidden shadow-sm">
                {/* Fake browser bar */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/30">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono truncate">
                    themwendachronicles.com/blog/{slug || "post-slug"}
                  </span>
                </div>

                {/* Preview Content */}
                <div className="p-8">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-56 object-cover rounded-2xl mb-6"
                    />
                  )}

                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    {category}
                  </span>

                  <h1 className="text-3xl font-extrabold tracking-tight leading-tight mt-2 mb-3 font-heading">
                    {title || "Your post title will appear here..."}
                  </h1>

                  {excerpt && (
                    <p className="text-lg text-muted-foreground border-l-4 border-primary pl-4 mb-4">
                      {excerpt}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
                    <div className="flex items-center gap-2">
                      {authorImage ? (
                        <img src={authorImage} alt={authorName} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                          {authorName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-foreground text-xs">{authorName}</p>
                        {authorRole && <p className="text-[11px]">{authorRole}</p>}
                      </div>
                    </div>
                    <span className="text-border">•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                    </div>
                    <span className="text-border">•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {readTime}
                    </div>
                  </div>

                  {previewContent ? (
                    <div
                      className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-heading prose-a:text-primary prose-img:rounded-2xl"
                      dangerouslySetInnerHTML={{ __html: previewContent }}
                    />
                  ) : (
                    <p className="text-muted-foreground italic">Start writing to see your preview here...</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Post Settings ── */}
          <div className="space-y-6">

            {/* Publish Settings */}
            <div className="border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Publish Settings</h3>

              <div className="flex items-center justify-between">
                <Label htmlFor="published" className="font-medium">Published</Label>
                <Switch id="published" checked={isPublished} onCheckedChange={setIsPublished} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="featured" className="font-medium">Featured</Label>
                <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
              </div>

              <div className="pt-2">
                <Badge variant={isPublished ? "default" : "outline"} className="rounded-lg">
                  {isPublished ? "Will be Live" : "Saved as Draft"}
                </Badge>
              </div>
            </div>

            {/* Post Details */}
            <div className="border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Post Details</h3>

              <div className="space-y-1.5">
                <Label>Slug</Label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-url-slug"
                  className="text-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Excerpt</Label>
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description..."
                  rows={3}
                  className="text-sm resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Read Time</Label>
                <Input
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="5 min read"
                  className="text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Cover Image URL</Label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="text-sm"
                />
                {imageUrl && (
                  <img src={imageUrl} alt="cover" className="w-full h-28 object-cover rounded-xl mt-2" />
                )}
              </div>
            </div>

            {/* Author */}
            <div className="border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Author</h3>

              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Input value={authorRole} onChange={(e) => setAuthorRole(e.target.value)} className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label>Avatar URL</Label>
                <Input value={authorImage} onChange={(e) => setAuthorImage(e.target.value)} className="text-sm" />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default PostEditor;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, X, Image as ImageIcon, ChevronLeft, Play, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const GALLERY_BUCKET = "gallery";

interface GalleryItem {
  name: string;
  url: string;
  type: "image" | "video";
}

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from(GALLERY_BUCKET)
        .list("", { sortBy: { column: "created_at", order: "desc" } });

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
    } catch (err) {
      console.error("Gallery load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (mediaUrl: string, fileName: string) => {
    try {
      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const ext = mediaUrl.split('.').pop()?.split('?')[0] || 'jpg';
      link.download = `${fileName.replace(/\s+/g, '-').toLowerCase()}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(mediaUrl, '_blank');
    }
  };

  // Format file name nicely for display
  const formatName = (name: string) => {
    return name
      .replace(/^\d+-[a-z0-9]+\./, '') // remove timestamp-random prefix
      .replace(/\.[^.]+$/, '')           // remove extension
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      {/* Nav */}
      <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between md:h-20 max-w-6xl mx-auto px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading text-xl font-bold text-foreground md:text-2xl">
              The<span className="text-primary">Mwenda Chronicles</span>
            </span>
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="py-16 px-6 text-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <ImageIcon className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 font-heading">
          The Visual Chronicles
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          A collection of moments, milestones, and the messy process of building empires.
        </p>
      </header>

      {/* Grid */}
      <main className="max-w-6xl mx-auto px-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-muted-foreground text-sm">Loading the chronicles...</p>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="text-center py-32">
            <div className="p-4 bg-muted rounded-2xl w-fit mx-auto mb-4">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Nothing here yet</h3>
            <p className="text-muted-foreground">Check back soon — the visual journey is coming.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item) => (
              <div
                key={item.name}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-muted transition-all duration-500 hover:shadow-2xl border border-border"
                onClick={() => setSelectedItem(item)}
              >
                {/* Media */}
                <div className="relative h-80 w-full overflow-hidden bg-black">
                  {item.type === "video" ? (
                    <>
                      <video
                        src={item.url}
                        className="h-full w-full object-cover opacity-80"
                        muted
                        onMouseOver={(e) => e.currentTarget.play()}
                        onMouseOut={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
                          <Play className="h-8 w-8 text-white fill-white" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <img
                      src={item.url}
                      alt={formatName(item.name)}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>

                {/* Download Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(item.url, item.name);
                  }}
                  className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-primary hover:text-white text-gray-900 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0"
                >
                  <Download className="h-5 w-5" />
                </button>

                {/* Label */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {item.type === "video" && (
                    <span className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1 block">Video</span>
                  )}
                  <h3 className="text-white text-xl font-semibold">{formatName(item.name)}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedItem(null)}
        >
          <button className="absolute top-6 right-6 text-white hover:text-primary transition-colors">
            <X className="h-8 w-8" />
          </button>

          <div
            className="relative max-w-5xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedItem.type === "video" ? (
              <video
                src={selectedItem.url}
                controls
                autoPlay
                className="max-h-[75vh] w-auto rounded-lg shadow-2xl"
              />
            ) : (
              <img
                src={selectedItem.url}
                alt={formatName(selectedItem.name)}
                className="max-h-[75vh] w-auto rounded-lg shadow-2xl"
              />
            )}

            <div className="mt-6 flex items-center gap-4">
              <h3 className="text-white text-xl font-medium">{formatName(selectedItem.name)}</h3>
              <Button
                onClick={() => handleDownload(selectedItem.url, selectedItem.name)}
                className="rounded-full"
              >
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-20 py-10 border-t border-border text-center text-muted-foreground text-sm">
        <p>© 2026 The Mwenda Chronicles • Built with OfliX</p>
      </footer>
    </div>
  );
};

export default Gallery;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, X, Image as ImageIcon, ChevronLeft, Play } from 'lucide-react';
import { Button } from "@/components/ui/button";

// 1. Updated list to support both local images and videos
// For videos, use type: 'video'. For images, use type: 'image'.
const galleryItems = [
  { 
    id: 1, 
    type: 'video', 
    url: '/gallery/oflix-demo.mp4', // Place this in public/gallery/
    title: 'OfliX Platform Demo', 
    category: 'Tech' 
  },
  { 
    id: 2, 
    type: 'image', 
    url: '/gallery/site-visit.jpg', // Place this in public/gallery/
    title: 'Civil Engineering Site Visit', 
    category: 'Engineering' 
  },
  { 
    id: 3, 
    type: 'image', 
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f', 
    title: 'Campus Milestones', 
    category: 'Campus' 
  },
  { 
    id: 4, 
    type: 'image', 
    url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c', 
    title: 'The Vision Board', 
    category: 'Build' 
  }
];

const Gallery = () => {
  const [selectedItem, setSelectedItem] = useState<{url: string, title: string, type: string} | null>(null);

  // Function to handle media download
  const handleDownload = async (mediaUrl: string, fileName: string) => {
    try {
      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Extract extension from url or default to jpg
      const ext = mediaUrl.split('.').pop()?.split('?')[0] || 'jpg';
      link.download = `${fileName.replace(/\s+/g, '-').toLowerCase()}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(mediaUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between md:h-20 max-w-6xl mx-auto px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading text-xl font-bold text-foreground md:text-2xl">
              The<span className="text-primary">Mwenda Chronicles</span>
            </span>
          </Link>
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </div>
      </nav>

      <header className="py-16 px-6 text-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
                <ImageIcon className="h-8 w-8 text-primary" />
            </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 font-heading">The Visual Chronicles</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          A collection of moments, milestones, and the messy process of building empires.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item) => (
            <div 
              key={item.id}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-muted transition-all duration-500 hover:shadow-2xl border border-border"
              onClick={() => setSelectedItem({url: item.url, title: item.title, type: item.type})}
            >
              {/* Media Display */}
              <div className="relative h-80 w-full overflow-hidden bg-black">
                {item.type === 'video' ? (
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
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>
              
              {/* Download Button */}
              <button 
                onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(item.url, item.title);
                }}
                className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-primary hover:text-white text-gray-900 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0"
              >
                <Download className="h-5 w-5" />
              </button>

              {/* Label */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-primary text-xs font-bold uppercase tracking-widest mb-1">{item.category}</span>
                <h3 className="text-white text-xl font-semibold">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedItem(null)}
        >
          <button className="absolute top-6 right-6 text-white hover:text-primary transition-colors">
            <X className="h-8 w-8" />
          </button>
          
          <div className="relative max-w-5xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {selectedItem.type === 'video' ? (
               <video 
                src={selectedItem.url} 
                controls 
                autoPlay 
                className="max-h-[75vh] w-auto rounded-lg shadow-2xl"
               />
            ) : (
              <img 
                src={selectedItem.url} 
                className="max-h-[75vh] w-auto rounded-lg shadow-2xl"
                alt={selectedItem.title}
              />
            )}
            
            <div className="mt-6 flex items-center gap-4">
                <h3 className="text-white text-xl font-medium">{selectedItem.title}</h3>
                <Button 
                    variant="hero" 
                    onClick={() => handleDownload(selectedItem.url, selectedItem.title)}
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
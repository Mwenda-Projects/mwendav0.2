import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, X, Image as ImageIcon, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

// 1. Updated image list with high-quality sources
const galleryImages = [
  { id: 1, url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174', title: 'Deep Work Station', category: 'Build' },
  { id: 2, url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4', title: 'Collaborating on OfliX', category: 'Team' },
  { id: 3, url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f', title: 'Campus Milestones', category: 'Campus' },
  { id: 4, url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c', title: 'The Vision Board', category: 'Build' },
  { id: 5, url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', title: 'Data & Growth', category: 'Money' },
  { id: 6, url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d', title: 'Late Night Coding', category: 'Build' },
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<{url: string, title: string} | null>(null);

  // Function to handle image download
  const handleDownload = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName.replace(/\s+/g, '-').toLowerCase()}-mwenda-chronicles.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: Open in new tab if blob fails
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between md:h-20 max-w-6xl mx-auto">
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
          {galleryImages.map((image) => (
            <div 
              key={image.id}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-muted transition-all duration-500 hover:shadow-2xl border border-border"
            >
              {/* Image */}
              <img 
                src={image.url} 
                alt={image.title}
                className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                onClick={() => setSelectedImage({url: image.url, title: image.title})}
              />
              
              {/* Download Button (Hidden until hover) */}
              <button 
                onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(image.url, image.title);
                }}
                className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-primary hover:text-white text-gray-900 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0"
                title="Download Image"
              >
                <Download className="h-5 w-5" />
              </button>

              {/* Bottom Label */}
              <div 
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                onClick={() => setSelectedImage({url: image.url, title: image.title})}
              >
                <span className="text-primary text-xs font-bold uppercase tracking-widest mb-1">{image.category}</span>
                <h3 className="text-white text-xl font-semibold">{image.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-6 right-6 text-white hover:text-primary transition-colors">
            <X className="h-8 w-8" />
          </button>
          
          <div className="relative max-w-5xl w-full flex flex-col items-center">
            <img 
              src={selectedImage.url} 
              className="max-h-[80vh] w-auto rounded-lg shadow-2xl"
              alt={selectedImage.title}
            />
            <div className="mt-6 flex items-center gap-4">
                <h3 className="text-white text-xl font-medium">{selectedImage.title}</h3>
                <Button 
                    variant="hero" 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(selectedImage.url, selectedImage.title);
                    }}
                >
                    <Download className="mr-2 h-4 w-4" /> Download Full Quality
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
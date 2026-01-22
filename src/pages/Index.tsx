import { Header } from "@/components/blog/Header";
import { FeaturedCarousel } from "@/components/blog/FeaturedCarousel";
import { RecentPosts } from "@/components/blog/RecentPosts";
import { Sidebar } from "@/components/blog/Sidebar";
import { Footer } from "@/components/blog/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-body">
      {/* Top Navigation */}
      <Header />
      
      {/* Hero Section: Featured Content */}
      <FeaturedCarousel />
      
      <main className="container py-8 md:py-12">
        {/* Grid Layout:
          - Single column on mobile
          - Two columns on Large screens (lg:grid-cols-[1fr_360px])
          - Sidebar is fixed at 360px wide on desktop
        */}
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] xl:gap-12">
          {/* Main Feed: Blog Posts */}
          <RecentPosts />
          
          {/* Sidebar: Bio, Categories, & Socials */}
          <Sidebar />
        </div>
      </main>

      {/* Site-wide Footer */}
      <Footer />
    </div>
  );
};

export default Index;
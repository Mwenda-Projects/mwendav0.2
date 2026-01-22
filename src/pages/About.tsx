import { motion } from "framer-motion";
import { Header } from "@/components/blog/Header";
import { Footer } from "@/components/blog/Footer";
import { NewsletterSignup } from "@/components/blog/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { Coffee, HardHat, Briefcase, Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import authorImage3 from "@/assets/author-3.jpg";
import post4 from "@/assets/post-4.jpg";

const About = () => {
  const navigate = useNavigate();

  return <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="mb-12 text-center">
            <h1 className="mb-4 font-heading text-4xl font-bold text-foreground md:text-5xl">Hello, I'm Antony Mwenda</h1>
            <p className="mx-auto max-w-2xl font-body text-lg text-muted-foreground">
              Engineer, Entrepreneur, and Tech Enthusiast documenting the build
            </p>
          </motion.div>

          {/* Author Image */}
          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: 0.1
        }} className="mb-12 overflow-hidden rounded-2xl">
            <img src={post4} alt="Engineering workspace" className="h-64 w-full object-cover md:h-96" />
          </motion.div>

          {/* Story Section */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
          }} transition={{
          delay: 0.2
        }} className="mb-12 grid gap-8 md:grid-cols-[200px_1fr] md:items-start">
            <img alt="Antony Mwenda" className="mx-auto h-48 w-48 rounded-full object-cover ring-4 ring-primary/20 md:mx-0" src={authorImage3} />
            <div className="space-y-4 font-body text-muted-foreground">
              <p className="text-lg leading-relaxed">Welcome to The Mwenda Chronicles, a space where I share my journey as a Civil Engineering student and the founder of Civaro Engineering Ltd. This blog documents my path through infrastructure, business growth, and technology.</p>
              <p className="leading-relaxed">I transitioned from chasing fast-paced routines to building with intention. I realized that scaling a venture requires a blend of technical precision and entrepreneurial grit. This is where I document the lessons learned while balancing engineering studies with real-world business challenges.</p>
              <p className="leading-relaxed">Here, you’ll find deep dives into civil engineering, startup culture, and AI automation. My philosophy is simple: build with integrity, leverage modern tools, and document the process for those following a similar path.</p>
            </div>
          </motion.div>

          {/* Values Section */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3
        }} className="mb-12">
            <h2 className="mb-8 text-center font-heading text-2xl font-bold text-foreground md:text-3xl">
              What I Write About
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[{
              icon: HardHat,
              title: "Civil Engineering",
              description: "Technical insights and site experiences from my journey building Civaro Engineering Ltd."
            }, {
              icon: Briefcase,
              title: "Entrepreneurship",
              description: "Strategies for scaling ventures, managing cash flow, and the mindset of a student founder."
            }, {
              icon: Cpu,
              title: "AI & Tech",
              description: "How I use automation and artificial intelligence to drive productivity and business efficiency."
            }].map((item, index) => <motion.div key={item.title} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.4 + index * 0.1
            }} className="rounded-xl border border-border bg-card p-6 text-center shadow-soft">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-semibold text-card-foreground">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </motion.div>)}
            </div>
          </motion.div>

          {/* Support Section */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.6
        }} className="mb-12 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-8 text-center">
            <Coffee className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
              Support My Work
            </h2>
            <p className="mx-auto mb-6 max-w-md font-body text-muted-foreground">
              If my words have inspired you or brought a moment of calm to your day, 
              consider supporting my work. Every coffee helps me keep creating content 
              that matters.
            </p>
            <Button variant="support" size="lg" onClick={() => navigate("/support")}>
              <Coffee className="h-5 w-5" />
              Buy Me a Coffee
            </Button>
          </motion.div>

          {/* Newsletter */}
          <div className="mx-auto max-w-md">
            <NewsletterSignup />
          </div>
        </div>
      </main>

      <Footer />
    </div>;
};

export default About;
import { motion } from "framer-motion";
import { Header } from "@/components/blog/Header";
import { Footer } from "@/components/blog/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl"
        >
          <h1 className="mb-8 font-heading text-4xl font-bold text-foreground md:text-5xl">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none font-body text-muted-foreground">
            <p className="text-lg">Last updated: 12th January 2026</p>
            
            <h2 className="mt-8 font-heading text-2xl font-semibold text-foreground">
              Information I Collect
            </h2>
            <p>
              When you subscribe to my newsletter, I collect your email address. 
              When you use my contact form, I collect your name, email, and message content.
            </p>
            
            <h2 className="mt-8 font-heading text-2xl font-semibold text-foreground">
              How I Use Your Information
            </h2>
            <p>
              I use your email address to send you my newsletter updates and respond to your inquiries. 
              I do not sell or share your personal information with third parties.
            </p>
            
            <h2 className="mt-8 font-heading text-2xl font-semibold text-foreground">
              Newsletter Subscription
            </h2>
            <p>
              You can unsubscribe from my newsletter at any time by clicking the unsubscribe link 
              included in every email I send.
            </p>
            
            <h2 className="mt-8 font-heading text-2xl font-semibold text-foreground">
              Cookies
            </h2>
            <p>
              I use essential cookies to ensure my blog functions properly. 
              I do not use tracking cookies for advertising purposes.
            </p>
            
            <h2 className="mt-8 font-heading text-2xl font-semibold text-foreground">
              Contact 
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact me at{" "}
              <a href="mailto:mwendantony28@gmail.com" className="text-primary hover:text-accent">
                mwendantony28@gmail.com
              </a>
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;

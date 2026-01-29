import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSignup() {
  return (
    <motion.div
      id="newsletter-section"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl border border-border bg-card p-6 shadow-soft"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-heading text-lg font-semibold text-card-foreground">
          Newsletter
        </h3>
      </div>
      <p className="mb-4 font-body text-sm leading-relaxed text-muted-foreground">
        Get weekly inspiration delivered straight to your inbox. No spam, just good vibes.
      </p>

      {/* We use a standard HTML form submission here. 
        Follow.it handles the "Success" redirect and the confirmation email for you.
      */}
      <form 
        action="https://api.follow.it/subscription-form/emxRMS9nSGo1aE1DZjBhMEcvQ0FSL2ZSdzh5SzRLRGNPMzR3UTE0S2g3cnM5QXkrQy8xMDVQR0ZpOGZhMCtva0QrVUhtZ1g5MkNENWd5RWhmd0pyN0xBQ1JPQjl0M0M3VUZsUmxJRDF2QUVrOGt0eTBPMGI1NGtrMDRZMmo5Y1F8UkQyVG90VVIyTEJzb2doSktUdzEyL2VoMEpHTVBFQXRoOFI4WXM2dzRFTT0=/21" 
        method="post" 
        target="_blank" 
        className="space-y-3"
      >
        <Input
          type="email"
          name="email" // Crucial for Follow.it to find the email address
          placeholder="Enter your email"
          required
        />
        <Button type="submit" variant="hero" className="w-full">
          <div className="flex items-center gap-2">
            Subscribe
            <Send className="h-4 w-4" />
          </div>
        </Button>
      </form>
    </motion.div>
  );
}
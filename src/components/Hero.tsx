import { motion } from "motion/react";
import { Link2, ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-12 text-center max-w-[720px] mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-[36px] font-extrabold tracking-tight text-text-main mb-3 leading-tight">
          Optimize Your Digital Reach
        </h1>
        
        <p className="text-base md:text-[16px] text-text-muted mb-8">
          Shorten, track, and manage your links with high-performance analytics.
        </p>
      </motion.div>
    </section>
  );
}

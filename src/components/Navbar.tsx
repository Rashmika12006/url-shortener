import { motion } from "framer-motion";
import { Link2, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 px-10 flex items-center justify-between border-b border-border-subtle bg-bg/80 backdrop-blur-[10px]">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2"
      >
        <span className="text-xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#818cf8] to-[#c084fc]">
          SWIFTURL
        </span>
      </motion.div>
      
      <div className="flex items-center gap-8">
        <a href="#" className="text-sm font-medium text-text-main">Home</a>
        <a href="#dashboard" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">Dashboard</a>
        
      </div>

      <div>
        <button className="px-4 py-2 border border-border-subtle bg-white/5 text-text-main text-xs font-semibold rounded-md hover:bg-white/10 transition-all">
          Sign Out
        </button>
      </div>
    </nav>
  );
}

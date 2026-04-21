export default function Footer() {
  return (
    <footer className="fixed bottom-6 left-0 right-0 px-10 flex justify-between items-center text-text-muted text-[12px] z-50">
      <div>&copy; 2026 LinkSnap Pro. Built with MERN + AWS.</div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
        API Status: Optimal
      </div>
      <div className="flex gap-4">
        <a href="#" className="hover:text-text-main transition-colors">Privacy Policy</a>
        <span>&bull;</span>
        <a href="#" className="hover:text-text-main transition-colors">Terms of Service</a>
      </div>
    </footer>
  );
}

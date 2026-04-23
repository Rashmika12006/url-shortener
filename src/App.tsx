import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import URLForm from "./components/URLForm";
import URLTable from "./components/URLTable";
import { URLData } from "@/types";
import axios from "axios";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";


export default function App() {
  const [urls, setUrls] = useState<URLData[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ API BASE URL
  const API = import.meta.env.VITE_API_URL;

  const fetchUrls = async () => {
  try {
    const response = await axios.get(`${API}/api/urls`);

    console.log("API RESPONSE:", response.data); // 👈 ADD THIS LINE

   setUrls(response.data.urls || response.data);
  } catch (error) {
    console.error("Failed to fetch URLs", error);
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API}/api/urls/${id}`); // ✅ FIXED
      fetchUrls();
    } catch (error) {
      console.error("Failed to delete URL", error);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  return (
    <div className="min-h-screen bg-bg text-text-main selection:bg-accent/30">
      <div className="atmosphere" />
      <Navbar />

      <main>
        <Hero />

       <div className="min-h-screen bg-bg text-text-main selection:bg-accent/30 relative overflow-hidden">
          <URLForm onSuccess={fetchUrls} />
        </div>

        <section id="dashboard" className="max-w-[1024px] mx-auto px-10 pb-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <p className="text-text-muted mt-1">
                Manage and track your shortened URLs
              </p>
            </div>
<div className="flex items-center gap-4">
  <div className="px-4 py-2 bg-glass border border-border-subtle backdrop-blur-xl rounded-xl text-sm">
    Total Links:
    <span className="text-text-main font-bold">
      {Array.isArray(urls) ? urls.length : 0}
    </span>
  </div>

  <div className="px-4 py-2 bg-glass border border-border-subtle backdrop-blur-xl rounded-xl text-sm">
    Total Clicks:
   <span className="text-text-main font-bold">
  {Array.isArray(urls)
    ? urls.reduce((acc, curr) => acc + (curr.clickCount || 0), 0)
    : 0}
</span>
  </div>
</div>
          </motion.div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-20 w-full bg-white/5 rounded-2xl"
                />
              ))}
            </div>
          ) : (
            <URLTable urls={urls} onDelete={handleDelete} />
          )}
        </section>
      </main>

      <Footer />
      <Toaster position="bottom-right" theme="dark" closeButton />
    </div>
  );
}
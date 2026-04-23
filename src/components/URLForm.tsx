import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

interface URLFormProps {
  onSuccess: () => void;
}

export default function URLForm({ onSuccess }: URLFormProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!url.trim()) return;

    if (!API) {
      toast.error("API URL not configured");
      return;
    }

    setLoading(true);

    try {
      console.log("API:", API);

      const res = await axios.post(`${API}/api/shorten`, { url });

      console.log("Response:", res.data); // 👈 debug (important)

      toast.success("URL shortened successfully!");

      setUrl("");
      onSuccess(); // refresh list
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="max-w-[720px] mx-auto px-4"
    >
      <form
        onSubmit={handleSubmit}
        className="flex items-center p-2 gap-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
      >
        <input
          type="url"
          placeholder="Paste your long URL here..."
          className="flex-1 bg-transparent border-none px-6 py-3 text-white outline-none placeholder:text-gray-400"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />

        <Button
          type="submit"
          disabled={loading}
          className="h-12 px-7 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-semibold shadow-lg"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Shorten Now"
          )}
        </Button>
      </form>
    </motion.div>
  );
}
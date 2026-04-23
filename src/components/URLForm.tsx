import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

interface URLFormProps {
  onSuccess: () => void;
}

export default function URLForm({ onSuccess }: URLFormProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ API BASE URL
const API = import.meta.env.VITE_API_URL;

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!url) return;

  setLoading(true);
  try {
    console.log("API:", API);

    if (!API) {
      toast.error("API URL not configured");
      return;
    }

    await axios.post(`${API}/api/shorten`, { url });

    toast.success("URL shortened successfully!");
    setUrl("");
    onSuccess();
  } catch (error: any) {
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
        className="input-group-container flex items-center p-2 gap-2 backdrop-blur-xl"
      >
        <input
          type="url"
          placeholder="Paste your long URL here..."
          className="flex-1 bg-transparent border-none px-6 py-3 text-white text-base outline-none placeholder:text-text-muted"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />

        <Button
          type="submit"
          disabled={loading}
          className="h-12 px-7 rounded-[10px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-semibold shadow-lg transition duration-200"
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
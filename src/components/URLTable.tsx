import * as React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Trash2, QrCode } from "lucide-react";
import { toast } from "sonner";
import { QRCodeCanvas } from "qrcode.react";

interface URLData {
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
}

interface Props {
  urls: URLData[];
  onDelete: (id: string) => void;
}

export default function URLTable({ urls, onDelete }: Props) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  // ✅ SINGLE SOURCE OF TRUTH (IMPORTANT)
  const API =
    import.meta.env.VITE_API_URL || window.location.origin;

  // ✅ COPY FIXED
  const copyToClipboard = (code: string) => {
  const fullUrl = `${import.meta.env.VITE_API_URL}/r/${code}`;
  navigator.clipboard.writeText(fullUrl);
  toast.success("Link copied!");
};

  return (
    <div className="space-y-4">
      {urls.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          No links yet
        </div>
      ) : (
        Array.isArray(urls) &&
        urls.map((url) => (
          <motion.div
            key={url.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 p-4 rounded-xl flex justify-between items-center"
          >
            {/* LEFT */}
            <div className="flex flex-col gap-1">
              {/* ✅ FIXED SHORT LINK */}
              <a
                href={`${API}/r/${url.shortCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 font-semibold hover:underline"
              >
                /r/{url.shortCode}
              </a>

              {/* ORIGINAL URL */}
              <p className="text-gray-400 text-sm truncate max-w-[300px]">
                {url.originalUrl}
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
              {/* CLICKS */}
              <span className="text-sm text-gray-300">
                {url.clickCount} clicks
              </span>

              {/* COPY */}
              <button
                onClick={() => copyToClipboard(url.shortCode)}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
              >
                <Copy size={16} />
              </button>

              {/* QR CODE */}
              <button
                onClick={() =>
                  setSelectedUrl(`${API}/r/${url.shortCode}`)
                }
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
              >
                <QrCode size={16} />
              </button>

              {/* DELETE */}
              <button
              onClick={() => onDelete(url.shortCode)}
                className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/40"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))
      )}

      {/* QR MODAL */}
      {selectedUrl && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-black p-6 rounded-xl text-center">
            <QRCodeCanvas value={selectedUrl} size={200} />

            <p className="mt-3 text-sm text-gray-400 break-all">
              {selectedUrl}
            </p>

            <button
              onClick={() => setSelectedUrl(null)}
              className="mt-4 px-4 py-2 bg-purple-600 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}